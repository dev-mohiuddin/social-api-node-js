import httpError from '../utils/httpError.js';
import userError from '../utils/userError.js';
import {verifyToken} from '../service/utils/jwt.js'
import { User } from '../model/user.model.js';
import { isValidMongoId } from '../service/utils/helper.js';

export const authenticateToken = async(req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) return userError(req, res, 401, 'Unauthorized user');
        
        const verified = verifyToken(token);
        if(!verified) return userError(req, res, 401, 'Unauthorized user');

        const userId = verified.id;
        if(!isValidMongoId(userId)) return userError(req, res, 401, 'Unauthorized user');
    
        const user = await User.findById(userId);
        if(!user) return userError(req, res, 401, 'Unauthorized user');
    
        req.user = user;
        next();

    } catch (error) {
        httpError(next, error, req, 500);
    }
}