import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// ESTA LÍNEA ES LA CLAVE
// Le dice a tu API: "Busca la clave secreta en la 'caja fuerte' (Environment) de Render"
// NO PONGAS TU CLAVE AQUÍ.
const resend = new Resend(process.env.RESEND_API_KEY);

console.log("✅ Servicio de correo (Resend) inicializado.");

export const sendResetCodeEmail = async (to, code) => {
  try {
    // 'from' debe ser un dominio verificado, pero para probar usa este:
    // ¡CORREGIDO! Ahora usas tu dominio verificado
const fromEmail = "Bolsa de Empleo <noreply@apibolsa.com>";

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to], // Resend espera que esto sea un array
      subject: "Código para restablecer tu contraseña",
      html: `
        <h2>Código de recuperación</h2>
        <p>Tu código para restablecer la contraseña es:</p>
        <h1>${code}</h1>
        <p>Este código expira en 15 minutos.</p>
      `,
    });

    if (error) {
      // Si Resend da un error, lo mostramos en el log de Render
      console.error("❌ Error al enviar correo con Resend:", error);
      throw new Error(error.message);
    }

    console.log("✅ Correo enviado exitosamente:", data);
  } catch (err) {
    console.error("❌ Error en la función sendResetCodeEmail:", err);
    throw err; // Esto le dice a authController que la función falló
  }
};