const Aluno = require("../models/Aluno");
const jwt = require("jsonwebtoken");

exports.cadastro = async (req, res) => {
  try {
    const {
      nome,
      email,
      senha,
      matricula,
      curso,
      periodo,
      estagio,
      frequencia
    } = req.body;

    const existe = await Aluno.findOne({ email });

    if (existe) {
      return res.status(400).json({
        msg: "Aluno ja existe"
      });
    }

    const aluno = await Aluno.create({
      nome,
      email,
      senha,
      matricula,
      curso,
      periodo,
      estagio,
      frequencia
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
        msg: "Email nao encontrado"
      });
    }

    if (senha !== aluno.senha) {
      return res.status(400).json({
        msg: "Login invalido"
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

exports.buscarPorId = async (req, res) => {
  try {
    const aluno = await Aluno.findById(req.params.id);

    if (!aluno) {
      return res.status(404).json({
        msg: "Aluno nao encontrado"
      });
    }

    res.json(aluno);
  } catch (error) {
    res.status(500).json(error);
  }
};
