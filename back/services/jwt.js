const jwt=require("jwt-simple");
const moment=require("moment");

//calve secreta
const secret="CLAVE_SECRETA_del_ProYECto_red_social744";

//crear funcion para generar tokens
createToken=(user)=>{
const payload={
    id:user._id,
    name:user.name,
    surname:user.surname,
    nick:user.nick,
    bio:user.bio,
    email:user.email,
    role:user.role,
    image:user.image,
    iat:moment().unix(),
    exp:moment().add(30,"days").unix()
};
//devolver token codificado
return jwt.encode(payload,secret);

}

module.exports={secret,createToken}