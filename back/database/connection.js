const mongoose=require("mongoose");

const connection=async()=>{
    try {
        await mongoose.connect("mongodb://mongo:JFmnLfkeKNq5kF724Hp7@containers-us-west-146.railway.app:6495");
        console.log("Conectado correctamente!!");
        //mongodb://127.0.0.1/mi_redsocial   mongodb://mongo:JFmnLfkeKNq5kF724Hp7@containers-us-west-146.railway.app:6495
    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
}

module.exports=connection;