const express = require("express");

const router = express.Router();

const {
  salvar,
  listar
} = require(
  "../controllers/confirmacaoController"
);

router.post("/", salvar);

router.get("/", listar);

module.exports = router;