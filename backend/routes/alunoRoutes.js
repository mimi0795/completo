const express = require("express");
const router = express.Router();

const {
  cadastro,
  login,
  listar,
  buscarPorId,
  registrarFrequencia,
  deletar
} = require("../controllers/alunoController");

router.post("/cadastro", cadastro);
router.post("/login", login);
router.get("/listar", listar);
router.get("/lista", listar);
router.post("/:id/frequencia", registrarFrequencia);
router.delete("/deletar/:id", deletar);
router.get("/:id", buscarPorId);

module.exports = router;
