const express = require("express");
const Registro = require("../models/Registro");

const router = express.Router();


// 📊 Listar todos os registros (relatório)
router.get("/", async (req, res) => {
  try {
    const registros = await Registro.find().sort({ horario: -1 });
    res.json(registros);
  } catch (err) {
    res.status(500).json({ message: "Erro ao buscar registros" });
  }
});


// 📅 Filtrar por data (opcional - mais profissional)
router.get("/data", async (req, res) => {
  try {
    const { inicio, fim } = req.query;

    const registros = await Registro.find({
      horario: {
        $gte: new Date(inicio),
        $lte: new Date(fim)
      }
    });

    res.json(registros);
  } catch (err) {
    res.status(500).json({ message: "Erro ao filtrar" });
  }
});

module.exports = router;