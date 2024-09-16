import { Router } from "express";
import { uploadProfileAndCover } from "../middleware/multer.js";
import {
    getUserbyId,
    unFollowUser,
    followUser,
    getAllUsers,
    suggestedFollowersToAdd,
    getFollowingUsers,
    profileUpdate
} from "../controller/user.controller.js";

const router = Router();

router.get("/users", getAllUsers)  // get all users
router.get("/users/suggested", suggestedFollowersToAdd)  // get suggested followers to follow 
router.get("/user/following", getFollowingUsers)  // get following users
router.get("/user/:id", getUserbyId)  // get user by id
router.put("/user",uploadProfileAndCover, profileUpdate)  // update user
router.put("/user/follow/:id", followUser)  // follow user by id
router.put("/user/unfollow/:id", unFollowUser)  // unfollow user by id
router.put("/user/change-password/:id")  // change password by id
router.delete("/user/:id")  // delete user by id

export default router;