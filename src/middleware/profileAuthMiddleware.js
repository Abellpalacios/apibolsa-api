// src/middleware/profileAuthMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import Company from "../models/Company.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "DEV_SECRET_SUPER_LARGO";

export const protectProfile = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No autorizado, falta token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    // ¿es usuario?
    const user = await User.findById(decoded.id);
    if (user) {
      req.user = { id: user._id };
      return next();
    }

    // ¿es empresa?
    const company = await Company.findById(decoded.id);
    if (company) {
      req.company = { id: company._id };
      return next();
    }

    return res.status(401).json({ message: "Token válido pero sin usuario/empresa" });
  } catch (err) {
    console.error("Error en protectProfile:", err);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};
