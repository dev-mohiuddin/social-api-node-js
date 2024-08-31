
export default (req, res, statusCode, resMessage) => {
    
    const response = {
        success: false,
        statusCode: statusCode || 400,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl,
        },
        message: resMessage || "An unexpected error occurred.",
        data: null,
    }
    
    if (process.env.ENV === 'production') {
        delete response.request.ip
    }

    res.status(statusCode).json(response)
}