'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'diegoararca'

exports.createToken = function(user) {
    var payload = {
        sub: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        role: user.rol,
        iat: moment().unix(),
        exp: moment().add(60, 'days').unix()
    }
    return jwt.encode(payload, secret);
}