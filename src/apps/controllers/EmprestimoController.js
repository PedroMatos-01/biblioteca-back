const emprestimoService = require(
  "/Users/Pedro.H/Desktop/Projeto/biblioteca-back/src/services/emprestimoService"
);

class EmprestimoController {
  async store(request, response) {
    try {
      const idUsuario = request.usuarioId;
      const { exemplar_id } = request.body;

      const emprestimo = await emprestimoService.criarEmprestimo(idUsuario, exemplar_id);

      return response.status(201).json(emprestimo);
    } catch (erro) {
      console.error(erro);
      const status = erro.status || 500;
      const mensagem = erro.status ? erro.message : "Erro interno do servidor";
      return response.status(status).json({ mensagem });
    }
  }

  async index(request, response) {
    try {
      const emprestimos = await emprestimoService.listarEmprestimos(
        request.usuarioId,
        request.perfil
      );

      return response.status(200).json(emprestimos);
    } catch (erro) {
      console.error(erro);
      const status = erro.status || 500;
      const mensagem = erro.status ? erro.message : "Erro interno do servidor";
      return response.status(status).json({ mensagem });
    }
  }

  async show(request, response) {
  try {
    const emprestimo = await emprestimoService.buscarEmprestimo(
      request.params.id,       
      request.usuarioId,        
      request.perfil
    );

    return response.status(200).json(emprestimo);
  } catch (erro) {
      console.error(erro);
      const status = erro.status || 500;
      const mensagem = erro.status ? erro.message : "Erro interno do servidor";
      return response.status(status).json({ mensagem });
  }
}

async devolucao(request, response) {
  try {
    if (request.perfil !== "administrador") {
      return response.status(403).json({
        mensagem: "Apenas administradores podem registrar devolucoes",
      });
    }

    const emprestimo = await emprestimoService.devolverEmprestimo(request.params.id);

    return response.status(200).json(emprestimo);
  } catch (erro) {
    console.error(erro);
    const status = erro.status || 500;
    const mensagem = erro.status ? erro.message : "Erro interno do servidor";
    return response.status(status).json({ mensagem });
  }
}

async renovacao(request, response) {
  try {
    const emprestimo = await emprestimoService.renovarEmprestimo(
      request.params.id,
      request.usuarioId,
      request.perfil
    );

    return response.status(200).json(emprestimo);
  } catch (erro) {
    console.error(erro);
    const status = erro.status || 500;
    const mensagem = erro.status ? erro.message : "Erro interno do servidor";
    return response.status(status).json({ mensagem });
  }
}

}

module.exports = new EmprestimoController();