import multer from "multer";
import User from "../models/User.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cv/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const uploadCV = multer({ storage }).single("cv");

export const saveCV = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "No autenticado" });

    if (!req.file)
      return res.status(400).json({ message: "No se recibió archivo" });

    const user = await User.findById(req.user.id);
    user.cvUrl = `/uploads/cv/${req.file.filename}`;
    await user.save();

    return res.json({
      message: "CV subido correctamente",
      cvUrl: user.cvUrl,
    });
  } catch (err) {
    return res.status(500).json({ message: "Error al subir CV", error: err.message });
  }
};
