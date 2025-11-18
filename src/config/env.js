// src/config/env.js
import dotenv from "dotenv";

// Solo cargar .env cuando NO estás en producción
if (process.env.NODE_ENV !== "production") {
  const result = dotenv.config();

  if (result.error) {
    console.warn("⚠️ No se pudo cargar .env local (probablemente no existe).");
  } else {
    console.log("✅ Variables de entorno cargadas desde .env");
  }
} else {
  console.log("ℹ️ NODE_ENV=production: usando variables de entorno del servidor (Render)");
}
