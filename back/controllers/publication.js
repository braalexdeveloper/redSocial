const Publication = require("../models/publication");
const fs = require("fs");
const path = require("path");
const {uploadImage,deleteImage}=require("../middleware/cloudinary");

//servicio
const followUsersIds=require("../services/followUserIds");

const save = (req, res) => {
    //Recoger datos del body
    const body = req.body;
    //Sino me llega dar respuesta negativa
    if (!body.text) return res.status(400).send({ status: "error", message: "Debes enviar el texto de la publicacion" });

    //Crear y rellenar el modelo
    let newPublication = new Publication(body);
    newPublication.user = req.user.id;
    //Guardar
    newPublication.save((error, publicationStored) => {
        if (error || !publicationStored) return res.status(400).send({ status: "error", message: "No se guardo la publicacion" });

        return res.status(200).json({
            status: "success",
            message: "Publicación Guardad Correctamente!!",
            publicationStored
        })

    });
}

const detail = (req, res) => {
    const idPublication = req.params.id;

    Publication.findById(idPublication, (error, publicationStored) => {
        if (error || !publicationStored) return res.status(404).send({ status: "error", message: "No existe la publicación" });

        return res.status(200).json({
            status: "success",
            message: "Mostrar Publicación",
            publication: publicationStored
        })
    })
}

const remove = (req, res) => {


    Publication.findOneAndDelete({ "user": req.user.id, "_id": req.params.id },async(error,result) => {
        if (error) return res.status(404).send({ status: "error", message: "No se pudo borrar la publicación" });
        
        if(result.id_file){
           await deleteImage(result.id_file);
        }
        

        return res.status(200).json({
            status: "success",
            message: "Publicación Eliminada!!",
            publication: req.params.id,
            result
        });
    });
}

const userAllPublications = (req, res) => {

    const userId = req.params.id;

    //Controlar la página
    let page = 1;
    if (req.params.page) page = req.params.page;

    //Publications per page
    const publicationPerPage = 3;

    Publication.paginate({ "user": userId }, { page, limit: publicationPerPage, populate: [{ path: "user", select: "-password -__v -role -email" }], sort: "-created_at" },
        (error, publications) => {

            if (error || !publications || publications.docs.length <= 0) return res.status(404).send({ status: "error", message: "No hay publications para mostrar" });

            return res.status(200).json({
                status: "success",
                message: "Publicaciones del perfil del usuario!!",
                page: publications.page,
                pages: publications.pages,
                total: publications.total,
                user: req.user,
                publications: publications.docs
            });
        })


}

const upload =async (req, res) => {
    let publicationId = req.params.id;
    //Recopger el fuichero de imagen y comprobar que existe
    if (!req.file) {
        return res.status(404).send({
            status: "error",
            message: "Petición no incluye la imagen"
        });
    }

    //Conseguir el nombre del archivo
    let image = req.file.originalname;

    //Sacara la extensión del archivo
    let splitImage = image.split('\.');
    const ext = splitImage[1];

    //Comprobar extensión
    if (ext !== "png" && ext !== "jpg" && ext !== "jpeg" && ext !== "gif") {
        //Borrar archivo subido
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);

        //Devolver respuesta negatva
        return res.status(400).send({
            status: "error",
            message: "Extensión del fichero invalido"
        });
    }

    const imgcloud=await uploadImage(req.file.path);
    //Si es correcto , guarda la imagen en la bbdd
    Publication.findOneAndUpdate({ "user": req.user.id, "_id": publicationId }, { file: imgcloud.secure_url,id_file:imgcloud.public_id}, { new: true }, (error, publicationUpdate) => {

        if (error || !publicationUpdate) {
            return res.status(400).send({
                status: "error",
                message: "Error en la subida del avatar"
            });
        }

        fs.unlinkSync(req.file.path);

        res.status(200).json({
            status: "success",
            publicationUpdate,
            file: req.file
        });
    });


}

const media = (req, res) => {
    //Sacar el parametro de la url
    const file = req.params.file;

    //Montar el path de la imagen
    const filePath = "./uploads/publications/" + file;

    //Comprobar que existe
    fs.stat(filePath, (error, exists) => {
        if (!exists) {
            return res.status(404).send({
                status: "error",
                message: "No existe la publicación"
            })
        }

        //Devolver un file
        return res.sendFile(path.resolve(filePath));

    })

}

const feed=async(req,res)=>{
  //Sacar la página actual
  let page=1
  if(req.params.page) page=req.params.page;

  //Establecer nuemero de elementos por página
  const itemsPerPage=2;

  
  try {
    //Sacar un array de identificadores de usuarios que yo sigo como usuario logueado
    const myFollows=await followUsersIds.followUserIds(req.user.id);

    //Find a publicaiones in , ordenar,popular y paginar
    Publication.paginate({user:myFollows.following},{
        limit:itemsPerPage,
        page,
        populate:[{path:"user",select:"-password -role -__v -email"}],
        sort:"-created_at"
    },(error,publicationStored)=>{
        return res.status(200).send({
            status:"success",
            message:"Feed Publications",
            following:myFollows,
            user:req.user,
            page:publicationStored.page,
            pages:publicationStored.pages,
            total:publicationStored.total,
            publications:publicationStored.docs
        });
    })
   
    

    
  } catch (error) {
    return res.status(500).send({
        status:"error",
        message:"Error al obtener usuarios que sigues",
     });
  }
  
}

module.exports = {
    save,
    detail,
    remove,
    userAllPublications,
    upload,
    media,
    feed
}