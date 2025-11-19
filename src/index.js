// src/index.js
import "./config/env.js";
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
import userRoutes from "./routes/userRoutes.js";   // 👈 NUEVO

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: false,
  })
);

// DB
connectDB();

app.get("/", (req, res) => {
  res.send("API Bolsa de Empleo funcionando ✅");
});

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/user", userRoutes);   // 👈 AQUÍ SE MONTA /api/user/profile

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
  console.log("🌍 Entorno:", process.env.NODE_ENV || "desarrollo");
});
