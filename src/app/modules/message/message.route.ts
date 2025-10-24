import { Router } from "express";
import { messageController } from "./message.controller";

const router = Router();

// Send a message (requires email in body)
router.post("/send", messageController.sendMessage);

// Get messages for a group (with pagination)
router.get("/:groupId", messageController.getMessagesByGroup);

// Delete a message with user email in URL params
router.delete("/:messageId/:userEmail", messageController.deleteMessage);

export const messageRoutes = router;
