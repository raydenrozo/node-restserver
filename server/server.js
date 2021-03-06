require('./config/config')
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

//console.log(path.resolve(__dirname, '../public'));

// Configuracion global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.urlDB, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true
        }, (err) => {
            if (err) {
                throw err;

            }
            console.log('Base de Datos online');

        }
);

app.listen(process.env.PORT, () => {
    console.log('listening port', process.env.PORT); 
});