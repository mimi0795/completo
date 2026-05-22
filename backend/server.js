require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const porteiroRoutes = require("./routes/porteiroRoutes");

const app = express();

connectDB();

app.use(cors({
  origin: "https://completo-1-9no9.onrender.com"
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.use("/admin", adminRoutes);
app.use("/aluno", alunoRoutes);
app.use("/porteiro", porteiroRoutes);
const confirmacaoRoutes = require(
  "./routes/confirmacaoRoutes"
);

app.use(
  "/confirmacao",
  confirmacaoRoutes
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});