import fs from "fs";

const collectFiles = (req) => {
    if (req.file) return [req.file];
    if (Array.isArray(req.files)) return req.files;
    if (req.files) return Object.values(req.files).flat();
    return [];
};

export const cleanupTempFiles = (req, res, next) => {
    // response khatam ya connection toota, dono pe chalega
    res.on("close", () => {
        for (const file of collectFiles(req)) {
            fs.unlink(file.path, () => {}); // pehle se delete ho chuki ho toh error ignore
        }
    });
    next();
};