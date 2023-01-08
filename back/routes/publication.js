const express=require("express");
const router=express.Router();
const multer = require("multer");
const authMiddleware=require("../middleware/auth");
const publicationController=require("../controllers/publication");

//Configuración de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/publications/");
    },
    filename: (req, file, cb) => {
        cb(null, "pub-" + Date.now() + "-" + file.originalname);
    }
});

const uploads=multer({storage});

router.post("/save",authMiddleware.auth,publicationController.save);
router.get("/detail/:id",authMiddleware.auth,publicationController.detail);
router.delete("/remove/:id",authMiddleware.auth,publicationController.remove);
router.get("/user/:id/:page?",authMiddleware.auth,publicationController.userAllPublications);
router.post("/upload/:id",[authMiddleware.auth,uploads.single("file0")],publicationController.upload);
router.get("/media/:file",publicationController.media);
router.get("/feed/:page?",authMiddleware.auth,publicationController.feed);

module.exports=router;