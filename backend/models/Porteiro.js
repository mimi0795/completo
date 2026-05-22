const mongoose = require("mongoose");

const PorteiroSchema = new mongoose.Schema({

  nome: String,

  email: {
    type: String,
    unique: true
  },
senha: {
    type: String,
    unique: true,
    required: true
  },

  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Porteiro", PorteiroSchema);