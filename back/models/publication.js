const { Schema,model }=require("mongoose");
const mongoosePaginate=require("mongoose-paginate");

const PublicationSchema=Schema({
    user:{
        type:Schema.ObjectId,
        ref:"User"
    },
    text:{
        type:String,
        required:true
    },
    file:String,
    id_file:String,
    created_at:{
        type:Date,
        default:Date.now
    }
});
PublicationSchema.plugin(mongoosePaginate);
module.exports=model("Publication",PublicationSchema,"publications");