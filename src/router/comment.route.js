import { Router } from "express";
import {
    getCommentsByPostId,
    createComment,
} from "../controller/commnet.controller.js";


const router = Router();

router.get("/comments/:id", getCommentsByPostId)  // get comments by post id
router.post("/comment/:id", createComment)  // create a comment by post id
router.get("/comment/:id")  // get comment by id
router.put("/comment/:id")  // update comment by id
router.delete("/comment/:id")  // delete comment by id

export default router;