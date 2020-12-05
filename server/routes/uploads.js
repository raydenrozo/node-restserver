const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto =  require('../models/producto');
const fs = require('fs');
const path = require('path');
// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function(req, res) {

    let type = req.params.type;
    let id = req.params.id;
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let file = req.files.archivo;

    //Extensiones permitidas
    let extensionsArray = ['png', 'jpg', 'gif','jpeg'];
    let nameSplit = file.name.split('.');
    let extension = nameSplit[1];
    
    if (extensionsArray.indexOf(extension) < 0) {
        return res.status(400)
        .json({
                ok: false,
                err: {
                    message: `La extension ${extension} del archivo es invalida. Extensiones validas son: ${extensionsArray.join(', ')}`,
                    ext: extension
                }
            });
    }
    if (!req.files || !file) {
        return res.status(400)
        .json({
                ok: false,
                err: {
                    message: 'Ningun archivo ha sido cargado.'
                }
            });
    }

    let typeArray = ['productos', 'usuarios'];
    if (typeArray.indexOf(type) < 0) {
        return res.status(400)
        .json({
                ok: false,
                err: {
                    message: `El tipo ${type} no es permitido. Tipo valids son: ${typeArray.join(', ')}`,
                    type
                }
            });
    }

    // Cambiar nombre del archivo
    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`;
    // Use the mv() method to place the file somewhere on your server
    file.mv(`uploads/${type}/${fileName}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (type === 'usuarios') {
            imageUsers(id, res, fileName);
        } else {
            imageProducts(id, res, fileName);
        }
    });

});

const imageUsers = (id, res, fileName) => {

    Usuario.findById(id, {disponible: true}, (err, usuarioDB) => {
        if (err) {
            deleteIfExistImag(fileName, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            deleteIfExistImag(fileName, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        deleteIfExistImag(usuarioDB.img, 'usuarios');

        usuarioDB.img = fileName;
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                message: 'Usuario guardado con exito!',
                user: usuarioGuardado
            });
        });
    });
};
const imageProducts = (id, res, fileName) => {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            deleteIfExistImag(fileName, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            deleteIfExistImag(fileName, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        deleteIfExistImag(productoDB.img, 'productos');

        productoDB.img = fileName;
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                message: 'Producto guardado con exito!',
                product: productoGuardado
            });
        });
    });
};

const deleteIfExistImag = (nameImg, type) => {
    let pathImg = path.resolve(__dirname, `../../uploads/${type}/${nameImg}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}
module.exports = app;