require('dotenv').config();
require('./database/index');
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./apps/middlewares/errorHandler');

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));

app.use(routes);

app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`server is on in port ${PORT}`);
});