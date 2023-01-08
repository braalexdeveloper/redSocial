const express=require("express");
const router=express.Router();

const authMiddleware=require("../middleware/auth");
const followController=require("../controllers/follow");

router.post("/save",authMiddleware.auth,followController.save);
router.delete("/unfollow/:id",authMiddleware.auth,followController.unFollow);
router.get("/following/:id?/:page?",authMiddleware.auth,followController.following);
router.get("/followers/:id?/:page?",authMiddleware.auth,followController.followers);

module.exports=router;