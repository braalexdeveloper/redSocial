const User = require("../models/user");
const Follow = require("../models/follow");
const Publication = require("../models/publication");
const bcrypt = require("bcrypt");
const fs = require("fs");


//importar services
const jwt = require("../services/jwt");
const path = require("path");
const followedService = require("../services/followUserIds");

const prueba = (req, res) => {
    res.status(200).json({
        status: "succes",
        message: "esto es la pruebar",
        user: req.user
    })
}

const userRegister = (req, res) => {
    const { name, surname, nick, bio, email, password } = req.body;

    if (!name || !surname || !nick || !email || !password) {
        res.status(200).json({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }


    //control de usuarios duplicados
    User.find({
        $or: [
            { email: email },
            { nick: nick }
        ]
    }).exec(async (error, users) => {
        if (error) return res.status(500).json({ status: "error", message: "Error al consultar datos" });
        if (users && users.length >= 1) {
            return res.status(200).json({ status: "success", message: "El usuario ya existe!!" });
        }

        //cifrar la contraseña
        let pwd = await bcrypt.hash(password, 10);
        let passwordCifrada = pwd;
        //crear un objeto usuario
        let user_to_save = new User({ name, surname, nick, bio, email, password: passwordCifrada });

        //Guardar usuario en la bbdd

        user_to_save.save((error, userStored) => {
            if (error || !userStored) return res.status(500).send({ status: "error", message: "Error al guardar usuario" });

            return res.status(200).json({
                status: "success",
                message: "Usuario registrado correctamente",
                user: userStored
            });

        });

    });
}

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(200).json({ status: "error", message: "Faltan datos por enviar" });
    //Buscar si existe en la bd
    User.findOne({ email })./*select({ password: 0 }).*/exec((error, user) => {
        if (error || !user) return res.status(404).json({ status: "error", message: "No se encontro al usuario" });
        //comprobar si la contraseña existe
        let pwd = bcrypt.compareSync(password, user.password);

        if (!pwd) return res.status(400).json({ status: "error", message: "No se ha identificado correctamente" });

        //crear token
        const token = jwt.createToken(user);

        //devolver datos del usuario
        return res.status(200).json({
            status: "success",
            message: "Te has identificado correctamente",
            user: {
                id: user._id,
                name: user.name,
                nick: user.nick
            },
            token
        });
    })

}

const profile = (req, res) => {
    const { id } = req.params;

    User.findById(id).select({ password: 0, role: 0 }).exec(async (error, userProfile) => {
        if (error || !userProfile) return res.status(404).send({
            status: "error",
            message: "El usuario no existe o hay un error"
        });

        //Info de seguimiento
        const followInfo = await followedService.followThisUser(req.user.id, id);

        return res.status(200).json({
            status: "success",
            user: userProfile,
            following: followInfo.following,
            followed: followInfo.follower
        });

    });

}

const allUsers = (req, res) => {
    //Controlar en que página estamos
    let page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
   // page = parseInt(page);

    //Consulta con mongoose pagination
    let itemsPerPage = 2;
    User.paginate({}, { limit: itemsPerPage, page, select: "-password -role -__v -email" }, async (err, result) => {
        if (err) return res.status(404).send({
            status: "error",
            message: "No hay usuarios disponibles",
            err
        });


        //Decolver el resultado(posteriormente info de follow)
        let followUserIds = await followedService.followUserIds(req.user.id);

        return res.status(200).send({
            status:"success",
            result,
            user_following: followUserIds.following,
            user_follow_me: followUserIds.followers
        })

    })

}

const updateUser = (req, res) => {

    //Recoger los datos del usuario
    let userIdentity = req.user;
    let userToUpdate = req.body;

    //Elimina campos sobrantes
    delete userToUpdate.iat;
    delete userToUpdate.exp;
    delete userToUpdate.role;
    delete userToUpdate.image;


    //control de usuarios duplicados
    User.find({
        $or: [
            { email: userToUpdate.email },
            { nick: userToUpdate.nick }
        ]
    }).exec(async (error, users) => {
        if (error) return res.status(500).json({ status: "error", message: "Error al consultar datos" });
        let userIsset = false;
        users.forEach(user => {
            if (user.id !== userIdentity.id) {
                userIsset = true;
            }
        })

        if (userIsset) {
            return res.status(200).json({ status: "success", message: "El usuario ya existe!!" });
        }

        //cifrar la contraseña
        if (userToUpdate.password) {
            let pwd = await bcrypt.hash(userToUpdate.password, 10);
            userToUpdate.password = pwd;
        }else{
            delete userToUpdate.password;
        }
        //Buscar y actualizar
        try {
            let userUpdate = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });
            if (!userUpdate) return res.status(400).json({ status: "error", message: "Error al actualizar datos" });

            return res.status(200).json({
                status: "success",
                message: "Se ha modificado correctamente",
                userUpdate
            });
        } catch (error) {
            return res.status(500).json({
                status: "error",
                message: "Error al actualizar"
            });
        }


    });

}

const upload = (req, res) => {
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

    //Si es correcto , guarda la imagen en la bbdd
    User.findOneAndUpdate({ _id: req.user.id }, { image: req.file.filename }, { new: true }, (error, userUpdate) => {

        if (error || !userUpdate) {
            return res.status(400).send({
                status: "error",
                message: "Error en la subida del avatar"
            });
        }


        res.status(200).json({
            status: "success",
            user: userUpdate,
            file: req.file
        });
    });


}


const avatar = (req, res) => {
    //Sacar el parametro de la url
    const file = req.params.file;

    //Montar el path de la imagen
    const filePath = "./uploads/avatars/" + file;

    //Comprobar que existe
    fs.stat(filePath, (error, exists) => {
        if (!exists) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen"
            })
        }

        //Devolver un file
        return res.sendFile(path.resolve(filePath));

    })

}

const counters = async (req, res) => {
    let userId = req.user.id;
    if (req.params.id) {
        userId = req.params.id;
    }

    try {
        const following = await Follow.count({ "user": userId });
        const followed = await Follow.count({ "followed": userId });
        const publications = await Publication.count({ "user": userId });
        res.status(200).json({
            status: "success",
            userId,
            following,
            followed,
            publications
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Error en los contadores",
            error
        });
    }

}

module.exports = {
    userRegister,
    login,
    prueba,
    profile,
    allUsers,
    updateUser,
    upload,
    avatar,
    counters
}
