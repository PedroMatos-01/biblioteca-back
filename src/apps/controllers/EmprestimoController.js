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
}

module.exports = new EmprestimoController();