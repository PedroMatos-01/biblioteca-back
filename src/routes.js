const { Router } = require('express');
const routes = new Router();

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


routes.use(AutheticationMiddleware);

routes.get('/livros', LivroControllers.index);
routes.get('/livros/:id', LivroControllers.show);
routes.post('/livros', LivroControllers.create);
routes.put('/livros/:id', LivroControllers.update);
routes.delete('/livros/:id', LivroControllers.delete);

routes.get('/livros/:livro_id/exemplares', ExemplarControllers.index);
routes.post('/livros/:livro_id/exemplares', ExemplarControllers.create);
routes.get('/exemplares/:id', ExemplarControllers.show);
routes.put('/exemplares/:id', ExemplarControllers.update);
routes.delete('/exemplares/:id', ExemplarControllers.delete);

module.exports = routes;