

export default (req, res, statusCode, data, resMessage) => {
    
    const response = {
        success: true,
        statusCode: statusCode || 200,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl,
        },
        message: resMessage || 'Success',
        data: data,
    }
    
    if (process.env.ENV === 'production') {
        delete response.request.ip
    }

    res.status(statusCode).json(response)
}