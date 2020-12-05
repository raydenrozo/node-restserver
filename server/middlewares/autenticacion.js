const jwt = require('jsonwebtoken');
// ================================
//  Verifica Token
// ===============================

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

// ================================
//  Verifica Usuario Rol
// ===============================

let verificaAdminRol = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Usuario sin permisos. No es administrador'
            }
        });
    } else {
        next();
    }

};

// ================================
//  Verifica Token imagen
// ===============================

let verificaTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });

};

module.exports = {
    verificaToken,
    verificaAdminRol,
    verificaTokenImg
}