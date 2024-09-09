'use strict';
var fs = require('fs');
var path = require('path');
var Producto = require('../models/producto');
var Inventario = require('../models/inventario');   
const producto = require('../models/producto');



const registro_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            let data = req.body;  // Mueve la declaración de 'data' antes de usarla
            
            var img_path = req.files.portada.path;
            var name = img_path.split('\\');
            var portada_name = name[2];    

            data.slug = data.titulo.toLowerCase().replace(/ /g, '_').replace(/[^\w-]+/g, '');
            data.portada = portada_name;
            let reg = await Producto.create(data);

            let inventario = await Inventario.create({
                admin: req.user.sub,
                cantidad: data. stock,
                proveedor: 'Primer registro',
                producto: reg._id	
            });
           
            res.status(200).send({data: reg,inventario: inventario});

        } else {
            res.status(500).send({ message: 'No access!' });
        }
    } else {
        res.status(500).send({ message: 'No access!' });
    }
}

const listar_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            
            var filtro = req.params['filtro'];
            
            let reg = await Producto.find({ titulo: new RegExp(filtro, 'i') });+
            res.status(200).send({ data: reg });

        } else {
            res.status(500).send({ message: 'No access!' });
        }
    } else {
        res.status(500).send({ message: 'No access!' });
    }
}

const obtener_portada = async function (req, res){
    var img = req.params['img'];

    console.log(img);
    fs.stat('./uploads/productos/'+img, function (err,){
        if(!err) {
            let path_img = ('./uploads/productos/'+img);
            res.status(200).sendFile(path.resolve(path_img));
        }
    });
}

const obtener_producto_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){
            
            var id = req.params['id'];
            
            try {
                var reg = await Producto.findById(id);
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

const actualizar_producto_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            
            let id = req.params['id'];
            let data = req.body;  // Mueve la declaración de 'data' antes de usarla

            if(req.files){         
                var img_path = req.files.portada.path;
                var name = img_path.split('\\');
                var portada_name = name[2];    

              
                let reg = await Producto.findByIdAndUpdate({_id:id},{
                    titulo: data.titulo,
                    stock: data.stock,
                    precio: data.precio,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    contenido: data.contenido,
                    portada: portada_name,
                });

                fs.stat('./uploads/productos/'+reg.portada, function (err,){
                    if(!err){
                        fs.unlink('./uploads/productos/'+reg.portada, (err)=>{
                            if(err) throw err;
                        });               
                    }
                });

                res.status(200).send({data: reg});
                

            }else {
                //NO HAY IMAGEN
                let reg = await Producto.findByIdAndUpdate({_id:id},{
                    titulo: data.titulo,
                    stock: data.stock,
                    precio: data.precio,
                    categoria: data.categoria,
                    descripcion: data.descripcion,
                    contenido: data.contenido,
                });
                res.status(200).send({data: reg});
            }
           
            //

        } else {
            res.status(500).send({ message: 'No access!' });
        }
    } else {
        res.status(500).send({ message: 'No access!' });
    }
}

const eliminar_producto_admin = async function (req, res) {
    if(req.user){
        if(req.user.role == 'admin'){

            var id = req.params['id'];
            
            var reg = await Producto.findByIdAndDelete({_id:id});
            res.status(200).send({data:reg});
           
        }else{
            res.status(500).send({message: 'No ACCESS'});
        }
    }else{
        res.status(500).send({message: 'NO access'});
    }
}

const listar_inventario_producto_admin = async function(req, res) {
    if(req.user){
        if(req.user.role == 'admin'){

            var id = req.params['id'];
            
            var reg = await Inventario.find({producto:id}).populate('admin');
            res.status(200).send({data:reg});
           
        }else{
            res.status(500).send({message: 'No ACCESS'});
        }
    }else{
        res.status(500).send({message: 'NO access'});
    }
}

const eliminar_inventario_producto_admin = async function(req, res){
    if(req.user){
        if(req.user.role == 'admin'){

            var id = req.params['id'];
            //  ELIMINAR INVENTARIO
           let reg = await Inventario.findByIdAndDelete({_id:id});

            //OBTENER EL REGISTRO DE PRODUCTO
            let prod = await Producto.findById({_id:reg.producto});

            //CALCULAR STOCK
            let nuevo_stock = parseInt(prod.stock) - parseInt(reg.cantidad);

            //ACTUALIZAR STOCK EN EL PRODUCTO
            let producto = await Producto.findByIdAndUpdate({_id:reg.producto},{
                stock:nuevo_stock
                });
                
            res.status(200).send({data:producto});

        }else{
            res.status(500).send({message: 'No ACCESS'});
        }
    }else{
        res.status(500).send({message: 'NO access'});
    }
}


const actualizar_producto_variedades_admin = async function(req, res) {
    if (req.user) {
        if (req.user.role == 'admin') {
            
            let id = req.params['id'];
            let data = req.body;  // Mueve la declaración de 'data' antes de usarla

           
            let reg = await Producto.findByIdAndUpdate({_id:id},{
               ttulo_variedad: data.ttulo_variedad,
               variedades: data.variedades
            });
            res.status(200).send({data: reg});


        } else {
            res.status(500).send({ message: 'No access!' });
        }
    } else {
        res.status(500).send({ message: 'No access!' });
    }
}

module.exports = {
    registro_producto_admin,
    listar_producto_admin,
    obtener_portada,
    obtener_producto_admin,
    actualizar_producto_admin,
    eliminar_producto_admin,
    listar_inventario_producto_admin,
    eliminar_inventario_producto_admin,
    actualizar_producto_variedades_admin,
 };

