const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  telefono: String,
  direccion: String,
  fechaNacimiento: Date,
  fechaVencimiento: Date,         
  membresiaActiva: Boolean,     
  fechaPago: Date,  
});

module.exports = mongoose.model('User', userSchema);
