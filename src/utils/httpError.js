import errorObject from "./errorObject.js";

export default (next, err, req, statusCode) => {
    const errorObj = errorObject(err, req, statusCode);
    return next(errorObj);
}