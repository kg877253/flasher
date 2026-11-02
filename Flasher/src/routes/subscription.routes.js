import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.post("/c/:channelId", toggleSubscription); //T-Done
router.get("/u/:subscriberId", getSubscribedChannels); //T-Done

router.route("/c/:channelId").get(getUserChannelSubscribers); //T-Done

export default router