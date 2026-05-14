const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.cadastro = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const existe = await Admin.findOne({ email });

    if (existe) {
      return res.status(400).json({
        msg: "Administrador já existe"
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const admin = await Admin.create({
      nome,
      email,
      senha: senhaHash
    });

    res.status(201).json(admin);

  } catch (error) {
    res.status(500).json(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({
        msg: "Email não encontrado"
      });
    }

    const senhaCorreta = await bcrypt.compare(
      senha,
      admin.senha
    );

    if (!senhaCorreta) {
      return res.status(400).json({
        msg: "Senha incorreta"
      });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      admin
    });

  } catch (error) {
    res.status(500).json(error);
  }
};
exports.listar = async (req, res) => {

  try {

    const admins = await Admin.find()
    .sort({ criadoEm: -1 });

    res.json(admins);

  } catch (error) {

    res.status(500).json(error);

  }

};