const transporter = require('../config/mailer');
const { contactEmailTemplate } = require('../templates/emailTemplate');
const { customerWelcomeTemplate } = require('../templates/customerTemplate');

/**
 * Envía notificaciones duales: 
 * 1. Al equipo interno de Visual Core (Lead)
 * 2. Al cliente que llenó el formulario (Agradecimiento)
 */
const sendContactNotification = async (contactData) => {
    try {
        // --- PREPARACIÓN: Correo Interno (Para ti) ---
        const adminMailOptions = {
            from: `"Visual Core Digital" <${process.env.EMAIL_USER}>`,
            to: 'visualcoredigital@gmail.com',
            subject: `Nuevo Lead: ${contactData.nombre}`,
            html: contactEmailTemplate(contactData)
        };

        // --- PREPARACIÓN: Correo Cliente (Agradecimiento) ---
        const customerMailOptions = {
            from: `"Visual Core Digital" <${process.env.EMAIL_USER}>`,
            to: contactData.email,
            replyTo: 'visualcoredigital@gmail.com', // <--- Añade esto
            subject: 'Confirmación de contacto - Visual Core Digital',
            html: customerWelcomeTemplate(contactData.nombre),
            // Esto también ayuda a que los filtros lo vean como importante
            priority: 'high' 
        };

        // --- EJECUCIÓN: Envío en Paralelo ---
        // Usamos Promise.all para que ambos procesos inicien simultáneamente.
        // Node.js esperará a que AMBOS se completen antes de pasar al siguiente paso.
        const [infoAdmin, infoCustomer] = await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(customerMailOptions)
        ]);

        console.log('✅ Notificación interna enviada:', infoAdmin.messageId);
        console.log('✅ Agradecimiento enviado al cliente:', infoCustomer.messageId);

        return { infoAdmin, infoCustomer };

    } catch (error) {
        // Si cualquiera de los dos falla, el catch capturará el error.
        console.error('❌ Error crítico en mailService:', error.message);
        throw error; 
    }
};

module.exports = { sendContactNotification };