import User from "../models/User.js";

export const uploadUserCv = async (req, res) => {
  try {
    if (!req.user)
      return res.status(401).json({ message: "No autenticado" });

    if (!req.file)
      return res.status(400).json({ message: "Archivo no recibido" });

    const user = await User.findById(req.user.id);

    user.cvUrl = `/uploads/cv/${req.file.filename}`;
    await user.save();

    return res.json({
      message: "CV subido correctamente",
      cv: user.cvUrl
    });

  } catch (err) {
    res.status(500).json({ message: "Error al subir CV", error: err.message });
  }
};
