const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({

  nome: String,

  email: {
    type: String,
    unique: true,
    required: true
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

module.exports = mongoose.model("Admin", AdminSchema);