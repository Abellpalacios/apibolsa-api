import express from "express";
import { uploadCv } from "../config/multerCv.js";
import { uploadUserCv } from "../controllers/cvController.js";
import { protectProfile } from "../middleware/profileAuthMiddleware.js";

const router = express.Router();

router.post(
  "/upload-cv",
  protectProfile,
  uploadCv.single("cv"),
  uploadUserCv
);

export default router;
