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

      {usuario && (
        <View style={estilos.usuarioCard}>
          <Text style={estilos.usuarioTexto}>Nombre: {usuario.nombre}</Text>
          <Text style={estilos.usuarioTexto}>Estado de membresía: {usuario.membresiaActiva ? 'Activa' : 'Vencida'}</Text>
        </View>
      )}
    </View>
  );
}

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
  });
}
