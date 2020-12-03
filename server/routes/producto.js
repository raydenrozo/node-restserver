const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const app = express();

const Producto = require('../models/producto');

// ==================================
// Mostrar todas las los productos
// ==================================
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    
    Producto.find({disponible: true})
    .skip(desde)
    .limit(limite)
    .sort('nombre')
    .populate('Usuario','nombre email')
    .populate('Categoria', 'descripcion')
    .exec((err, productos) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productos
        });
    });

});

// ==================================
// Mostrar productos por ID
// ==================================
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
    .populate('usuario', 'nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id del producto no existe'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

// ==================================
// Mostrar productos por termino
// ==================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({nombre: regex})
            .populate('categoria', 'nombre')
            .exec((err, productos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                res.json({
                    ok: true,
                    productos
                })
            })

});
// ==================================
// Crear nuevo Producto
// ==================================
app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;
    let producto = new Producto({
        nombre:         body.nombre,
        precioUni:      body.precioUni,
        descripcion:    body.descripcion,
        disponible:     body.disponible,
        categoria:      body.categoria,
        usuario:        req.usuario._id
    });

    producto.save( (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })

    });
});

// ==================================
// Actualizar nuevo Producto
// ==================================
app.put('/producto/:id', verificaToken, (req, res) => {
      
    let id = req.params.id;
    let body = req.body;


    Producto.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

    // otro camino

    // Producto.findById( id, body, {new: true, runValidators: true}, (err, productoDB) => {

    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!productoDB) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Producto no encontrado'
    //             }
    //         });
    //     }

    //     productoDB.nombre = body.nombre;
    //     productoDB.descripcion = body.descripcion;
    //     productoDB.categoria = body.categoria;
    //     productoDB.precioUni = body.precioUni;
    //     productoDB.disponible = body.disponible;

    //     productoDB.save((err, productoGuardaddo) => {
    //         if (err) {
    //             return res.status(500).json({
    //                 ok: false,
    //                 err
    //             });
    //         }

    //         res.json({
    //             ok: true,
    //             producto: productoGuardaddo
    //         });
    //     });
    // });

  });

// ==================================
// Eliminar nuevo Producto
// ==================================
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let CambiarEstado = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, CambiarEstado, {new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            producto: `EL producto ${productoBorrado.nombre} ha sido borrado`
        });
    });

  });

module.exports = app;