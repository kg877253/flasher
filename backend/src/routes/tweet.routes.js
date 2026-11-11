import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import { verifyJWT, optionalAuth } from "../middlewares/auth.middleware.js"


const router = Router();

// Public: anyone can read a channel's tweets. optionalAuth only adds isLiked for logged-in users.
router.get("/user/:userId", optionalAuth, getUserTweets);

// Everything below needs login
router.use(verifyJWT);

router.post("/", createTweet); //T-Done

router.patch("/:tweetId", updateTweet); //T-Done

router.delete("/:tweetId", deleteTweet); //T-Done

export default router