import mongoose from 'mongoose';

const reservaSchema = new mongoose.Schema({
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  tipo: { type: String, required: true },
  usuarios: [
    {
      dni: String,
      nombre: String
    }
  ]
});

export default mongoose.model('Reserva', reservaSchema);
