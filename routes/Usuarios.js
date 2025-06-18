const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 📌 Rutas específicas (importante ponerlas antes que las generales)
router.get('/vencidas', userController.detectarMembresiasVencidas);
router.get('/proximas-vencidas', userController.obtenerMembresiasProximasAVencer);
router.get('/exportar/excel', userController.exportarUsuariosExcel);

// 📌 Rutas generales
router.post('/', userController.crearUsuario);           // POST /usuarios
router.get('/', userController.obtenerUsuarios);         // GET /usuarios
router.put('/:id', userController.actualizarMembresia);  // PUT /usuarios/:id
router.delete('/:id', userController.eliminarUsuario);   // DELETE /usuarios/:id

module.exports = router;
