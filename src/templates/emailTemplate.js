const contactEmailTemplate = (data) => {
    const { nombre, email, telefono, empresa, descripcion, avisoSistema, dbError } = data;
    
    // Configuramos el color y mensaje del banner de estado
    // Rojo (#d32f2f) si hay error en DB, Verde (#2e7d32) si todo está OK
    const statusColor = dbError ? '#d32f2f' : '#2e7d32'; 
    const statusText = avisoSistema;

    return `
      <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 15px; overflow: hidden;">
        
        <div style="background-color: ${statusColor}; color: white; padding: 10px; text-align: center; font-size: 13px; font-weight: bold;">
          ${statusText}
        </div>

        <div style="background-color: #002b5c; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Visual Core Digital</h1>
        </div>

        <div style="padding: 30px; line-height: 1.6;">
          <h2 style="color: #002b5c; border-bottom: 2px solid #002b5c; padding-bottom: 10px;">Nuevo Requerimiento</h2>
          
          <p style="margin: 10px 0;"><strong>👤 Nombre:</strong> ${nombre}</p>
          <p style="margin: 10px 0;"><strong>📧 Email:</strong> ${email}</p>
          <p style="margin: 10px 0;"><strong>🏢 Empresa:</strong> ${empresa || 'No especificada'}</p>
          <p style="margin: 10px 0;"><strong>📞 Teléfono:</strong> ${telefono.formateado}</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #002b5c;">
            <p style="margin-top: 0; font-weight: bold; color: #002b5c;">📝 Descripción del Proyecto:</p>
            <p style="font-style: italic; color: #555;">"${descripcion}"</p>
          </div>
        </div>

        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 11px; color: #888;">
          Este es un mensaje automático enviado desde el sistema de contacto de Visual Core Digital.
        </div>
      </div>
    `;
};

// Exportación correcta para Node.js (CommonJS)
module.exports = { contactEmailTemplate };