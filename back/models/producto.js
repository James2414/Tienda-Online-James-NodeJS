'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductoSchema = Schema({
    titulo: {type: String, required: true},
    descripcion: {type: String, required: true},
    precio: {type: Number, required: true},
    stock: {type: Number, required: true},
    nventas: {type: Number, default: 0, required: true},
    npuntos: {type: Number, default: 0, required: true},
    categoria: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, required: true},
    estado: {type: String, default: 'Edicion', required: true},
    slug: {type: String, required: true},
    portada: {type: String, required: true},
    titulo_variedad: {type: String, required: false},
    galeria: [{type: Object, required: false}],
    contenido: {type: String, required: true},
    variedades: [{type: Object, required: false}],
});

module.exports = mongoose.model('productos', ProductoSchema);