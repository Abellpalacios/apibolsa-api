import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    empresa: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    tipo: {
      type: String,
      enum: [
        "preseleccionado",
        "entrevista_confirmada",
        "nuevo_empleo_match",
        "nueva_aplicacion",
      ],
      required: true,
    },
    titulo: String,
    mensaje: { type: String, required: true },
    leida: { type: Boolean, default: false },
    meta: {},
  },
  { timestamps: true, collection: "notificaciones" }
);

export default mongoose.model("Notification", notificationSchema);
