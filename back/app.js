var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var port = process.env.PORT || 4201
var cors = require('cors');


var cliente_route = require('./routes/cliente');
var admin_route = require('./routes/admin');
var producto_route = require('./routes/producto');
var config_route = require('./routes/config');

// Inicializa nuestro express
var app = express();

// Conexión a la base de datos
async function connectDB() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/tienda', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conectado a la base de datos');

        // Inicia el servidor después de una conexión exitosa
        app.listen(port, function() {
            console.log('Servidor corriendo en http://localhost:' + port);
        });

    } catch (err) {
        console.log('Error al conectar a la base de datos:', err);
    }
}

connectDB();

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();

});
// cuandos se envia una data de fron a el back hay que parsear la data
//
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50mb',extended: true}));


app.use('/api', cliente_route);
app.use('/api', admin_route);
app.use('/api', producto_route);
app.use('/api', config_route);

module.exports = app;
