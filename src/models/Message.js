import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    empleo: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    empresa: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    enviadoPor: {
      type: String,
      enum: ["usuario", "empresa"],
      required: true,
    },
    texto: { type: String, required: true },
  },
  { timestamps: true, collection: "mensajes" }
);

export default mongoose.model("Message", messageSchema);
