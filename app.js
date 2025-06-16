const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');

const userRoutes = require('./routes/Usuarios');
const reservasRoutes = require('./routes/reservas');
const Reserva = require('./models/Reserva');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Conectado a MongoDB');
}).catch((err) => {
  console.error('❌ Error de conexión a MongoDB:', err);
});

app.use('/api/usuarios', userRoutes);
app.use('/api/reservas', reservasRoutes);

// Cron para generar clases semanalmente
cron.schedule('0 12 * * 0', async () => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() + i);
    const dia = fecha.getDay();
    const fechaStr = fecha.toISOString().split('T')[0];

    let clases = [];

    if (dia >= 1 && dia <= 5) {
      const horarios = [
        ...generarHorarios('Funcional', 7, 11),
        ...generarHorarios('Funcional', 13, dia === 2 || dia === 4 ? 14 : 15),
        ...(dia === 2 || dia === 4 ? generarHorarios('Pilates', 14, 16) : []),
        ...generarHorarios('Musculacion', dia === 2 || dia === 4 ? 16 : 15, 20),
      ];
      clases = horarios.map(h => ({ fecha: fechaStr, hora: h.hora, tipo: h.tipo }));
    } else if (dia === 6) {
      const horarios = generarHorarios('Funcional y Musculacion', 7, 13);
      clases = horarios.map(h => ({ fecha: fechaStr, hora: h.hora, tipo: h.tipo }));
    }

    for (const clase of clases) {
      const existe = await Reserva.findOne({ fecha: clase.fecha, hora: clase.hora, tipo: clase.tipo });
      if (!existe) await Reserva.create({ ...clase, usuarios: [] });
    }
  }

  console.log('✅ Clases generadas automáticamente');
});

function generarHorarios(tipo, desde, hasta) {
  const horas = [];
  for (let h = desde; h < hasta; h++) {
    horas.push({ tipo, hora: `${h.toString().padStart(2, '0')}:00` });
  }
  return horas;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
