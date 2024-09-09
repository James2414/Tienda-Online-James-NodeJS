var Cliente = require('../models/cliente')
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt')


const registro_cliente = async function(req, res){
    var data = req.body
    var clientes_arr = [];

   
    clientes_arr = await Cliente.find({email:data.email});
    if(clientes_arr.length === 0){

        if(data.password){
            bcrypt.hash(data.password, null, null, async function (err, hash){
                if(hash){
                    data.password = hash;
                    var reg = await Cliente.create(data);
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({message: 'error server', data:undefined});
                }
            });
        }else{
            res.status(200).send({message: 'no hay contraseña', data:undefined});
        }
    }else{
        res.status(200).send({message: 'email ya registrado en la data base', data:undefined});
    }
}

const login_cliente = async function(req, res){
    var data = req.body;
    var cliente_arr = [];

    cliente_arr = await Cliente.find({email:data.email});

    if(cliente_arr.length === 0){
        res.status(200).send({message: 'no se encontro correp', data:undefined});
    }else{

        let user = cliente_arr[0]

        bcrypt.compare(data.password, user.password, async function(err, check){
            if(check){
                res.status(200).send({
                    data:user, 
                    token: jwt.createToken(user) //crear token con el id del usuario

                });
            }else{
                res.status(200).send({message: 'contraseña no coincide', data: undefined});
            }
        });
    }
}

//Funcion

const listar_clientes_filtro_admin = async function(req, res){

    console.log(req.user);
    if(req.user){
        if(req.user.role == 'admin'){
            let tipo = req.params['tipo'];
            let filtro = req.params['filtro'];
        
            console.log(tipo);
        
            if(tipo == null || tipo == 'null'){
                let reg = await Cliente.find();
                res.status(200).send({data:reg});
            }else {
                if(tipo == 'apellidos'){
                    let reg = await Cliente.find({apellidos: new RegExp(filtro, 'i')});
                    res.status(200).send({data:reg});
                }else if(tipo == 'correo') {
                    let reg = await Cliente.find({email: new RegExp(filtro, 'i')});
                    res.status(200).send({data:reg});
                }
            }
        }else{
            res.status(500).send({message: 'no tienes ACCESS, No eres admin', data: undefined});

        }
    }else {
        res.status(500).send({message: 'NO access', data: undefined});

    }
 
}

//registro cliente admin funcion

const registro_cliente_admin = async function(req, res){
    if(req.user){
        if(req.user.role == 'admin'){
            var data = req.body;

            bcrypt.hash('123', null, null, async function(err, hash){
                if(hash){
                    data.password = hash;
                    let reg = await Cliente.create(data);
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({message: 'hubo un error server', data:undefined});
                }
            });
        } else {
            res.status(500).send({message: 'no tienes ACCESS, No eres admin', data: undefined});
        }
    } else {
        res.status(500).send({message: 'NO access', data: undefined});
    }
}

const obtener_cliente_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){
            
            var id = req.params['id'];
            
            try {
                var reg = await Cliente.findById(id);
                res.status(200).send({data: reg});
            } catch (error) {
                res.status(200).send({data:undefined});
            }

        }else{
            res.status(500).send({message: 'No ACCESS'});
        }
    }else{
        res.status(500).send({message: 'NO access'});
    }
}

const actualizar_cliente_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){
            
            var id = req.params['id'];
            var data = req.body;

            var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres: data.nombres,
                apellidos: data.apellidos,
                email: data.email,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                genero: data.genero,
                dni: data.dni,
            });
            
            res.status(200).send({data:reg});
           
        }else{
            res.status(500).send({message: 'No ACCESS'});
        }
    }else{
        res.status(500).send({message: 'NO access'});
    }
}

const eliminar_cliente_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){

            var id = req.params['id'];
            
            var reg = await Cliente.findByIdAndDelete({_id:id});
            
            res.status(200).send({data:reg});
           
        }else{
            res.status(500).send({message: 'No ACCESS'});
        }
    }else{
        res.status(500).send({message: 'NO access'});
    }
}

const obtener_cliente_guest = async function(req, res){
    if(req.user){
        var id = req.params['id'];

        try {
            var reg = await Cliente.findById(id)
            res.status(200).send({data: reg});
        }catch(error){
            res.status(200).send({data: undefined});

        }
    }else{
        res.status(500).send({message: 'NO access'});
    }
}

const actualizar_perfil_cliente_guest = async function(req, res){
    if(req.user){
        var id = req.params['id'];
        var data = req.body;

        console.log(data.password);

        if(data.password){
            console.log('Con contraseña');
            bcrypt.hash(data.password, null, null, async function(err, hash){
                if(err){
                    return res.status(500).send({message: 'Error al encriptar la contraseña'});
                }

                let reg = await Cliente.findByIdAndUpdate( id, {
                    nombres: data.nombres,
                    apellidos: data.apellidos,
                    telefono: data.telefono,
                    f_nacimiento: data.f_nacimiento,
                    genero: data.genero,
                    dni: data.dni,
                    pais: data.pais,
                    password: hash,  // Aquí ya usamos la contraseña encriptada
                }, { new: true });  // Agrega la opción `{ new: true }` para obtener el documento actualizado

                return res.status(200).send({data: reg});  // Enviamos la respuesta después de que se haya completado el hash
            });
        } else {
            console.log('Sin contraseña');
            let reg = await Cliente.findByIdAndUpdate(id, {
                nombres: data.nombres,
                apellidos: data.apellidos,
                telefono: data.telefono,
                f_nacimiento: data.f_nacimiento,
                genero: data.genero,
                dni: data.dni,
                pais: data.email,
            }, { new: true });  // Usamos `{ new: true }` para devolver el documento actualizado

            return res.status(200).send({data: reg});
        }

    } else {
        return res.status(500).send({message: 'NO access'});
    }
};



module.exports = {
    registro_cliente,
    login_cliente,
    listar_clientes_filtro_admin,
    registro_cliente_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin,
    obtener_cliente_guest,
    actualizar_perfil_cliente_guest,
 
}