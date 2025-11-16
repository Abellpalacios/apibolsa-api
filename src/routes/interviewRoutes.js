import express from "express";
import {
  scheduleInterview,
  getCompanyInterviews,
  getUserInterviews,
} from "../controllers/interviewController.js";
import { protectCompany, protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Empresa
router.post("/", protectCompany, scheduleInterview);
router.get("/empresa", protectCompany, getCompanyInterviews);

// Usuario
router.get("/usuario", protectUser, getUserInterviews);

export default router;
