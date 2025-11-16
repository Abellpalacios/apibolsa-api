import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import Company from "../models/Company.js";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "DEV_SECRET_SUPER_LARGO";

export const protectUser = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No autorizado (usuario)" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error en protectUser:", err);
    res.status(401).json({ message: "Token inválido (usuario)" });
  }
};

export const protectCompany = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No autorizado (empresa)" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const company = await Company.findById(decoded.id);
    if (!company) {
      return res.status(401).json({ message: "Empresa no encontrada" });
    }

    req.company = company;
    next();
  } catch (err) {
    console.error("Error en protectCompany:", err);
    res.status(401).json({ message: "Token inválido (empresa)" });
  }
};
