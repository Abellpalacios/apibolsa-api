// src/utils/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// (opcional) comprobar en consola que se conecta
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Error con el transporte de correo:", error);
  } else {
    console.log("✅ Servidor de correo listo para enviar");
  }
});

export const sendResetCodeEmail = async (to, code) => {
  const mailOptions = {
    from: `"Bolsa de Empleo" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Código para restablecer tu contraseña",
    html: `
      <h2>Código de recuperación</h2>
      <p>Tu código para restablecer la contraseña es:</p>
      <h1>${code}</h1>
      <p>Este código expira en 15 minutos.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
