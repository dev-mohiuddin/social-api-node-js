import { Router } from "express";
import {signUp, signIn, signOut} from '../controller/auth.controller.js';

const router = Router();

router.post("/auth/sign-up", signUp)  // sign up
router.post("/auth/sign-in", signIn )  // sign in
router.post("/auth/forgot-password" ) // forgot password
router.get("/auth/sign-out", signOut)  // sign-out

export default router;