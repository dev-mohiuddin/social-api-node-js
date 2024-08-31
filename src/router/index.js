import { Router } from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import healthRoute from './health.route.js';
import userRoute from './user.route.js';
import authRoute from './auth.route.js';
import commentRoute from './comment.route.js';
import postRoute from './post.route.js';
import messageRoute from './message.route.js';

const router = Router();

// public routes must be top in private routes
router.use("/v1", [
    healthRoute,
    authRoute,
])


// private routes must be bottom in public routes
router.use("/v1", authenticateToken, [
    userRoute,
    commentRoute,
    postRoute,
    messageRoute,
])


export default router;