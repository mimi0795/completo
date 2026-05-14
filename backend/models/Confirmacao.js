const mongoose = require("mongoose");

const ConfirmacaoSchema = new mongoose.Schema({

  nome:String,

  email:String,

  alunoId:String,

  data:String,

  hora:String,

  dataCompleta:{
    type:Date,
    default:Date.now
  }

});

module.exports = mongoose.model(
  "Confirmacao",
  ConfirmacaoSchema
);