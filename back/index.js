//importar dependecias
const connection=require("./database/connection");
const express=require("express");
const cors=require("cors");

//conexion a bd
connection();

//crear servidor
const app=express();
const puerto=3900;

//configurar cors
app.use(cors());

//convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//config rutas
const userRouter=require("./routes/user");
const followRouter=require("./routes/follow");
const publicationRouter=require("./routes/publication");

app.use('/api/user',userRouter);
app.use('/api/follow',followRouter);
app.use('/api/publication',publicationRouter);

//levantar servidor
app.listen(puerto,()=>{
    console.log("Servidor corriendo en puerto ",puerto);
})
