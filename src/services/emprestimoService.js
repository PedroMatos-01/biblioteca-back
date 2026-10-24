const Exemplar = require("../apps/models/Exemplar");
const Emprestimo = require("../apps/models/Emprestimo");

async function criarEmprestimo(idUsuario, idExemplar) {
    const transacao = await Exemplar.sequelize.transaction();

  try {

    const exemplar = await Exemplar.findByPk(idExemplar, { transaction: transacao }); 
    if(!exemplar){
        const erro = new Error("Exemplar nao encontrado");
        erro.status = 404;
        throw erro;
    }

    if (exemplar.status !== "disponivel" ) {
        const erro = new Error("Exemplar indisponível");
        erro.status = 409;
        throw erro;
    }


    const qntdEmprestimo = await Emprestimo.count({
        where: {
            usuario_id: idUsuario,
            status: 'ativo'
        },
        transaction: transacao
    });

    if (qntdEmprestimo >= 3) {
        const erro = new Error("Limite de empréstimos atingido");
        erro.status = 400;
        throw erro;
    }

    const hoje = new Date();
    const dataPrevista = new Date(hoje);
    dataPrevista.setDate(dataPrevista.getDate() + 14);


    const emprestimo = await Emprestimo.create({
        usuario_id: idUsuario,
        exemplar_id: idExemplar,
        data_retirada: hoje,
        data_prevista_devolucao: dataPrevista,
        status: "ativo"
    }, {
        transaction: transacao
    });


    exemplar.status = "emprestado";
    await exemplar.save({
        transaction: transacao
    });

    await transacao.commit();
    return emprestimo;
    
  } catch (erro) {
    await transacao.rollback();
    throw erro;
  }
}

async function listarEmprestimos(idUsuario, perfil) {
  const filtro = {};

    if (perfil !== "administrador") {
        filtro.usuario_id = idUsuario;
    }

  const emprestimos = await Emprestimo.findAll({
    where: filtro,
    order: [["created_at", "DESC"]],
  });

  return emprestimos;
}

async function buscarEmprestimo(idEmprestimo, idUsuario, perfil) {
    const emprestimo = await Emprestimo.findByPk(idEmprestimo);

    if (!emprestimo) {
        const erro = new Error("Emprestimo nao encontrado");
        erro.status = 404;
        throw erro;
    }

    if (perfil !== "administrador" && String(emprestimo.usuario_id) !== String(idUsuario)) {
        const erro = new Error("Emprestimo nao encontrado");
        erro.status = 404;
        throw erro;
    }

    return emprestimo;
}

const VALOR_MULTA_POR_DIA = 1.0;

async function devolverEmprestimo(idEmprestimo) {
  const transacao = await Emprestimo.sequelize.transaction();

  try {
    const emprestimo = await Emprestimo.findByPk(idEmprestimo, {
      transaction: transacao,
    });

    if (!emprestimo) {
      const erro = new Error("Emprestimo nao encontrado");
      erro.status = 404;
      throw erro;
    }

    if (emprestimo.status !== "ativo") {
      const erro = new Error("Empréstimo já devolvido ou cancelado");
      erro.status = 409;
      throw erro;
    }

    const hoje = new Date();
    const dataPrevista = new Date(emprestimo.data_prevista_devolucao);
    const diferencaEmDias = Math.ceil(
      (hoje.getTime() - dataPrevista.getTime()) / (1000 * 60 * 60 * 24)
    );
    const diasAtraso = Math.max(0, diferencaEmDias);
    const valorMulta = diasAtraso * VALOR_MULTA_POR_DIA;

    emprestimo.status = "devolvido";
    emprestimo.data_devolucao = hoje;
    emprestimo.valor_multa = valorMulta;
    await emprestimo.save({ transaction: transacao });

    const exemplar = await Exemplar.findByPk(emprestimo.exemplar_id, {
      transaction: transacao,
    });

    if (!exemplar) {
      const erro = new Error("Exemplar nao encontrado");
      erro.status = 404;
      throw erro;
    }

    exemplar.status = "disponivel";
    await exemplar.save({ transaction: transacao });

    await transacao.commit();
    return emprestimo;
  } catch (erro) {
    await transacao.rollback();
    throw erro;
  }
}

const LIMITE_RENOVACOES = 3;
const PRAZO_EMPRESTIMO_DIAS = 14;

async function renovarEmprestimo(idEmprestimo, idUsuario, perfil) {
    const emprestimo = await Emprestimo.findByPk(idEmprestimo);

    if (!emprestimo) {
        const erro = new Error("Emprestimo nao encontrado");
        erro.status = 404;
        throw erro;
    }


    if (perfil !== "administrador" && String(emprestimo.usuario_id) !== String(idUsuario)) {
        const erro = new Error("Emprestimo nao encontrado");
        erro.status = 404;
        throw erro;
    }

    if (emprestimo.status !== "ativo") {
      const erro = new Error("Empréstimo já devolvido ou cancelado");
      erro.status = 409;
      throw erro;
    }

    if (new Date(emprestimo.data_prevista_devolucao) < new Date()) {
      const erro = new Error("Não é possível renovar um empréstimo em atraso");
      erro.status = 400;
      throw erro;
    }

    if ((emprestimo.renovacoes || 0) >= LIMITE_RENOVACOES) {
      const erro = new Error("Limite de renovações atingido");
      erro.status = 400;
      throw erro;
    }

    const novaDataPrevista = new Date(emprestimo.data_prevista_devolucao);
    novaDataPrevista.setDate(novaDataPrevista.getDate() + PRAZO_EMPRESTIMO_DIAS);
    emprestimo.data_prevista_devolucao = novaDataPrevista;
    emprestimo.renovacoes = (emprestimo.renovacoes || 0) + 1;
    await emprestimo.save();

  return emprestimo;
}


module.exports = {
  criarEmprestimo,
  listarEmprestimos,
  buscarEmprestimo,
  devolverEmprestimo,
  renovarEmprestimo
};