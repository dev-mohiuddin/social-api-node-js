import { Router } from "express";
import {
    createMessage,
    getMessagesByConversationId,
} from "../controller/messages.controller.js";

const router = Router();

router.post("/messages/:conversationId", createMessage)  // create a new message
router.get("/messages/:conversationId", getMessagesByConversationId) // get messages by conversation id




export default router;