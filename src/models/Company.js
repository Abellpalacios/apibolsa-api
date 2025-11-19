// src/models/Company.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const companySchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true, minlength: 6, select: false },

    sector: { type: String, default: null },
    tamano: { type: String, default: null },
    telefono: { type: String, default: null },
    direccion: { type: String, default: null },
    sitioWeb: { type: String, default: null },
    descripcion: { type: String, default: null },

    resetCode: String,
    resetCodeExpires: Date,
  },
  { timestamps: true, collection: "empresas" }
);

companySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

companySchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("Company", companySchema);
