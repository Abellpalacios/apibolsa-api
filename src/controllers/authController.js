// src/controllers/authController.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import Company from "../models/Company.js";
import { sendResetCodeEmail } from "../utils/emailService.js";

// Cargar variables de entorno
dotenv.config();

// Usamos una constante para el secreto del JWT
const JWT_SECRET = process.env.JWT_SECRET || "DEV_SECRET_SUPER_LARGO";

const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

// -------- REGISTRO USUARIO ----------
export const registerUser = async (req, res) => {
  try {
    const { name, email, telefono, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email ya registrado" });
    }

    const user = await User.create({ name, email, telefono, password });
    const token = createToken(user._id);

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        tipo: user.tipo,
      },
    });
  } catch (err) {
    console.error("Error en registerUser:", err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "El email ya está registrado", error: err.message });
    }
    return res.status(500).json({
      message: "Error en el registro de usuario",
      error: err.message,
    });
  }
};

// -------- REGISTRO EMPRESA ----------
export const registerCompany = async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      sector,
      tamano,
      telefono,
      direccion,
      sitioWeb,
      descripcion,
    } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const exists = await Company.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email ya registrado" });
    }

    const company = await Company.create({
      nombre,
      email,
      password,
      sector,
      tamano,
      telefono,
      direccion,
      sitioWeb,
      descripcion,
    });

    const token = createToken(company._id);

    return res.status(201).json({
      token,
      company: {
        id: company._id,
        nombre: company.nombre,
        email: company.email,
      },
    });
  } catch (err) {
    console.error("Error en registerCompany:", err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "El email ya está registrado", error: err.message });
    }
    return res.status(500).json({
      message: "Error en el registro de empresa",
      error: err.message,
    });
  }
};

// -------- LOGIN USUARIO ----------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = createToken(user._id);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        tipo: user.tipo,
      },
    });
  } catch (err) {
    console.error("Error en loginUser:", err);
    return res.status(500).json({
      message: "Error en el login de usuario",
      error: err.message,
    });
  }
};

// -------- LOGIN EMPRESA ----------
export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email }).select("+password");
    if (!company) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const match = await company.comparePassword(password);
    if (!match) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    const token = createToken(company._id);

    return res.json({
      token,
      company: {
        id: company._id,
        nombre: company.nombre,
        email: company.email,
      },
    });
  } catch (err) {
    console.error("Error en loginCompany:", err);
    return res.status(500).json({
      message: "Error en el login de empresa",
      error: err.message,
    });
  }
};

// -------- PERFIL RÁPIDO ----------
export const getMeUser = (req, res) => {
  return res.json(req.user);
};

export const getMeCompany = (req, res) => {
  return res.json(req.company);
};

// -------- OLVIDÉ CONTRASEÑA ----------
export const requestPasswordReset = async (req, res) => {
  try {
    const { email, tipo } = req.body; // "usuario" o "empresa"
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    if (tipo === "empresa") {
      const company = await Company.findOne({ email });
      if (!company) {
        return res.status(404).json({ message: "Empresa no encontrada" });
      }

      company.resetCode = code;
      company.resetCodeExpires = expires;
      await company.save();

      await sendResetCodeEmail(email, code);
    } else {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      user.resetCode = code;
      user.resetCodeExpires = expires;
      await user.save();

      await sendResetCodeEmail(email, code);
    }

    return res.json({ message: "Código enviado al correo" });
  } catch (err) {
    console.error("Error en requestPasswordReset:", err);
    return res.status(500).json({
      message: "Error al solicitar código",
      error: err.message,
    });
  }
};

// -------- RESTABLECER CONTRASEÑA ----------
export const resetPassword = async (req, res) => {
  try {
    const { email, tipo, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const now = new Date();

    if (tipo === "empresa") {
      const company = await Company.findOne({ email }).select("+password");
      if (!company) {
        return res.status(404).json({ message: "Empresa no encontrada" });
      }

      if (company.resetCode !== code || company.resetCodeExpires < now) {
        return res.status(400).json({ message: "Código inválido o expirado" });
      }

      company.password = await bcrypt.hash(newPassword, 10);
      company.resetCode = undefined;
      company.resetCodeExpires = undefined;
      await company.save();
    } else {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (user.resetCode !== code || user.resetCodeExpires < now) {
        return res.status(400).json({ message: "Código inválido o expirado" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.resetCode = undefined;
      user.resetCodeExpires = undefined;
      await user.save();
    }

    return res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("Error en resetPassword:", err);
    return res.status(500).json({
      message: "Error al restablecer contraseña",
      error: err.message,
    });
  }
};
