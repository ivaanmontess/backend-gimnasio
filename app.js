require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
const User = require('./models/User');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/usuarios', userRoutes);

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(3000, () => console.log('🚀 Servidor corriendo en http://localhost:3000'));
  })
  .catch((err) => console.error('❌ Error al conectar con MongoDB:', err));

// Cron para verificar membresías vencidas 1 vez por día
cron.schedule('0 0 * * *', async () => {
  const hoy = new Date();
  console.log('⏰ Verificando membresías vencidas...');

  try {
    const usuarios = await User.find({ membresiaPagada: true });
    for (const usuario of usuarios) {
      const diasDiferencia = Math.floor((hoy - usuario.fechaUltimoPago) / (1000 * 60 * 60 * 24));
      if (diasDiferencia > 30) {
        usuario.membresiaPagada = false;
        await usuario.save();
        console.log(`🔴 Usuario ${usuario.nombre} ahora tiene la membresía vencida.`);
      }
    }
  } catch (error) {
    console.error('⚠️ Error al verificar membresías:', error.message);
  }
});
