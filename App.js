import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Appearance,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';

export default function App() {
  const systemTheme = Appearance.getColorScheme();
  const [dni, setDni] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [modoOscuro, setModoOscuro] = useState(systemTheme === 'dark');

  useEffect(() => {
    (async () => {
      const temaGuardado = await AsyncStorage.getItem('tema');
      if (temaGuardado) setModoOscuro(temaGuardado === 'oscuro');
    })();
  }, []);

  const [nuevoUsuario, setNuevoUsuario] = useState({
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  fechaNacimiento: '',
  fechaVencimiento: '',
  membresiaActiva: '',
  fechaPago: ''
});

const handleChange = (e) => {
  const { name, value } = e.target;
  setNuevoUsuario(prev => ({ ...prev, [name]: value }));
};


  const buscarUsuario = async () => {
    try {
      const res = await axios.get(`https://backend-gimnasio-fqfn.onrender.com/api/usuarios/${dni}`);
      setUsuario(res.data);
    } catch (err) {
      setUsuario(null);
      alert('Usuario no encontrado');
    }
  };

  const toggleTema = async () => {
    const nuevoTema = !modoOscuro;
    setModoOscuro(nuevoTema);
    await AsyncStorage.setItem('tema', nuevoTema ? 'oscuro' : 'claro');
  };

  const estilos = crearEstilos(modoOscuro);

  return (
    <View style={estilos.container}>
      <View style={estilos.toggleRow}>
        <FontAwesome name={modoOscuro ? 'moon-o' : 'sun-o'} size={24} color={modoOscuro ? 'white' : 'black'} />
        <Switch value={modoOscuro} onValueChange={toggleTema} />
      </View>

      <Text style={estilos.titulo}>Ingresá tu DNI</Text>
      <TextInput
        value={dni}
        onChangeText={setDni}
        placeholder="Ej: 12345678"
        style={estilos.input}
        placeholderTextColor={modoOscuro ? '#aaa' : '#666'}
        keyboardType="numeric"
      />
      <TouchableOpacity style={estilos.boton} onPress={buscarUsuario}>
        <Text style={estilos.botonTexto}>Buscar</Text>
      </TouchableOpacity>

      {mostrarFormulario && (
  <form className="formulario-usuario" onSubmit={handleCrearUsuario}>
    <input
      type="text"
      name="nombre"
      placeholder="Nombre"
      value={nuevoUsuario.nombre}
      onChange={handleChange}
      required
    />
    <input
      type="email"
      name="email"
      placeholder="Email"
      value={nuevoUsuario.email}
      onChange={handleChange}
      required
    />
    <input
      type="text"
      name="telefono"
      placeholder="Teléfono"
      value={nuevoUsuario.telefono}
      onChange={handleChange}
    />
    <input
      type="text"
      name="direccion"
      placeholder="Dirección"
      value={nuevoUsuario.direccion}
      onChange={handleChange}
    />
    <input
      type="date"
      name="fechaNacimiento"
      value={nuevoUsuario.fechaNacimiento}
      onChange={handleChange}
    />
    <input
      type="date"
      name="fechaVencimiento"
      value={nuevoUsuario.fechaVencimiento}
      onChange={handleChange}
      required
    />

    <label>
      ¿Pagó?
      <select
        name="membresiaActiva"
        value={nuevoUsuario.membresiaActiva}
        onChange={handleChange}
        required
      >
        <option value="">Seleccionar</option>
        <option value="true">Sí</option>
        <option value="false">No</option>
      </select>
    </label>

    {nuevoUsuario.membresiaActiva === 'true' && (
      <input
        type="date"
        name="fechaPago"
        value={nuevoUsuario.fechaPago}
        onChange={handleChange}
        required
      />
    )}

    <button type="submit">Guardar</button>
  </form>
)}

    </View>
  );
}
const handleCrearUsuario = async (e) => {
  e.preventDefault();
  try {
    const usuarioAEnviar = {
      ...nuevoUsuario,
      membresiaActiva: nuevoUsuario.membresiaActiva === 'true',
    };

    await crearUsuario(usuarioAEnviar);
    setNuevoUsuario({
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      fechaNacimiento: '',
      fechaVencimiento: '',
      membresiaActiva: '',
      fechaPago: ''
    });
    setMostrarFormulario(false);
    cargarUsuarios();
  } catch (error) {
    alert('Error al crear usuario');
  }
};
<p><strong>Fecha de pago:</strong> {usuario.fechaPago?.substring(0, 10) || '-'}</p>



function crearEstilos(modoOscuro) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: modoOscuro ? '#121212' : '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      position: 'absolute',
      top: 50,
      right: 20,
    },
    titulo: {
      fontSize: 22,
      fontWeight: 'bold',
      color: modoOscuro ? '#fff' : '#000',
      marginBottom: 20,
    },
    input: {
      borderWidth: 1,
      borderColor: modoOscuro ? '#ccc' : '#888',
      backgroundColor: modoOscuro ? '#222' : '#f0f0f0',
      color: modoOscuro ? '#fff' : '#000',
      width: '100%',
      padding: 10,
      borderRadius: 8,
      marginBottom: 20,
    },
    boton: {
      backgroundColor: '#8000ff',
      padding: 12,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
      marginBottom: 20,
    },
    botonTexto: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    usuarioCard: {
      backgroundColor: modoOscuro ? '#333' : '#eee',
      padding: 20,
      borderRadius: 10,
      width: '100%',
      marginTop: 10,
    },
    usuarioTexto: {
      fontSize: 16,
      color: modoOscuro ? '#fff' : '#000',
      marginBottom: 5,
    },
    
  }
);
}
