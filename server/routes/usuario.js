const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();

const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

  app.get('/usuario', verificaToken ,(req, res) => {

        let desde = req.query.desde || 0;
        desde = Number(desde);
        let limite = req.query.limite || 5;
        limite = Number(limite);

        Usuario.find({estado: true}, 'nombre apellido email img role estado google')
                .skip(desde)
                .limit(limite)
                .exec( (err, usuarios) => {

                    if ( err ) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    Usuario.countDocuments({ estado: true}, (err, conteo) => {

                        res.json({
                            ok: true,
                            cuantos: conteo,
                            usuarios
                        });

                    });
                });

  });
  app.post('/usuario', [verificaToken, verificaAdminRol], (req, res) => {
      let body = req.body;
    
      let usuario = new Usuario({
          nombre: body.nombre,
          apellido: body.apellido,
          email: body.email,
          password: bcrypt.hashSync(body.password,10),
          role: body.role
      });

      usuario.save((err, usuarioDB) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            // usuarioDB.password = null;
            res.json({
                ok: true,
                usuario: usuarioDB
            })

      });
  });
  app.put('/usuario/:id', [verificaToken, verificaAdminRol], (req, res) => {
      
    let id = req.params.id;
    let body = _.pick(req.body , ['nombre','apellido','email','img','role','estado']);


    Usuario.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

  });

  app.delete('/usuario/:id', [verificaToken, verificaAdminRol], (req, res) => {

    let id = req.params.id;
    let CambiarEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, CambiarEstado, {new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });

  });

  module.exports = app;