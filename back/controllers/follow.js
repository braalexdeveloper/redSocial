const Follow = require("../models/follow");
const User = require("../models/user");


//Importar servicios
const followService=require("../services/followUserIds");


//Guardar follow

const save = (req, res) => {
    const { followed } = req.body;

    //Sacar el id del usuario identificado
    const identity = req.user;

    //Crear objeto con modelo follow
    let userToFollow = new Follow({
        user: identity.id,
        followed
    });

    //Guardar objeto en la bbdd
    userToFollow.save((error, followStored) => {
        if (error || !followStored) {
            return res.status(500).json({
                status: "error",
                message: "No se ha podido seguir al usuario"
            });
        }

        return res.status(200).json({
            status: "success",
            identity: req.user,
            follow: followStored
        });
    });

}

//Acción para borrar un follow(Dejar de seguir)
const unFollow = (req, res) => {

    //Id del usario
    const idUser = req.user.id;
    //Id del followed
    const idFollowed = req.params.id;

    //Find de las coincidencias y hacer remove

    Follow.find({
        "user": idUser,
        "followed": idFollowed
    }).remove((error, followDelete) => {

        if (error || !followDelete) {
            return res.status(500).send({
                status: "error",
                message: "No has dejado de seguir a nadie"
            })
        }

        return res.status(200).json({
            status: "success",
            message: "Follow eliminado correctamente",
            identity: req.user,
            followDelete
        });
    });


}

const following = (req, res) => {

    //Sacar el id del usuario identificado
    let idUser = req.user.id;

    //Comprobar si me llega el id por parametro en la url
    if (req.params.id) idUser = req.params.id;

    //Comprobar si me llega la página, si no la p+agina 1 por defecto
    let page = 1;

    if (req.params.page) page = req.params.page;

    //Usuarios por página que quiero mostrar
    const itemsPerPage = 2;

    //Find a follow , popular datos de los usuarios y páginar con mogoose paginate
    // .populate("user followed","-password -role -__v")
    Follow.paginate({ user: idUser },
        {
            limit: itemsPerPage,
            page,
            populate: [
                { path: "user", select: "-password -role -__v -email" }, { path: "followed", select: "-password -role -__v -email" }
            ]
        },
        async(error, follows) => {

let followUserIds=await followService.followUserIds(req.user.id);

            return res.status(200).json({
                status: "success",
                message: "Listado de usuarios que estoy siguiendo",
                follows:follows.docs,
                total:follows.total,
                page:follows.page,
                pages:follows.pages,
                user_following:followUserIds.following,
                user_follow_me:followUserIds.followers

            });
        })
}

const followers = (req, res) => {
    //Sacar el id del usuario identificado
    let idUser = req.user.id;

    //Comprobar si me llega el id por parametro en la url
    if (req.params.id) idUser = req.params.id;

    //Comprobar si me llega la página, si no la p+agina 1 por defecto
    let page = 1;

    if (req.params.page) page = req.params.page;

    //Usuarios por página que quiero mostrar
    const itemsPerPage = 2;

    //Find a follow , popular datos de los usuarios y páginar con mogoose paginate
    // .populate("user followed","-password -role -__v")
    Follow.paginate({ followed: idUser },
        {
            limit: itemsPerPage,
            page,
            populate: [
                { path: "user", select: "-password -role -__v -email" }
            ]
        },
        async(error, follows) => {

let followUserIds=await followService.followUserIds(req.user.id);

            return res.status(200).json({
                status: "success",
                message: "Listado de usuarios que me siguen",
                follows:follows.docs,
                total:follows.total,
                page:follows.page,
                pages:follows.pages,
                user_following:followUserIds.following,
                user_follow_me:followUserIds.followers

            });
        })
}



module.exports = {
    save,
    unFollow,
    followers,
    following
}