const Redis = require("ioredis");
const mongoose = require("mongoose");

// Conexão com o MongoDB
mongoose
  .connect("mongodb://mongodb:27017/mydatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB conectado no consumidor"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB:", err));

// Modelo do MongoDB
const DataSchema = new mongoose.Schema({
  id: Number, // Identificador único
  name: String, // Nome da tarefa
  timestamp: { type: Date, default: Date.now }, // Carimbo de data/hora
});
const DataModel = mongoose.model("Data", DataSchema);

// Configuração do Redis
const redis = new Redis({
  host: "redis", // Nome do serviço Redis definido no docker-compose
  port: 6379, // Porta padrão do Redis
});
redis.on("connect", () => console.log("Redis conectado no consumidor!"));
redis.on("error", (err) => console.error("Erro ao conectar ao Redis:", err));

// Consumidor da fila
const consumeMessage = async (queue) => {
  while (true) {
    try {
      // Aguarda até receber uma mensagem
      const message = await redis.blpop(queue, 0);
      const data = JSON.parse(message[1]); // Converte a mensagem de string para JSON

      // Processa a mensagem e salva no MongoDB
      const newData = new DataModel(data.data); // Salva apenas o campo "data"
      await newData.save();
      console.log("Mensagem processada e salva no MongoDB:", data);
    } catch (error) {
      console.error("Erro ao processar mensagem:", error);
    }
  }
};

// Consumir mensagens da fila "myQueue"
consumeMessage("myQueue");
