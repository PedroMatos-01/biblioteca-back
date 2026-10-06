const {Router} = require('express')
const routes = new Router();
const UserControler = require('./apps/controllers/LivroControllers');

routes.post('/Livros',UserControler.create);

routes.get('/health',(req,res)=>{
    return res.send({message: 'Connected withew sucesse'})
});


module.exports = routes;