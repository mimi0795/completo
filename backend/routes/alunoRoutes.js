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

module.exports = router;