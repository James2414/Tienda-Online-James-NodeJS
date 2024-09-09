
var Config = require('../models/config');
var fs = require('fs');
var path = require('path');

const obtener_config_admin = async function(req, res){

    if(req.user){
        if(req.user.role == 'admin'){
            
            let reg = await Config.findById({_id: "66cc981c30d993ee17e06be8"})
            res.status(200).send({data:reg})

        }else{
            res.status(500).send({message: 'No ACCESS'});
        }
    }else{
        res.status(500).send({message: 'NO access'});
    }

}

const actualiza_config_admin = async function(req, res){
    if(req.user){
        if(req.user.role == 'admin'){
            
            var data = req.body;
           
            if(req.files){    
                console.log('si hay imagen')     
                var img_path = req.files.logo.path;
                var name = img_path.split('\\');
                var logo_name = name[2];  

                let reg = await Config.findByIdAndUpdate("66cc981c30d993ee17e06be8",{
                    titulo: data.titulo,
                    serie: data.serie,
                    logo: logo_name,
                    correlativo: data.correlativo,
                    categorias: JSON.parse(data.categorias)
                     });

                     fs.stat('./uploads/configuraciones/'+reg.logo, function (err,){
                        if(!err){
                            fs.unlink('./uploads/configuraciones/'+reg.logo, (err)=>{
                                if(err) throw err;
                            });               
                        }
                    })
                    
                res.status(200).send({data:reg});
            }else {
                console.log('no hay imagen')
                let reg = await Config.findByIdAndUpdate("066cc981c30d993ee17e06be8",{
                    titulo: data.titulo,
                    serie: data.serie,
                    correlativo: data.correlativo,
                    categorias: data.categorias
                     });
                    res.status(200).send({data:reg});
               }
            
           
          
        }else{
            res.status(500).send({message: 'No ACCESS'});
        }
    }else{
        res.status(500).send({message: 'NO access'});
    }
}


const obtener_logo = async function (req, res){
    var img = req.params['img'];

    console.log(img);
    fs.stat('./uploads/configuraciones/' + img, function (err,){
        if (!err) {
            let path_img = './uploads/configuraciones/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        } else {
            // Aquí deberías manejar el caso en el que la imagen no exista
            // Por ejemplo, podrías enviar una imagen por defecto o un mensaje de error
            res.status(404).send({message: 'Imagen no encontrada'});
        }
    });
}


const obtener_config_publico = async function(req, res){
    let reg = await Config.findById("66cc981c30d993ee17e06be8")
    res.status(200).send({data:reg})
}

module.exports = {
    actualiza_config_admin,
    obtener_config_admin,
    obtener_config_publico,
    obtener_logo,
    obtener_config_publico
}