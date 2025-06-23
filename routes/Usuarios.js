const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rutas
router.post('/', userController.crearUsuario);
router.get('/', userController.obtenerUsuarios);
router.put('/:id', userController.actualizarMembresia);
router.delete('/:id', userController.eliminarUsuario);
router.get('/vencidas', userController.detectarMembresiasVencidas);
router.get('/proximas-vencidas', userController.obtenerMembresiasProximasAVencer);
router.get('/exportar/excel', userController.exportarUsuariosExcel);

module.exports = router;
