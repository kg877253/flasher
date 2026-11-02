import { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name) {
        throw new ApiError(400, "Name of the playlist is required")
    }

    const playlist = await Playlist.create({
        name: name,
        owner: req.user._id,
        description: description,
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

    const playlists = await Playlist.find({ owner: userId })
    if (playlists.length === 0) {
        throw new ApiError(404, "No playlists found for the user")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "User playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params


    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.findById(playlistId).populate("videos").populate("owner", "username email")

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

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in the playlist")
    }

    playlist.videos.push(videoId)
    await playlist.save()

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Video added to playlist successfully"))
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
    if (!name && !description) {
        throw new ApiError(400, "At least one field (name or description) is required to update")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        { name, description },
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