//Importar modulos
const jwt=require("jwt-simple");
const moment=require("moment");

//Importar clave secreta
const libjwt=require("../services/jwt");
const secret=libjwt.secret;

//Función de autenticación
exports.auth=(req,res,next)=>{
if(!req.headers.authorization){
 return res.status(403).send({
    status:"Error",
    message:"La petición no tiene  la cabecera de autenticación"
 });
}

//limpiar token
let token=req.headers.authorization.replace(/['"]+/g,'');

//Decodificar token

try {

    let payload=jwt.decode(token,secret);

    //Comprobar expiracion del token
    if(payload.exp<=moment().unix()){
        return res.status(401).send({
            status:"Error",
            message:"Token expirado"
         });
       
    }

    //Agregar datos de usuario a request
req.user=payload;
    
} catch (error) {
    return res.status(404).send({
        status:"Error",
        message:"Token invalido",
        error
     });
}



//Pasar a ejecución de acción
next();

}