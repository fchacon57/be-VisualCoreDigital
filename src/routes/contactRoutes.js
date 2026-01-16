const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  try {
    const nuevoContacto = new Contact(req.body);
    const contactoGuardado = await nuevoContacto.save();
    
    res.status(201).json({ 
      success: true,
      mensaje: 'Contacto guardado exitosamente',
      data: contactoGuardado 
    });
  } catch (error) {
    // Si el error es de validación de Mongoose
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
        success: false,
        error: 'Error de validación',
        detalles: mensajes 
      });
    }

    // Error genérico del servidor
    console.error("Error en el servidor:", error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor' 
    });
  }
});

module.exports = router;