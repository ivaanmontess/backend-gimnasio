const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String },
  documento: { type: String, required: true, unique: true },
  celular: { type: String },
  direccion: { type: String },
  fechaNacimiento: { type: Date },
  fechaUltimoPago: { type: Date },
  membresiaPagada: { type: Boolean, default: false }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
