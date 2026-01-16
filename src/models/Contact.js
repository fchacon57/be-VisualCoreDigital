const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'],
    trim: true // Elimina espacios vacíos al inicio y final
  },
  email: { 
    type: String, 
    required: [true, 'El email es obligatorio'],
    lowercase: true, // Guarda siempre en minúsculas
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  telefono: {
    codigoPais: { type: String, required: true },
    prefijo: { type: String },
    numero: { 
      type: String, 
      required: [true, 'El número es obligatorio'],
      minlength: [7, 'El número es demasiado corto']
    }
  },
  empresa: { type: String, trim: true },
  descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', ContactSchema);