const nodemailer = require('nodemailer');

// Función para obtener transporter (SMTP falso para desarrollo)
const createTransporter = () => {
  // Para desarrollo: usar Ethereal (cuenta de prueba gratuita)
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'aron.kozey@ethereal.email', // Cambia esto por tu cuenta de Ethereal
      pass: 'wU8XzBsEfrUjp6pdGH', // Cambia esto por tu contraseña de Ethereal
    },
  });
};

// Plantilla de correo para recuperación de contraseña
const generateResetEmailTemplate = (resetUrl) => {
  return `
    <h2>Recuperación de Contraseña</h2>
    <p>Hola,</p>
    <p>Recibimos una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el siguiente enlace:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 10px 0;">
      Restablecer Contraseña
    </a>
    <p>Este enlace expirará en 1 hora.</p>
    <p>Si no solicitaste este cambio, ignora este correo.</p>
    <br/>
    <p>Saludos,<br/>Equipo Plant Disease Detector</p>
  `;
};

module.exports = { createTransporter, generateResetEmailTemplate };