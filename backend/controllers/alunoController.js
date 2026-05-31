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
    if (
      error.code === 11000 &&
      error.keyPattern?.senha
    ) {
      return res.status(400).json({
        msg: "Essa senha ja existe"
      });
    }

    if (
      error.code === 11000 &&
      error.keyPattern?.email
    ) {
      return res.status(400).json({
        msg: "Esse email ja existe"
      });
    }

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

exports.registrarFrequencia = async (req, res) => {
  try {
    const { status } = req.body;
    const agora = new Date();

    const registro = {
      data: agora.toLocaleDateString("pt-BR", {
        timeZone: "America/Sao_Paulo"
      }),
      hora: agora.toLocaleTimeString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit"
      }),
      status: status || "Saida"
    };

    const aluno = await Aluno.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          frequencia: {
            $each: [registro],
            $position: 0
          }
        }
      },
      { new: true }
    );

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

exports.deletar = async (req, res) => {
  try {
    const aluno = await Aluno.findByIdAndDelete(req.params.id);

    if (!aluno) {
      return res.status(404).json({
        msg: "Aluno nao encontrado"
      });
    }

    res.json({
      msg: "Aluno deletado com sucesso"
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
