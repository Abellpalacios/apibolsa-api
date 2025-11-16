import mongoose from "mongoose";

const savedJobSchema = new mongoose.Schema(
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
  },
  { timestamps: true, collection: "empleos_guardados" }
);

savedJobSchema.index({ usuario: 1, empleo: 1 }, { unique: true });

export default mongoose.model("SavedJob", savedJobSchema);
