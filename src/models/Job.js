import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    titulo: { type: String, required: true, trim: true },
    departamento: String,
    tipoContrato: String,
    modalidad: String,
    ubicacion: String,
    salarioMin: Number,
    salarioMax: Number,
    descripcion: { type: String, required: true },
    requisitos: String,
    etiquetas: [String],
    estado: {
      type: String,
      enum: ["activo", "pausado", "cerrado"],
      default: "activo",
    },
    vistas: { type: Number, default: 0 },
    candidatosCount: { type: Number, default: 0 },
    expiraEn: Date,
  },
  { timestamps: true, collection: "empleos" }
);

export default mongoose.model("Job", jobSchema);
