const User = require('../models/Usuarios');
const ExcelJS = require('exceljs');

// Crear usuario
const crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = new User({
      ...req.body,
      fechaUltimoPago: new Date()
    });
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await User.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar membresía (pago)
const actualizarMembresia = async (req, res) => {
  try {
    const { membresiaPagada } = req.body;

    if (typeof membresiaPagada === 'undefined') {
      return res.status(400).json({ error: 'Falta el campo membresiaPagada en el body' });
    }

    const usuario = await User.findByIdAndUpdate(
      req.params.id,
      {
        membresiaPagada,
        fechaUltimoPago: new Date()
      },
      { new: true }
    );

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Detectar membresías vencidas manualmente
const detectarMembresiasVencidas = async (req, res) => {
  try {
    const hoy = new Date();
    const usuarios = await User.find();

    let actualizados = [];

    for (const usuario of usuarios) {
      const diasDiferencia = Math.floor((hoy - usuario.fechaUltimoPago) / (1000 * 60 * 60 * 24));

      if (diasDiferencia > 30 && usuario.membresiaPagada) {
        usuario.membresiaPagada = false;
        await usuario.save();
        actualizados.push(usuario);
      }
    }

    res.json({
      mensaje: 'Membresías vencidas actualizadas',
      totalActualizados: actualizados.length,
      usuarios: actualizados
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Membresías que vencen en los próximos 5 días
const obtenerMembresiasProximasAVencer = async (req, res) => {
  try {
    const hoy = new Date();
    const enCincoDias = new Date();
    enCincoDias.setDate(hoy.getDate() + 5);

    const usuarios = await User.find({
      fechaUltimoPago: { $exists: true },
      membresiaPagada: true
    });

    const proximosAVencer = usuarios.filter(usuario => {
      const dias = Math.floor((hoy - usuario.fechaUltimoPago) / (1000 * 60 * 60 * 24));
      return dias >= 25 && dias <= 30;
    });

    res.status(200).json(proximosAVencer);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener usuarios con membresía próxima a vencer',
      error: error.message
    });
  }
};

// Exportar usuarios a Excel
const exportarUsuariosExcel = async (req, res) => {
  try {
    const usuarios = await User.find();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Usuarios');

    worksheet.columns = [
      { header: 'Nombre', key: 'nombre' },
      { header: 'Apellido', key: 'apellido' },
      { header: 'Documento', key: 'documento' },
      { header: 'Celular', key: 'celular' },
      { header: 'Dirección', key: 'direccion' },
      { header: 'Fecha de Nacimiento', key: 'fechaNacimiento' },
      { header: 'Fecha Último Pago', key: 'fechaUltimoPago' },
      { header: 'Membresía Pagada', key: 'membresiaPagada' }
    ];

    usuarios.forEach(user => {
      worksheet.addRow(user);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=usuarios.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).send('Error al exportar usuarios');
  }
};

// Exportación final
module.exports = {
  crearUsuario,
  obtenerUsuarios,
  actualizarMembresia,
  eliminarUsuario,
  detectarMembresiasVencidas,
  obtenerMembresiasProximasAVencer,
  exportarUsuariosExcel
};
