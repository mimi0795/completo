const Confirmacao = require(
  "../models/Confirmacao"
);

function agoraBrasil() {
  const agora = new Date();

  return {
    data: agora.toLocaleDateString(
      "pt-BR",
      { timeZone: "America/Sao_Paulo" }
    ),
    hora: agora.toLocaleTimeString(
      "pt-BR",
      {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit"
      }
    )
  };
}

exports.salvar = async (req, res) => {

  try {

    const horario = agoraBrasil();

    const confirmacao = await Confirmacao.create({
      ...req.body,
      data: req.body.data || horario.data,
      hora: req.body.hora || horario.hora,
      status: "pendente"
    });

    res.json({
      msg:"Solicitacao enviada para a portaria",
      confirmacao
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

exports.listarPendentes = async (req, res) => {

  try {

    const confirmacoes =
    await Confirmacao.find({
      status:"pendente"
    })
    .sort({ dataCompleta:1 });

    res.json(confirmacoes);

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.buscarPorId = async (req, res) => {

  try {

    const confirmacao =
    await Confirmacao.findById(req.params.id);

    if (!confirmacao) {
      return res.status(404).json({
        msg:"Solicitacao nao encontrada"
      });
    }

    res.json(confirmacao);

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.atender = async (req, res) => {

  try {

    const confirmacao =
    await Confirmacao.findByIdAndUpdate(
      req.params.id,
      { status:"em_atendimento" },
      { new:true }
    );

    if (!confirmacao) {
      return res.status(404).json({
        msg:"Solicitacao nao encontrada"
      });
    }

    res.json(confirmacao);

  } catch (error) {

    res.status(500).json(error);

  }

};

exports.concluir = async (req, res) => {

  try {

    const confirmacao =
    await Confirmacao.findByIdAndUpdate(
      req.params.id,
      { status:"concluida" },
      { new:true }
    );

    if (!confirmacao) {
      return res.status(404).json({
        msg:"Solicitacao nao encontrada"
      });
    }

    res.json(confirmacao);

  } catch (error) {

    res.status(500).json(error);

  }

};
