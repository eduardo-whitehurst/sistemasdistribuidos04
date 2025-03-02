const express = require("express");
const Redis = require("ioredis");
const mongoose = require("mongoose");

// Configuração do Express
const app = express();
app.use(express.json());

// Configuração do Redis
const redis = new Redis({
  host: 'redis', // Nome do serviço no Docker Compose
  port: 6379
});
redis.on("connect", () => console.log("Redis conectado!"));
redis.on("error", (err) => console.error("Erro ao conectar ao Redis:", err));

// Configuração do MongoDB
mongoose.connect("mongodb://mongodb:27017/mydatabase", { // "mongodb" é o nome do serviço no Docker Compose
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Modelo para salvar dados no MongoDB
const DataSchema = new mongoose.Schema({
  id: Number,
  name: String,
  timestamp: { type: Date, default: Date.now },
});
const DataModel = mongoose.model("Data", DataSchema);

// Endpoint para criar uma tarefa (publicar no Redis)
app.post("/task", async (req, res) => {
  const { action, data } = req.body;

  if (!action || !data) {
    return res.status(400).json({ error: "Parâmetros inválidos" });
  }

  try {
    await redis.rpush("myQueue", JSON.stringify({ action, data }));
    res.status(202).json({ message: "Tarefa enfileirada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enfileirar a mensagem:", error);
    res.status(500).json({ error: "Erro ao processar a tarefa" });
  }
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
