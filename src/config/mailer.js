const nodemailer = require('nodemailer');

// Configuración del transportador
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verificación de la conexión con Gmail
transporter.verify().then(() => {
  console.log('📧 Servidor listo para enviar correos');
}).catch((err) => {
  console.error('❌ Error en la configuración de email:', err);
});

module.exports = transporter;