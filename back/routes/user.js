const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const userController = require("../controllers/user");

//Configuración de subida
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatars/");
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-" + Date.now() + "-" + file.originalname);
    }
});

const uploads=multer({storage});

router.post("/register", userController.userRegister);
router.post("/login", userController.login);
router.get("/prueba", authMiddleware.auth, userController.prueba);
router.get("/profile/:id", authMiddleware.auth, userController.profile);
router.get("/allUsers/:page?", authMiddleware.auth, userController.allUsers);
router.put("/update", authMiddleware.auth, userController.updateUser);
router.post("/upload", [authMiddleware.auth,uploads.single("file0")], userController.upload);
router.get("/avatar/:file",userController.avatar);
router.get("/counters/:id",authMiddleware.auth,userController.counters);

module.exports = router;