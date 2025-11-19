// src/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    telefono: { type: String, default: "" },

    password: { type: String, required: true, minlength: 6, select: false },

    tipo: {
      type: String,
      enum: ["candidato", "empresa", "admin"],
      default: "candidato",
    },

    // -------------------------
    // CAMPOS NUEVOS DEL PERFIL
    // -------------------------
    title: { type: String, default: null },
    location: { type: String, default: null },
    about: { type: String, default: null },

    // CV — URL del archivo subido
    cvUrl: { type: String, default: null },

    // Reset password
    resetCode: String,
    resetCodeExpires: Date,
  },
  { timestamps: true, collection: "usuarios" }
);

// Hash del password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", userSchema);
