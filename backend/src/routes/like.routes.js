import { Router } from 'express';
import {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
} from "../controllers/like.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.post("/toggle/v/:videoId", toggleVideoLike); //T-Done
router.post("/toggle/c/:commentId", toggleCommentLike); //T-Done
router.post("/toggle/t/:tweetId", toggleTweetLike); //T-Done

router.get("/videos", getLikedVideos); //T-Done

export default router