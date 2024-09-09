'use strict';

var jwt = require('jwt-simple'); // Asegúrate de importar jwt
var moment = require('moment');
var secret = 'diegoararca';

exports.auth = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).send({ message: 'No token provided' });
    }

    let token = req.headers.authorization.replace(/['"]+/g, '');
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length); // Eliminar el prefijo 'Bearer '
    }

    console.log('Token recibido:', token);

    try {
        var payload = jwt.decode(token, secret);
        console.log('Payload:', payload);
        if (payload.exp <= moment().unix()) {
            return res.status(403).send({ message: 'Token expired' });
        }
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        return res.status(403).send({ message: 'Invalid token' });
    }

    req.user = payload;
    next();
};
