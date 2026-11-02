import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    const stats = await Video.aggregate([
        { $match: { owner: mongoose.Types.ObjectId(userId) } },
        { $group: { _id: null, totalViews: { $sum: "$views" }, totalVideos: { $sum: 1 } } }
    ])

    const subscribers = await Subscription.countDocuments({ channel: userId })
    const likes = await Like.countDocuments({ video: { $in: (await Video.find({ owner: userId })).map(v => v._id) } })

    return res.status(200).json(new ApiResponse(200, { stats, subscribers, likes }, "Channel stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const { userId } = req.params

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    const videos = await Video.find({ owner: userId })

    if (!videos) {
        throw new ApiError(404, "No videos found for this channel")
    }

    if (videos.length === 0) {
        return res.status(200).json(new ApiResponse(200, [], "No videos found for this channel"))
    }

    if(userId.toString() !== req.user._id.toString()) {
        // If the user is not the owner of the channel, filter out unpublished videos
        const publicVideos = videos.filter(video => video.isPublished)
        return res.status(200).json(new ApiResponse(200, publicVideos, "Channel videos fetched successfully"))
    }

    return res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }