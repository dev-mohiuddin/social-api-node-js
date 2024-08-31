import { Router } from "express";
import { upload } from "../middleware/multer.js";
import {
    createPost,
    getPosts,
    getFollowingPosts,
    getPostsByUserId,
    updatePost,
    likePost,
    unlikePost,
} from "../controller/post.controller.js";

const router = Router();

router.get("/posts", getPosts)  // get all posts
router.get("/posts/following", getFollowingPosts)  // get all posts of following users
router.post("/post", upload.single("image"), createPost)  // create a post
router.get("/posts/user/:id", getPostsByUserId)  // get post by user id
router.put("/post/:id", updatePost)  // update post by id
router.put("/post/like/:id", likePost)  // like a post by id
router.put("/post/unlike/:id", unlikePost)  // unlike a post by id
router.get("/post/save/:id")  // save a post by id
router.delete("/post/:id")  // delete post by id


export default router;