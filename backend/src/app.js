import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { cleanupTempFiles } from './middlewares/cleanupTemp.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));


app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());
app.use(cleanupTempFiles); // ye middleware sabse pehle aayega, taki temp files cleanup ho jaye


// Routes import
import userRouter from './routes/user.routes.js';
import commentRouter from './routes/comment.routes.js';
import healthcheckRouter from './routes/healthcheck.routes.js';
import videoRouter from './routes/video.routes.js';
import tweetRouter from './routes/tweet.routes.js';
import likeRouter from './routes/like.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import playlistRouter from './routes/playlist.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';


// Routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use('/api/v1/users', userRouter);
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)
//http://localhost:3000/api/v1/users/register ---> is the endpoint for this route


// Unknown API route: JSON 404
app.use("/api", (req, res) => {
    res.status(404).json({ success: false, statusCode: 404, message: "Route not found", errors: [] });
});

// In production the backend also serves the built React app
if (process.env.NODE_ENV === "production") {
    const distPath = path.join(__dirname, "../../frontend/dist");

    app.use(express.static(distPath));

    // Any other GET (for example /users/channel/kartik) gets index.html, React Router takes over
    app.use((req, res, next) => {
        if (req.method !== "GET") return next();
        res.sendFile(path.join(distPath, "index.html"));
    });
}

app.use(errorHandler); // ye middleware sabse last aayega, taki error handle ho jaye

export default app;