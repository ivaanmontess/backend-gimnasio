const mongoose = require('mongoose');

const usuarioReservaSchema = new mongoose.Schema({
  dni: { type: String, required: true },
  nombre: { type: String, required: true },
});

const reservaSchema = new mongoose.Schema({
  fecha: { type: String, required: true }, 
  hora: { type: String, required: true },  
  tipo: { type: String, required: true },  
  usuarios: [usuarioReservaSchema],       
});

module.exports = mongoose.model('Reserva', reservaSchema);
