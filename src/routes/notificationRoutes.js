import express from "express";
import {
  getMyNotifications,
  markNotificationRead,
} from "../controllers/notificationController.js";
import { protectUser, protectCompany } from "../middleware/authMiddleware.js";

const router = express.Router();

// Usuario
router.get("/", protectUser, getMyNotifications);
router.patch("/:id/read", protectUser, markNotificationRead);

// Empresa
router.get("/empresa", protectCompany, getMyNotifications);
router.patch("/:id/read-empresa", protectCompany, markNotificationRead);

export default router;
