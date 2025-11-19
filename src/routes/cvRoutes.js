import express from "express";
import { protectProfile } from "../middleware/profileAuthMiddleware.js";
import { uploadCV, saveCV } from "../controllers/cvController.js";

const router = express.Router();

router.post("/upload-cv", protectProfile, uploadCV, saveCV);

export default router;
