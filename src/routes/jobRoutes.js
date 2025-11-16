import express from "express";
import {
  createJob,
  getJobs,
  getJobById,
  getCompanyJobs,
  updateJob,
  changeJobStatus,
} from "../controllers/jobController.js";
import { protectCompany } from "../middleware/authMiddleware.js";

const router = express.Router();

// Orden importante: rutas fijas antes que "/:id"
router.get("/", getJobs);
router.get("/company/mine", protectCompany, getCompanyJobs);
router.get("/:id", getJobById);

router.post("/", protectCompany, createJob);
router.put("/:id", protectCompany, updateJob);
router.patch("/:id/status", protectCompany, changeJobStatus);

export default router;
