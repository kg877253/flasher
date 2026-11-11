import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // logged-in user ke channel ki stats: total videos, views, subscribers, likes
    const userId = req.user._id

    // 1. total videos + total views (ek hi aggregate me)
    const videoStats = await Video.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" }, totalVideos: { $sum: 1 } } }
    ])

    // 2. user ki saari video IDs (sirf IDs, poore documents nahi)
    const videoIds = await Video.distinct("_id", { owner: userId })

    // 3. subscribers aur un videos par total likes
    const totalSubscribers = await Subscription.countDocuments({ channel: userId })
    const totalLikes = await Like.countDocuments({ video: { $in: videoIds } })

    // koi video na ho to aggregate [] deta hai, isliye ?. aur || 0
    const stats = {
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalViews: videoStats[0]?.totalViews || 0,
        totalSubscribers,
        totalLikes
    }

    return res
        .status(200)
        .json(new ApiResponse(200, stats, "Channel stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // apne dashboard me published + unpublished dono videos dikhni chahiye
    const userId = req.user._id

    const videos = await Video.find({ owner: userId }).sort({ createdAt: -1 }).select("-viewedBy")

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Channel videos fetched successfully"))
})

export {
    getChannelStats,
    getChannelVideos
}