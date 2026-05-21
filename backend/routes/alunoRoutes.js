const express = require("express");
const router = express.Router();

const {
  cadastro,
  login,
  listar,
  buscarPorId
} = require("../controllers/alunoController");

router.post("/cadastro", cadastro);
router.post("/login", login);
router.get("/listar", listar);
router.get("/lista", listar);
router.get("/:id", buscarPorId);

module.exports = router;
