const express = require('express');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// guardar tokens válidos
const tokens = new Map();

// gerar token com validade de 5 min
function generateToken() {
  const token = uuidv4();
 const expiresAt = Date.now() + 1 * 60 * 1000; // 1 minuto
  tokens.set(token, expiresAt);
  return token;
}

// token atual
let currentToken = generateToken();

// atualizar a cada 5 minutos
setInterval(() => {
  currentToken = generateToken();
}, 1 * 60 * 1000); // 1 minuto

// rota para pegar o QR
router.get('/qrcode', async (req, res) => {
  try {
    const url = `http://localhost:5000/qr/checkin?token=${currentToken}`;
    const qr = await QRCode.toDataURL(url);

   res.json({ qr, token: currentToken });
  } catch (err) {
    res.status(500).json({ error: "Erro ao gerar QR" });
  }
});

// rota para validar
router.get('/checkin', (req, res) => {
  const { token } = req.query;

  if (!tokens.has(token)) {
    return res.status(400).json({ error: "Token inválido" });
  }

  const expiresAt = tokens.get(token);

  if (Date.now() > expiresAt) {
    tokens.delete(token);
    return res.status(400).json({ error: "Token expirado" });
  }

  res.json({ message: "Check-in válido ✅" });
});

module.exports = router;