// src/controllers/userController.js
import User from "../models/User.js";
import Company from "../models/Company.js";

export const updateProfile = async (req, res) => {
  try {
    const body = req.body || {};
    const { name, title, location, phone, about } = body;

    if (
      name === undefined &&
      title === undefined &&
      location === undefined &&
      phone === undefined &&
      about === undefined
    ) {
      return res.status(400).json({ message: "No se enviaron datos para actualizar" });
    }

    // ========================
    // CANDIDATO
    // ========================
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      if (name !== undefined) user.name = name;
      if (title !== undefined) user.title = title;
      if (location !== undefined) user.location = location;
      if (phone !== undefined) user.telefono = phone;
      if (about !== undefined) user.about = about;

      const saved = await user.save();

      return res.json({
        id: saved._id,
        name: saved.name,
        title: saved.title,
        location: saved.location,
        email: saved.email,
        phone: saved.telefono,
        about: saved.about,
        cvUrl: saved.cvUrl,
        userType: "candidato",
      });
    }

    // ========================
    // EMPRESA
    // ========================
    if (req.company) {
      const company = await Company.findById(req.company.id);
      if (!company) return res.status(404).json({ message: "Empresa no encontrada" });

      if (name !== undefined) company.nombre = name;
      if (title !== undefined) company.sector = title;
      if (location !== undefined) company.direccion = location;
      if (phone !== undefined) company.telefono = phone;
      if (about !== undefined) company.descripcion = about;

      const saved = await company.save();

      return res.json({
        id: saved._id,
        name: saved.nombre,
        title: saved.sector,
        location: saved.direccion,
        email: saved.email,
        phone: saved.telefono,
        about: saved.descripcion,
        userType: "empresa",
      });
    }

    return res.status(401).json({ message: "No autenticado" });
  } catch (err) {
    console.error("Error en updateProfile:", err);
    return res.status(500).json({ message: "Error al actualizar perfil", error: err.message });
  }
};
