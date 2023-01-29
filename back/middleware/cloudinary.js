// Require the Cloudinary library
const cloudinary = require('cloudinary').v2

cloudinary.config({ 
    cloud_name:process.env.CLOUD_NAME, 
    api_key:process.env.API_KEY, 
    api_secret:process.env.API_SECRET,
    secure: true
  });

async function uploadImage(filePath){
    return await cloudinary.uploader.upload(filePath,{
        folder:'replit'
    })
}

async function deleteImage(idImage){
 return await cloudinary.uploader.destroy(idImage)
}


module.exports={uploadImage,deleteImage};

