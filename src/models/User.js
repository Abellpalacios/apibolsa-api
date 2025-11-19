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

    telefono: String,

    password: { type: String, required: true, minlength: 6, select: false },

    tipo: {
      type: String,
      enum: ["candidato", "empresa", "admin"],
      default: "candidato",
    },

    // --- CAMPOS PARA RESET PASSWORD ---
    resetCode: String,
    resetCodeExpires: Date,

    // --- NUEVO: RUTA DEL CV ---
    cvUrl: { type: String, default: null },

    // --- CAMPOS OPCIONALES (perfil) ---
    title: { type: String, default: null },
    location: { type: String, default: null },
    about: { type: String, default: null }
  },
  { timestamps: true, collection: "usuarios" }
);

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
