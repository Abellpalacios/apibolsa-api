// src/routes/userRoutes.js
import express from "express";
import { updateProfile } from "../controllers/userController.js";
import { protectProfile } from "../middleware/profileAuthMiddleware.js";

const router = express.Router();

// 👇 Aquí solo "/profile". El prefijo /api/user lo pone index.js
router.put("/profile", protectProfile, updateProfile);

// 👈 ESTA línea es la clave para quitar el error de Render
export default router;
