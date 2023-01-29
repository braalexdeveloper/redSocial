const mongoose=require("mongoose");

const connection=async()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1/mi_redsocial");
        console.log("Conectado correctamente!!");
        //   mongodb://mongo:JFmnLfkeKNq5kF724Hp7@containers-us-west-146.railway.app:6495  mongodb+srv://brayan:mGUKZcm0Th5aghVZ@cluster0.8njcr.mongodb.net/?retryWrites=true&w=majority
    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
}
//mGUKZcm0Th5aghVZ
module.exports=connection;