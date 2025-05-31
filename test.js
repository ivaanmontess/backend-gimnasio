const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const usuarios = await User.find();
    console.log('Usuarios:', usuarios);
    process.exit();
  })
  .catch(err => {
    console.error('Error al conectar o consultar:', err.message);
  });
