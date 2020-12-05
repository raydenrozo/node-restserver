const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');

app.get('/imagen/:type/:img', verificaTokenImg, (req, res) => {

    let type = req.params.type;
    let img = req.params.img;

    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${img}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/images/no-image.jpg');
        res.sendFile(noImagePath);
    }


});

module.exports = app;