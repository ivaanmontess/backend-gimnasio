const express = require('express');
const router = express.Router();
const Reserva = require('../models/Reserva');

// Obtener todas las clases disponibles
router.get('/', async (req, res) => {
  try {
    const reservas = await Reserva.find();
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas' });
  }
});

// Reservar una clase
router.post('/reservar', async (req, res) => {
  const { fecha, hora, tipo, dni, nombre } = req.body;

  try {
    const clase = await Reserva.findOne({ fecha, hora, tipo });

    if (!clase) {
      return res.status(404).json({ error: 'Clase no encontrada' });
    }

    if (clase.usuarios.length >= 15) {
      return res.status(400).json({ error: 'Clase llena (máximo 15 personas)' });
    }

    const yaInscripto = clase.usuarios.find(u => u.dni === dni);

    if (yaInscripto) {
      return res.status(400).json({ error: 'Ya estás anotado en esta clase' });
    }

    clase.usuarios.push({ dni, nombre });
    await clase.save();

    res.json({ mensaje: 'Reserva confirmada', clase });
  } catch (error) {
    res.status(500).json({ error: 'Error al reservar la clase' });
  }
});

module.exports = router;
