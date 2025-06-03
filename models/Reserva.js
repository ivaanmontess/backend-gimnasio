import mongoose from 'mongoose';

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

const Reserva = mongoose.model('Reserva', reservaSchema);

export default Reserva;
