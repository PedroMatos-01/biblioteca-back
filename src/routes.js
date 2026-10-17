const { Router } = require('express');
const routes = new Router();
const authorization = require('./apps/middlewares/authorization');




const ExemplarControllers = require('./apps/controllers/ExemplarController');
const LivroControllers = require('./apps/controllers/LivroControllers');
const UsuarioController = require('./apps/controllers/UsuarioController');
const AuthController = require('./apps/controllers/AuthController');
const AutheticationMiddleware = require('./apps/middlewares/authentication');


routes.get('/health', (req, res) => {
    return res.send({ message: 'Connected withew sucesse' });
});
routes.post('/usuarios', UsuarioController.create);


routes.post('/auth', AuthController.authentication);
routes.post('/auth/esqueci-senha', AuthController.forgotPassword);
routes.post('/auth/redefinir-senha', AuthController.resetPassword);


routes.use(AutheticationMiddleware);



routes.get('/livros', LivroControllers.index);
routes.get('/livros/:id', LivroControllers.show);
routes.post('/livros',authorization('administrador'), LivroControllers.create);
routes.put('/livros/:id',authorization('administrador'), LivroControllers.update);
routes.delete('/livros/:id',authorization('administrador'), LivroControllers.delete);




routes.get('/livros/:livro_id/exemplares', ExemplarControllers.index);
routes.post('/livros/:livro_id/exemplares',
    authorization('administrador'),
    ExemplarControllers.create
);
routes.get('/exemplares/:id', ExemplarControllers.show);
routes.put('/exemplares/:id', authorization('administrador'),ExemplarControllers.update);
routes.delete('/exemplares/:id',authorization('administrador'), ExemplarControllers.delete);




routes.get('/usuarios/me', UsuarioController.me);
routes.get('/usuarios', authorization('administrador'), UsuarioController.index);
routes.patch('/usuarios/:id/perfil',
    authorization('administrador'),
    UsuarioController.updatePerfil
);
routes.delete('/usuarios/:id', UsuarioController.delete);



module.exports = routes;