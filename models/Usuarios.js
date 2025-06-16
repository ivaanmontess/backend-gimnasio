// models/Usuario.js
const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  dni: { type: String, required: true, unique: true },
  nombre: String,
  email: String,
  telefono: String,
  direccion: String,
  fechaNacimiento: Date,
  fechaVencimiento: Date,
  membresiaActiva: Boolean,
  fechaPago: Date
});

module.exports = mongoose.model('User', UsuarioSchema);
