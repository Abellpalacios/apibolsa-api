// src/config/env.js
import dotenv from "dotenv";

const result = dotenv.config();

if (result.error) {
  console.error("❌ Error cargando archivo .env:", result.error);
} else {
  console.log("✅ Variables de entorno cargadas");
}
