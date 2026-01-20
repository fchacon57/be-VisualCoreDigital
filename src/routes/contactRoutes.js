const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendContactNotification } = require('../services/mailService');

router.post('/', async (req, res) => {
    let dbError = false;
    let savedData = null;

    try {
        // 1. Intentamos guardar en la Base de Datos
        const nuevoContacto = new Contact(req.body);
        savedData = await nuevoContacto.save();
    } catch (error) {
        // Si hay un error, lo registramos pero no detenemos el proceso del email
        console.error("❌ Error al guardar en DB:", error.message);
        dbError = true;
        
        // Si el error es de validación (datos mal escritos), ahí sí es mejor avisar al usuario
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, detalles: mensajes });
        }
    }

    // 2. DISPARAR EMAIL (Ocurre siempre, a menos que sea un error de validación previo)
    // Agregamos una nota al mail si hubo error en DB para que tú lo sepas
    const dataConEstado = { 
        ...req.body, 
        avisoSistema: dbError ? "⚠️ ATENCIÓN: Este contacto NO se pudo guardar en la base de datos, solo se envió por email." : "✅ Guardado correctamente en MongoDB."
    };

    sendContactNotification(dataConEstado).catch(err => 
        console.error("Falla crítica: No se pudo enviar el mail ni guardar en DB", err)
    );

    // 3. RESPUESTA AL CLIENTE
    if (dbError) {
        // Si no se guardó en DB pero el mail salió, damos una respuesta de "éxito parcial"
        return res.status(202).json({ 
            success: true, 
            mensaje: 'Recibimos tu mensaje, pero hubo un inconveniente técnico interno. Te contactaremos pronto.' 
        });
    }

    res.status(201).json({ 
        success: true, 
        mensaje: 'Lead capturado y notificado correctamente',
        data: savedData 
    });
});

module.exports = router;