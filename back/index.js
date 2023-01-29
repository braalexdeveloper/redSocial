//importar dependecias
const connection=require("./database/connection");
const express=require("express");
const bodyParser = require('body-parser');
const cors=require("cors");
require('dotenv').config();
//conexion a bd
connection();

//crear servidor
const app=express();
const puerto=process.env.PORT || 3900;

//configurar cors
app.use(cors());

//convertir los datos del body a objetos js
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//config rutas
/*const userRouter=require("./routes/user");
const followRouter=require("./routes/follow");
const publicationRouter=require("./routes/publication");*/

const rutass=require("./routes/index");

/*app.use('/api/user',userRouter);
app.use('/api/follow',followRouter);
app.use('/api/publication',publicationRouter);*/

app.use('/api/',rutass);

//levantar servidor
app.listen(puerto,()=>{
    console.log("Servidor corriendo en puerto ",puerto);
})
