const {Router} = require('express')
const routes = new Router();
const ExemplarControllers = require('./apps/controllers/ExemplarController');
const LivroControllers = require('./apps/controllers/LivroControllers');



routes.get('/health',(req,res)=>{
    return res.send({message: 'Connected withew sucesse'})
});

routes.get('/livros',LivroControllers.index);
routes.get('/livros/:id',LivroControllers.show);
routes.post('/livros',LivroControllers.store);
routes.put('/livros/:id',LivroControllers.update);
routes.delete('/livros/:id',LivroControllers.delete);



routes.get('/livros/:livro_id/exemplares', ExemplarControllers.index);
routes.post('/livros/:livro_id/exemplares', ExemplarControllers.store);
routes.get('/exemplares/:id', ExemplarControllers.show);
routes.put('/exemplares/:id', ExemplarControllers.update);
routes.delete('/exemplares/:id', ExemplarControllers.delete);

module.exports = routes;