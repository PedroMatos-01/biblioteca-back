const emprestimoService = require('../../services/emprestimoService');

class EmprestimoController {
  async store(request, response) {
    const emprestimo = await emprestimoService.criarEmprestimo(
      request.usuarioId,
      request.body.exemplar_id
    );

    return response.status(201).json(emprestimo);
  }

  async index(request, response) {
    const emprestimos = await emprestimoService.listarEmprestimos(
      request.usuarioId,
      request.perfil
    );

    return response.status(200).json(emprestimos);
  }

  async show(request, response) {
    const emprestimo = await emprestimoService.buscarEmprestimo(
      request.params.id,
      request.usuarioId,
      request.perfil
    );

    return response.status(200).json(emprestimo);
  }

  async devolucao(request, response) {
    const emprestimo = await emprestimoService.devolverEmprestimo(request.params.id);

    return response.status(200).json(emprestimo);
  }

  async renovacao(request, response) {
    const emprestimo = await emprestimoService.renovarEmprestimo(
      request.params.id,
      request.usuarioId,
      request.perfil
    );

    return response.status(200).json(emprestimo);
  }
}

module.exports = new EmprestimoController();