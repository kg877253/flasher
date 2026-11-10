import { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body


    if (!name?.trim() || !description?.trim()) {
        throw new ApiError(400, "Name and description of the playlist are required")
    }

    const playlist = await Playlist.create({
        name: name.trim(),
        owner: req.user._id,
        description: description.trim(),
        videos: []
    })

    if (!playlist) {
        throw new ApiError(500, "Failed to create playlist")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, playlist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }

    // khaali list error nahi hai, 200 ke saath [] jayega
    const playlists = await Playlist.find({ owner: userId })
        .populate({
            path: "videos",
            match: { isPublished: true },
            select: "thumbnail title duration views"
        })

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "User playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params


    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    // videos me sirf published aaye aur viewedBy (viewers ki IDs) response me na jaye
    const playlist = await Playlist.findById(playlistId)
        .populate({
            path: "videos",
            match: { isPublished: true },
            select: "-viewedBy"
        })
        .populate("owner", "username fullname avatar")

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    const isOwner = playlist.owner.toString() === req.user._id.toString()
    if (!isOwner) {
        throw new ApiError(403, "You are not authorized to add videos to this playlist")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (video.isPublished === false) {
        throw new ApiError(400, "Cannot add unpublished video to playlist")
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in the playlist")
    }

    // $addToSet: push + save ki jagah, ek saath 2 request aaye to bhi duplicate nahi banega
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $addToSet: { videos: videoId } },
        { returnDocument: "after" }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updatedPlaylist, "Video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid playlist ID or video ID")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to remove videos from this playlist")
    }


    if (!playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video does not exist in the playlist")
    }

    playlist.videos.pull(videoId)
    await playlist.save()

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video removed from playlist successfully"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist1 = await Playlist.findById(playlistId)
    if (!playlist1) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist1.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this playlist")
    }

    const playlist = await Playlist.findByIdAndDelete(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    // sirf wahi fields lo jo (trim ke baad) khaali nahi hain
    const updateFields = {}
    if (name?.trim()) updateFields.name = name.trim()
    if (description?.trim()) updateFields.description = description.trim()

    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "At least one field (name or description) is required to update")
    }

    const playlist1 = await Playlist.findById(playlistId)
    if (!playlist1) {
        throw new ApiError(404, "Playlist not found")
    }

    if (playlist1.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this playlist")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $set: updateFields },
        { returnDocument: "after" }
    )

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}