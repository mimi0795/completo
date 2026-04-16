require("dotenv").config();
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
