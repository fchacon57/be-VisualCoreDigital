const customerWelcomeTemplate = (nombre) => {
    return `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 15px; overflow: hidden;">
        <div style="background-color: #002b5c; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Visual Core Digital</h1>
        </div>
        <div style="padding: 30px; line-height: 1.6;">
          <h2 style="color: #002b5c;">¡Hola ${nombre}!</h2>
          <p>Hemos recibido tu requerimiento correctamente. Gracias por contactar con nosotros.</p>
          <p>Uno de nuestros especialistas revisará la información y se pondrá en contacto contigo a la brevedad para conversar sobre tu proyecto.</p>
          
          <div style="background-color: #f0f7ff; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #002b5c;">
            <p style="margin: 0; font-size: 14px; color: #002b5c;"><strong>Nota:</strong> Este es un acuse de recibo automático. No es necesario que respondas a este correo a menos que desees agregar detalles adicionales.</p>
          </div>
        </div>
        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 11px; color: #888;">
          © 2026 Visual Core Digital - Transformación Digital & Software de Alto Impacto
        </div>
      </div>
    `;
};

module.exports = { customerWelcomeTemplate };