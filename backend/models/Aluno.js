const mongoose = require("mongoose");

const FrequenciaSchema = new mongoose.Schema(
  {
    data: String,
    hora: String,
    status: String
  },
  { _id: false }
);

const EstagioSchema = new mongoose.Schema(
  {
    empresa: String,
    cargo: String,
    supervisor: String,
    dataInicio: String,
    dataFim: String,
    endereco: String
  },
  { _id: false }
);

const AlunoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    senha: {
      type: String,
      required: true
    },

    matricula: {
      type: String,
      default: ""
    },

    curso: {
      type: String,
      default: ""
    },

    periodo: {
      type: String,
      default: ""
    },

    estagio: {
      type: EstagioSchema,
      default: () => ({})
    },

    frequencia: {
      type: [FrequenciaSchema],
      default: []
    },

    criadoEm: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Aluno", AlunoSchema);
