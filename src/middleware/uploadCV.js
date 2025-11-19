import multer from "multer";
import path from "path";

// Guardar en carpeta /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `CV_${Date.now()}${ext}`);
  }
});

// Permitir solo PDFs
function fileFilter(req, file, cb) {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Solo se permiten archivos PDF"));
}

const upload = multer({ storage, fileFilter });

export default upload;
