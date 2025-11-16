import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    empleo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    empresa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    estado: {
      type: String,
      enum: [
        "enviada",
        "en_revision",
        "entrevista_programada",
        "preseleccionado",
        "rechazada",
        "oferta",
      ],
      default: "enviada",
    },
    notaEmpresa: String,
    notaUsuario: String,
    entrevista: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
    },
  },
  { timestamps: true, collection: "aplicaciones" }
);

export default mongoose.model("Application", applicationSchema);
