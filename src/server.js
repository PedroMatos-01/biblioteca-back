require('dotenv').config();
require('./database/index');
const express = require ('express');
const routes = require ('./routes');
const cors = require("cors");
const app = express();

app.use(express.json());

app.use(cors({ origin: "http://localhost:5173" }));

app.use(routes);

const PORT = process.env.PORT;

app.listen(PORT,() => {
    console.log('server is on in port 3000');
});