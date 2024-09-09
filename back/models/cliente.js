'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClienteSchema = Schema({
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pais: { type: String, required: false },
    dni: { type: String, required: false },
    genero: { type: String, required:false},
    telefono: { type: String, required: false },
    perfil: { type: String, default: 'perfil.png', required: false},
    f_nacimiento: { type: String, required: false},
    createAt: {type:Date, default: Date.now, required: true},
});

module.exports = mongoose.model('cliente', ClienteSchema);