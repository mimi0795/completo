const express = require("express");
const { v4: uuidv4 } = require("uuid");
const QRCode = require("qrcode");
const Aluno = require("../models/Aluno");
const auth = require("../middleware/auth");

const router = express.Router();


// ✅ Cadastrar aluno (protegido)
router.post("/", auth, async (req, res) => {
  const { nome, matricula, empresa, dataInicio, dataFim } = req.body;

  const qrToken = uuidv4();

  const aluno = new Aluno({
    nome,
    matricula,
    empresa,
    dataInicio,
    dataFim,
    qrToken
  });

  await aluno.save();

  const qrUrl = `${process.env.BASE_URL}/alunos/validar/${qrToken}`;
  const qrImage = await QRCode.toDataURL(qrUrl);

  res.json({
    message: "Aluno cadastrado",
    aluno,
    qrImage
  });
});


// ✅ Validação única
router.get("/validar/:token", async (req, res) => {
  const { token } = req.params;

  const aluno = await Aluno.findOne({ qrToken: token });

  if (!aluno)
    return res.status(404).json({ message: "Aluno não encontrado" });

  const hoje = new Date();

  if (aluno.validado)
    return res.status(400).json({ message: "Já validado" });

  if (hoje < aluno.dataInicio || hoje > aluno.dataFim)
    return res.status(400).json({ message: "Fora do período de estágio" });

  aluno.validado = true;
  aluno.dataValidacao = new Date();

  await aluno.save();

  res.json({ message: "Estágio validado com sucesso" });
});


module.exports = router;