const mongoose = require("mongoose");

const PorteiroSchema = new mongoose.Schema({

  nome: String,

  email: {
    type: String,
    unique: true
  },

  senha: String,

  criadoEm: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Porteiro", PorteiroSchema);