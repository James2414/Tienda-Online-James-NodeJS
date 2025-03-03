'use strict';
var express = require('express');
var adminController = require('../controllers/AdminController');

var api = express.Router();

// Rutas para los clientes
api.post('/registro_admin', adminController.registro_admin);
api.post('/login_admin', adminController.login_admin);

// Exporta el router directamente
module.exports = api;