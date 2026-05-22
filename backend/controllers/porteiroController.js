const Porteiro = require("../models/Porteiro");

const jwt = require("jsonwebtoken");

exports.cadastro = async (req, res) => {

  try {

    const {
      nome,
      email,
      senha
    } = req.body;

    const existe =
    await Porteiro.findOne({
      email
    });

    if (existe) {

      return res.status(400).json({
        msg: "Porteiro já existe"
      });

    }

    // Verifica senha
        const senhaExiste = await Admin.findOne({ senha });
    
        if (senhaExiste) {
          return res.status(400).json({
            msg: "Esta senha já está em uso"
          });
        }

    const porteiro =
    await Porteiro.create({

      nome,
      email,
      senha

    });

    res.status(201).json(
      porteiro
    );

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.login = async (req, res) => {

  try {

    const {
      email,
      senha
    } = req.body;

    const porteiro =
    await Porteiro.findOne({
      email
    });

    if (!porteiro) {

      return res.status(400).json({
        msg: "Email não encontrado"
      });

    }

    /* =========================
       VERIFICA SENHA
    ========================= */

    if (senha !== porteiro.senha) {

      return res.status(400).json({
        msg: "Login inválido"
      });

    }

     

    /* =========================
       TOKEN
    ========================= */

    const token = jwt.sign(

      {
        id: porteiro._id
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d"
      }

    );

    res.json({

      token,
      porteiro

    });

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.listar = async (req, res) => {

  try {

    const porteiros =
    await Porteiro.find()
    .sort({ criadoEm: -1 });

    res.json(porteiros);

  } catch (error) {

    res.status(500).json(error);

  }

};