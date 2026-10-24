const Exemplar = require("../apps/models/Exemplar");
const Emprestimo = require("../apps/models/Emprestimo");

async function criarEmprestimo(idUsuario, idExemplar) {
    const transacao = await Exemplar.sequelize.transaction();

  try {
    // 1. Buscar o exemplar. Se não existir -> erro 404

    const exemplar = await Exemplar.findByPk(idExemplar, { transaction: transacao }); 
    //prucura no banco , se nao encontrado exemplar=null
    if(!exemplar){
        const erro = new Error("Exemplar nao encontrado");
        erro.status = 404;
        throw erro;//vai para o catch dando erro 
    }

    // 2. Se o status não for "disponivel" -> erro 409 (conflito)
    if (exemplar.status !== "disponivel" ) {
        const erro = new Error("Exemplar indisponível");
        erro.status = 409;
        throw erro;
    }


    // 3. Contar os empréstimos ativos do usuário. Se já tem 3 -> erro 400

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

    // 4. Calcular dataRetirada (hoje) e dataPrevista (hoje + 14 dias)

    const hoje = new Date();
    const dataPrevista = new Date(hoje);
    dataPrevista.setDate(dataPrevista.getDate() + 14);


    // 5. Criar o empréstimo
    const emprestimo = await Emprestimo.create({
        usuario_id: idUsuario,
        exemplar_id: idExemplar,
        data_retirada: hoje,
        data_prevista_devolucao: dataPrevista,
        status: "ativo"
    }, {
        transaction: transacao
    });


    // 6. Mudar o status do exemplar para "emprestado"

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

module.exports = {criarEmprestimo};