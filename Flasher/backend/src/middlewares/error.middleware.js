import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
    // Multer errors (for example, file too large) are client errors
    const statusCode = err.statusCode || (err.name === "MulterError" ? 400 : 500);

    // Log unexpected errors on the server only
    if (statusCode === 500) console.error(err);

    // Do not leak internal error details for unexpected errors
    const message =
        err instanceof ApiError || statusCode < 500 ? err.message : "Internal server error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.errors || [],
    });
};