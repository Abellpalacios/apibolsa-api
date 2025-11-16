import express from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protectUser, protectCompany } from "../middleware/authMiddleware.js";

const router = express.Router();

// Usuario
router.post("/", protectUser, applyToJob);
router.get("/mine", protectUser, getMyApplications);

// Empresa
router.get("/job/:jobId", protectCompany, getApplicationsForJob);
router.patch("/:id/status", protectCompany, updateApplicationStatus);

export default router;
