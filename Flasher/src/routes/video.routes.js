import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

//ALL TESTED AND WORKING
router.get("/", getAllVideos); //T-Done
router.post("/", upload.fields([
    {
        name: "videoFile",
        maxCount: 1,
    },
    {
        name: "thumbnail",
        maxCount: 1,
    },
]), publishAVideo); //T-Done

router.get("/:videoId", getVideoById); //T-Done
router.delete("/:videoId", deleteVideo); //T-Done 
router.patch("/:videoId", upload.single("thumbnail"), updateVideo); //T-Done 

router.patch("/toggle/publish/:videoId", togglePublishStatus); //T-Done

export default router