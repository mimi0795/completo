const mongoose = require("mongoose");

const registroSchema = new mongoose.Schema({
  alunoId: String,
  nome: String,
  horario: Date
});

module.exports = mongoose.model("Registro", registroSchema);

const Registro = require("./models/Registro");

socket.on("confirmarSaida", async (id) => {

  const aluno = await Aluno.findById(id);

  await Registro.create({
    alunoId: aluno._id,
    nome: aluno.nome,
    horario: new Date()
  });

});
router.get("/relatorio", async (req, res) => {
  const registros = await Registro.find();
  res.json(registros);
});