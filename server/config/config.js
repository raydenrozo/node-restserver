// ================================
//  Puerto
// ================================

process.env.PORT = process.env.PORT || 3000;


// ================================
//  Entorno
// ================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ================================
//  Vencimiento Token
// ================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '48h';

// ================================
//  SEED de autenticacion
// ================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ================================
//  Base de Datos
// ================================

let urlDB;

if ( process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

// ================================
//  Google Client ID
// ================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '850220032267-03a8v20b1ta86dv3o8r3m661hu2boi5s.apps.googleusercontent.com';