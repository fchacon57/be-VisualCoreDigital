const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const axios = require('axios'); // <-- Ahora usamos axios para comunicarnos

router.post('/', async (req, res) => {
    let dbError = false;
    let savedData = null;

    try {
        // 1. Intentamos guardar en la Base de Datos
        const nuevoContacto = new Contact(req.body);
        savedData = await nuevoContacto.save();
    } catch (error) {
        console.error("❌ Error al guardar en DB:", error.message);
        
        if (error.name === 'ValidationError') {
            const mensajes = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, errores: mensajes });
        }
        
        dbError = true;
    }

    // 2. PREPARAR DATA Y LLAMAR AL MICROSERVICIO
    const dataParaEmail = { 
        ...req.body, 
        avisoSistema: dbError 
            ? "⚠️ ATENCIÓN: No se pudo guardar en MongoDB. Solo se envió por email." 
            : "✅ Registro guardado correctamente en la base de datos."
    };

    /**
     * DISPARAR NOTIFICACIÓN AL MICROSERVICIO
     * Importante: Usamos la URL del microservicio (puerto 5001)
     */
    axios.post('http://ms-notifications:5001/api/notify', dataParaEmail)
        .then(response => {
            console.log("✅ Respuesta del Microservicio:", response.data.message);
        })
        .catch(err => {
            console.error("⚠️ El Microservicio de Notificaciones no respondió:", err.message);
        });

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