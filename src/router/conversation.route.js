import { Router } from "express";
import {
    createConversation,
    allUserConversations,
    getAllConversations
} from "../controller/conversation.controller.js";

const router = Router();

router.post("/conversations", createConversation)  // create a new conversation
router.get("/conversations",getAllConversations)  // get all conversations 
router.get("/conversations/user",allUserConversations)  // get user all conversations

export default router;