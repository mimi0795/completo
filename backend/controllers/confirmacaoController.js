const Confirmacao = require(
  "../models/Confirmacao"
);

exports.salvar = async (req, res) => {

  try {

    await Confirmacao.create(req.body);

    res.json({
      msg:"Confirmação salva"
    });

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.listar = async (req, res) => {

  try {

    const confirmacoes =
    await Confirmacao.find()
    .sort({ dataCompleta:-1 });

    res.json(confirmacoes);

  } catch (error) {

    res.status(500).json(error);

  }

};