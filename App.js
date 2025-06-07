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
  ScrollView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
  const systemTheme = Appearance.getColorScheme();
  const [dni, setDni] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [modoOscuro, setModoOscuro] = useState(systemTheme === 'dark');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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

  useEffect(() => {
    (async () => {
      const temaGuardado = await AsyncStorage.getItem('tema');
      if (temaGuardado) setModoOscuro(temaGuardado === 'oscuro');
    })();
  }, []);

  const toggleTema = async () => {
    const nuevoTema = !modoOscuro;
    setModoOscuro(nuevoTema);
    await AsyncStorage.setItem('tema', nuevoTema ? 'oscuro' : 'claro');
  };

  const handleChange = (key, value) => {
    setNuevoUsuario((prev) => ({ ...prev, [key]: value }));
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

  const handleCrearUsuario = async () => {
    try {
      const usuarioAEnviar = {
        ...nuevoUsuario,
        membresiaActiva: nuevoUsuario.membresiaActiva === 'true',
      };

      await axios.post('https://backend-gimnasio-fqfn.onrender.com/api/usuarios', usuarioAEnviar);
      alert('Usuario creado correctamente');

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
    } catch (error) {
      alert('Error al crear usuario');
    }
  };

  const estilos = crearEstilos(modoOscuro);

  return (
    <ScrollView style={estilos.container}>
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

      <TouchableOpacity style={[estilos.boton, { backgroundColor: '#28a745' }]} onPress={() => setMostrarFormulario(!mostrarFormulario)}>
        <Text style={estilos.botonTexto}>Crear nuevo usuario</Text>
      </TouchableOpacity>

      {mostrarFormulario && (
        <View style={estilos.usuarioCard}>
          <TextInput style={estilos.input} placeholder="Nombre" value={nuevoUsuario.nombre} onChangeText={(text) => handleChange('nombre', text)} />
          <TextInput style={estilos.input} placeholder="Email" value={nuevoUsuario.email} onChangeText={(text) => handleChange('email', text)} />
          <TextInput style={estilos.input} placeholder="Teléfono" value={nuevoUsuario.telefono} onChangeText={(text) => handleChange('telefono', text)} />
          <TextInput style={estilos.input} placeholder="Dirección" value={nuevoUsuario.direccion} onChangeText={(text) => handleChange('direccion', text)} />
          <TextInput style={estilos.input} placeholder="Fecha Nacimiento (YYYY-MM-DD)" value={nuevoUsuario.fechaNacimiento} onChangeText={(text) => handleChange('fechaNacimiento', text)} />
          <TextInput style={estilos.input} placeholder="Fecha Vencimiento (YYYY-MM-DD)" value={nuevoUsuario.fechaVencimiento} onChangeText={(text) => handleChange('fechaVencimiento', text)} />

          <Text style={{ color: modoOscuro ? '#fff' : '#000' }}>¿Pagó la membresía?</Text>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <TouchableOpacity style={estilos.botonMini} onPress={() => handleChange('membresiaActiva', 'true')}>
              <Text style={estilos.botonTexto}>Sí</Text>
            </TouchableOpacity>
            <TouchableOpacity style={estilos.botonMini} onPress={() => handleChange('membresiaActiva', 'false')}>
              <Text style={estilos.botonTexto}>No</Text>
            </TouchableOpacity>
          </View>

          {nuevoUsuario.membresiaActiva === 'true' && (
            <TextInput
              style={estilos.input}
              placeholder="Fecha de pago (YYYY-MM-DD)"
              value={nuevoUsuario.fechaPago}
              onChangeText={(text) => handleChange('fechaPago', text)}
            />
          )}

          <TouchableOpacity style={estilos.boton} onPress={handleCrearUsuario}>
            <Text style={estilos.botonTexto}>Guardar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function crearEstilos(modoOscuro) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: modoOscuro ? '#121212' : '#fff',
      padding: 20,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: 20,
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
      padding: 10,
      borderRadius: 8,
      marginBottom: 15,
    },
    boton: {
      backgroundColor: '#8000ff',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 20,
    },
    botonMini: {
      backgroundColor: '#8000ff',
      padding: 10,
      borderRadius: 8,
      marginRight: 10,
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
      marginTop: 20,
    },
  });
}
