import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();
router.get("/user/:userId", getUserPlaylists); // Public: playlists of a channel

router.use(verifyJWT);

router.post("/", createPlaylist) //T-Done

router.get("/user/:userId", getUserPlaylists); //T-Done
router.get("/:playlistId", getPlaylistById) //T-Done

router.patch("/add/:videoId/:playlistId", addVideoToPlaylist);//T-Done
router.patch("/remove/:videoId/:playlistId", removeVideoFromPlaylist);//T-Done
router.patch("/:playlistId", updatePlaylist)//T-Done

router.delete("/:playlistId", deletePlaylist) //T-Done

export default router
