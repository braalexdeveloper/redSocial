const express=require("express");
const app=express();
//config rutas
const userRouter=require("./user");
const followRouter=require("./follow");
const publicationRouter=require("./publication");

app.use('/user',userRouter);
app.use('/follow',followRouter);
app.use('/publication',publicationRouter);

module.exports=app;