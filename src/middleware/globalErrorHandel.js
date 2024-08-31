import httpError from "../utils/httpError.js";


export const globarError = (err, req, res, next) => {
    res.status(err.statusCode || 500).json(err);
}

export const notFound = (req, res, next) => {
    try {
        throw new Error(`Not Found - ${req.originalUrl}`);
    } catch (err) {
        httpError(next, err, req, 404);
    }
}