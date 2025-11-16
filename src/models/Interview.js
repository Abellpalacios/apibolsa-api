import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    empleo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    empresa: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    fechaHora: { type: Date, required: true },
    modo: String,
    enlace: String,
    estado: {
      type: String,
      enum: ["programada", "confirmada", "cancelada"],
      default: "programada",
    },
    notas: String,
  },
  { timestamps: true, collection: "entrevistas" }
);

export default mongoose.model("Interview", interviewSchema);
