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
        console.error("❌ Error al guardar en DB:", error.message);
        
        // Si el error es de validación (datos obligatorios faltantes), detenemos y avisamos
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, errores: mensajes });
        }
        
        // Para otros errores (conexión DB), marcamos la bandera para avisar en el mail
        dbError = true;
    }

    // 2. PREPARAR DATA PARA EMAIL
    // Usamos el número formateado para que en el mail que recibes sea fácil de leer
    const dataParaEmail = { 
        ...req.body, 
        avisoSistema: dbError 
            ? "⚠️ ATENCIÓN: No se pudo guardar en MongoDB. Solo se envió por email." 
            : "✅ Registro guardado correctamente en la base de datos."
    };

    // Disparar email en segundo plano
    sendContactNotification(dataParaEmail).catch(err => 
        console.error("Falla crítica en servicio de email:", err)
    );

    // 3. RESPUESTA AL CLIENTE
    if (dbError) {
        return res.status(202).json({ 
            success: true, 
            mensaje: 'Mensaje recibido. Procesando solicitud por vías alternativas.' 
        });
    }

    res.status(201).json({ 
        success: true, 
        mensaje: 'Contacto procesado con éxito',
        data: savedData 
    });
});

module.exports = router;