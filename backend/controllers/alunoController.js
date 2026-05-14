const Aluno = require("../models/Aluno");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.cadastro = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const existe = await Aluno.findOne({ email });

    if (existe) {
      return res.status(400).json({
        msg: "Aluno já existe"
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const aluno = await Aluno.create({
      nome,
      email,
      senha: senhaHash
    });

    res.status(201).json(aluno);

  } catch (error) {
    res.status(500).json(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const aluno = await Aluno.findOne({ email });

    if (!aluno) {
      return res.status(400).json({
        msg: "Email não encontrado"
      });
    }

    const senhaCorreta = await bcrypt.compare(
      senha,
      aluno.senha
    );

    if (!senhaCorreta) {
      return res.status(400).json({
        msg: "Senha incorreta"
      });
    }

    const token = jwt.sign(
      { id: aluno._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      aluno
    });

  } catch (error) {
    res.status(500).json(error);
  }
};
exports.listar = async (req, res) => {

  try {

    const alunos = await Aluno.find()
    .sort({ criadoEm: -1 });

    res.json(alunos);

  } catch (error) {

    res.status(500).json(error);

  }

};