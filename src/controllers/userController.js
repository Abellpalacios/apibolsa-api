// src/controllers/userController.js
import User from "../models/User.js";
import Company from "../models/Company.js";

/**
 * PUT /api/user/profile
 * Actualiza el perfil de usuario o empresa autenticada.
 * Body esperado desde Android:
 * { id, name?, title?, location?, email, phone?, about?, userType? }
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, title, location, phone, about } = req.body;

    // === USUARIO NORMAL ===
    if (req.user) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      if (name !== undefined) user.name = name;
      if (title !== undefined) user.title = title;           // añade estos campos al schema si no existen
      if (location !== undefined) user.location = location;
      if (phone !== undefined) user.telefono = phone;        // o user.phone
      if (about !== undefined) user.about = about;

      const saved = await user.save();

      return res.json({
        id: saved._id,
        name: saved.name,
        title: saved.title || null,
        location: saved.location || null,
        email: saved.email,
        phone: saved.telefono || null,
        about: saved.about || null,
        userType: saved.tipo || "candidato",
      });
    }

    // === EMPRESA ===
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
        title: saved.sector || null,
        location: saved.direccion || null,
        email: saved.email,
        phone: saved.telefono || null,
        about: saved.descripcion || null,
        userType: "empresa",
      });
    }

    return res.status(401).json({ message: "No autenticado" });
  } catch (err) {
    console.error("Error en updateProfile:", err);
    return res.status(500).json({
      message: "Error al actualizar perfil",
      error: err.message,
    });
  }
};
