
export default (err, req, statusCode) => {

    const errorObj = {
        success: false,
        statusCode: statusCode || 500,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl,
        },
        message: err instanceof Error ? err?.message || 'Internal Server Error' : "Something went wrong",
        data: null,
        trace: err instanceof Error ? {error: err?.message, stack: err?.stack} : null
    }

    if (process.env.ENV === 'production') {
        delete errorObj.request.ip
        delete errorObj.trace
    }

    return errorObj
}