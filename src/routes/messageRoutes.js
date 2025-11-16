import express from "express";
import {
  sendMessage,
  getConversation,
} from "../controllers/messageController.js";

const router = express.Router();

// Puedes protegerlas luego con auth si quieres
router.post("/", sendMessage);
router.get("/", getConversation);

export default router;
