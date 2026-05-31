const express = require("express");

const router = express.Router();

const {
  salvar,
  listar,
  listarPendentes,
  buscarPorId,
  atender,
  concluir
} = require(
  "../controllers/confirmacaoController"
);

router.post("/", salvar);

router.get("/pendentes", listarPendentes);

router.patch("/:id/atender", atender);

router.patch("/:id/concluir", concluir);

router.get("/:id", buscarPorId);

router.get("/", listar);

module.exports = router;
