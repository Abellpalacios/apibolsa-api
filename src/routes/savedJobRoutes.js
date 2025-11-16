import express from "express";
import {
  saveJob,
  removeSavedJob,
  getMySavedJobs,
} from "../controllers/savedJobController.js";
import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protectUser, getMySavedJobs);
router.post("/", protectUser, saveJob);
router.delete("/:jobId", protectUser, removeSavedJob);

export default router;
