import express from "express";
import {
  registerUser,
  registerCompany,
  loginUser,
  loginCompany,
  getMeUser,
  getMeCompany,
  requestPasswordReset,
  resetPassword,
} from "../controllers/authController.js";
import { protectUser, protectCompany } from "../middleware/authMiddleware.js";

const router = express.Router();

// Usuario
router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.get("/me-user", protectUser, getMeUser);

// Empresa
router.post("/register-company", registerCompany);
router.post("/login-company", loginCompany);
router.get("/me-company", protectCompany, getMeCompany);

// Recuperar contraseña
router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);

export default router;
