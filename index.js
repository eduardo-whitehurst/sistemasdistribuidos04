const express = require("express");
const Redis = require("ioredis");
const mongoose = require("mongoose");

// Configuração do Express
const app = express();
app.use(express.json()); // Permite o uso de JSON no corpo das requisições

// Configuração do Redis (Message Broker)
const redis = new Redis({
  host: "redis", // Nome do serviço Redis definido no docker-compose
  port: 6379, // Porta padrão do Redis
});
redis.on("connect", () => console.log("Redis conectado!"));
redis.on("error", (err) => console.error("Erro ao conectar ao Redis:", err));

// Configuração do MongoDB (Banco de Dados)
mongoose
  .connect("mongodb://mongodb:27017/mydatabase", {
    // "mongodb" é o nome do serviço no docker-compose
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado!"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Definição do modelo de dados para o MongoDB
const DataSchema = new mongoose.Schema({
  id: Number, // Identificador único
  name: String, // Nome da tarefa
  timestamp: { type: Date, default: Date.now }, // Carimbo de data/hora
});
const DataModel = mongoose.model("Data", DataSchema);

// Endpoint para criar uma tarefa (publicar no Redis)
app.post("/task", async (req, res) => {
  const { action, data } = req.body;

  // Validação básica dos parâmetros
  if (!action || !data) {
    return res.status(400).json({ error: "Parâmetros inválidos" });
  }

  try {
    // Publica a mensagem no Redis
    await redis.rpush("myQueue", JSON.stringify({ action, data }));
    res.status(202).json({ message: "Tarefa enfileirada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enfileirar a mensagem:", error);
    res.status(500).json({ error: "Erro ao processar a tarefa" });
  }
});

// Inicializa o servidor Express
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
