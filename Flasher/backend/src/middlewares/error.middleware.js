import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
    // Multer errors (for example, file too large) are client errors
    const statusCode =
        err.statusCode ||
        (err.code === 11000 || err.name === "MulterError" ? 400 : 500);

    // Log unexpected errors on the server only
    if (statusCode === 500) console.error(err);

    // Do not leak internal error details for unexpected errors
    let message =
        err instanceof ApiError || statusCode < 500 ? err.message : "Internal server error";

    if (err.code === 11000) {
        message = "This like or subscription already exists";
    }

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || [],
    });
};