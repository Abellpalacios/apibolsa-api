// src/controllers/userController.js
import User from "../models/User.js";
import Company from "../models/Company.js";

export const updateProfile = async (req, res) => {
  try {
    // 👇 Evita que truene si req.body es undefined
    const body = req.body || {};
    const { name, title, location, phone, about } = body;

    // si no hay ningún dato, respondemos 400 y listo
    if (!name && !title && !location && !phone && !about) {
      return res.status(400).json({ message: "No se enviaron datos para actualizar" });
    }

    // ... resto del código que ya teníamos (buscar user/company, asignar campos, guardar, etc.)
  } catch (err) {
    console.error("Error en updateProfile:", err);
    return res.status(500).json({
      message: "Error al actualizar perfil",
      error: err.message,
    });
  }
};
