require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const porteiroRoutes = require("./routes/porteiroRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/aluno", alunoRoutes);
app.use("/porteiro", porteiroRoutes);

app.listen(process.env.PORT, () => {
  console.log("Servidor rodando");
});
const confirmacaoRoutes = require(
  "./routes/confirmacaoRoutes"
);

app.use(
  "/confirmacao",
  confirmacaoRoutes
);