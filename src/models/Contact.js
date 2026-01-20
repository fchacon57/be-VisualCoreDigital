const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre es obligatorio'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'El email es obligatorio'],
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingresa un email válido']
  },
  telefono: {
    codigoPais: { type: String, required: true },
    numero: { 
      type: String, 
      required: [true, 'El número es obligatorio']
    },
    formateado: { type: String } // Almacena el número legible: "+56 9 1234 5678"
  },
  empresa: { type: String, trim: true },
  descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', ContactSchema);