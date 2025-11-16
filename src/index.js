// src/index.js
import "./config/env.js";          // 🔹 Carga las variables de entorno (.env)
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import savedJobRoutes from "./routes/savedJobRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// CORS: por ahora abierto; luego puedes limitar a tu dominio/aplicación
app.use(
  cors({
    origin: "*",          // o ["https://apibolsa.com", "http://10.0.2.2:5000"]
    credentials: false,   // pon true si usas cookies entre frontend/back
  })
);

// ✅ Conexión a la BD
connectDB();

// ✅ Ruta de prueba
app.get("/", (req, res) => {
  res.send("API Bolsa de Empleo funcionando ✅");
});

// ✅ Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Arrancar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
  console.log("🌍 Entorno:", process.env.NODE_ENV || "desarrollo");
});
