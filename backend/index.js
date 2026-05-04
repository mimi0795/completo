require('dotenv').config({ path: __dirname + '/.env' })
require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const app = express();
const qrRoutes = require('./routes/qrRoutes');
app.use('/qr', qrRoutes);
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log(err));

app.use("/auth", authRoutes);
app.use("/alunos", alunoRoutes);

app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000");
});
console.log("MONGO_URI:", process.env.MONGO_URI)

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

global.io = io;

// 🔁 confirmação da portaria
io.on("connection", (socket) => {

  socket.on("confirmarSaida", async (id) => {

    const Aluno = require("./models/Aluno");
    const aluno = await Aluno.findById(id);

    if (!aluno) return;

    aluno.dataSaida = new Date();
    await aluno.save();

  });

});

server.listen(process.env.PORT, () => {
  console.log("Servidor rodando");
});