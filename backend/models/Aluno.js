const mongoose = require("mongoose");

const alunoSchema = new mongoose.Schema({
  nome: String,
  matricula: String,
  empresa: String,
  dataInicio: Date,
  dataFim: Date,
  qrToken: String,
  validado: { type: Boolean, default: false },
  dataValidacao: Date
});

module.exports = mongoose.model("Aluno", alunoSchema);