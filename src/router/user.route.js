import { Router } from "express";
import {
    getUserbyId,
    userUpdateById,
    unFollowUser,
    followUser,
} from "../controller/user.controller.js";

const router = Router();

router.get("/users")  // get all users
router.get("/user/:id", getUserbyId)  // get user by id
router.put("/user/:id", userUpdateById)  // update user by id
router.put("/user/follow/:id", followUser)  // follow user by id
router.put("/user/unfollow/:id", unFollowUser)  // unfollow user by id
router.put("/user/change-password/:id")  // change password by id
router.delete("/user/:id")  // delete user by id

export default router;