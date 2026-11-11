import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        // unique naam, taaki do users ek saath "video.mp4" upload karein to clash na ho
        cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + "-" + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.fieldname === "videoFile" && file.mimetype.startsWith("video/")) {
        return cb(null, true)
    }

    if (
        ["avatar", "coverImage", "thumbnail"].includes(file.fieldname) &&
        file.mimetype.startsWith("image/")
    ) {
        return cb(null, true)
    }

    cb(new ApiError(400, `${file.fieldname} must be a valid image or video file`))
}

export const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter,
})