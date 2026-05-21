const express = require("express");
const router = express.Router();

const {
  cadastro,
  login,
  listar
} = require("../controllers/alunoController");

router.post("/cadastro", cadastro);
router.post("/login", login);
router.get("/listar", listar);


router.get('/lista', async (req, res) => {

  try {

    const alunos =
    await Aluno.find()
    .sort({ createdAt: -1 });

    res.json(alunos);

  } catch (error) {

    res.status(500).json({
      msg: 'Erro ao buscar alunos'
    });

  }

});


const Aluno = require('../models/Aluno');

router.get('/lista', async (req, res) => {

  try {

    const alunos =
    await Aluno.find();

    res.json(alunos);

  } catch (error) {

    res.status(500).json({
      msg: 'Erro ao buscar alunos'
    });

  }

});


const express =
require('express');

const jwt =
require('jsonwebtoken');

const router =
express.Router();

const Aluno =
require('../models/Aluno');

module.exports = router;