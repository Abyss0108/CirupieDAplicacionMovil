import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/es';

interface Cita {
  IdCita: number;
  Nombre: string;
  ApellidoP: string;
  HorarioInicio: string;
  HoraFin: string;
  Descripcion: string;
}

interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
}

export default function Citas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState<number | null>(null);
  const [start, setStart] = useState<Date | undefined>(undefined);
  const [end, setEnd] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Cita | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    obtenerCitas();
    obtenerPacientes();
  }, []);

  const obtenerCitas = async () => {
    try {
      const response = await fetch("https://rest-api2-three.vercel.app/api/citas");
      const data = await response.json();
      setCitas(data);
    } catch (error) {
      console.error("Error al obtener citas:", error);
    }
  };

  const obtenerPacientes = async () => {
    try {
      const response = await fetch("https://rest-api2-three.vercel.app/api/pacientes");
      const data = await response.json();
      setPacientes(data);
    } catch (error) {
      console.error("Error al obtener pacientes:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPaciente || !start || !end) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    const formattedStart = moment(start).format("YYYY-MM-DD HH:mm:ss");
    const formattedEnd = moment(end).format("YYYY-MM-DD HH:mm:ss");
  
    try {
      const response = await fetch("https://rest-api2-three.vercel.app/api/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IdUser: 5,
          idPaciente: selectedPaciente,
          HorarioInicio: formattedStart,
          HoraFin: formattedEnd,
          Descripcion: description,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Error al agregar la cita');
      }
      setSelectedPaciente(null);
      setStart(undefined);
      setEnd(undefined);
      setDescription("");
      obtenerCitas();
    } catch (error) {
      console.error("Error al agregar la cita:", error);
    }
  };

  const handleSelectEvent = (event: Cita) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: Cita }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectEvent(item)}>
      <Text style={styles.itemText}>{item.Nombre} {item.ApellidoP}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Cita</Text>
      
      <Picker
        selectedValue={selectedPaciente}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedPaciente(itemValue)}
      >
        <Picker.Item label="Selecciona un paciente" value={null} />
        {pacientes.map(paciente => (
          <Picker.Item key={paciente.id} label={`${paciente.nombre} ${paciente.apellido}`} value={paciente.id} />
        ))}
      </Picker>
      
      <Button title="Seleccionar Fecha de Inicio" onPress={() => setShowStartPicker(true)} />
      {showStartPicker && (
        <DateTimePicker
          value={start || new Date()}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) setStart(selectedDate);
          }}
        />
      )}
      <Text>{start ? moment(start).format("YYYY-MM-DD HH:mm") : "Fecha de Inicio no seleccionada"}</Text>
      
      <Button title="Seleccionar Fecha de Fin" onPress={() => setShowEndPicker(true)} />
      {showEndPicker && (
        <DateTimePicker
          value={end || new Date()}
          mode="datetime"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) setEnd(selectedDate);
          }}
        />
      )}
      <Text>{end ? moment(end).format("YYYY-MM-DD HH:mm") : "Fecha de Fin no seleccionada"}</Text>
      
      <TextInput 
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Agregar Cita" onPress={handleSubmit} color="#28a745" />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ced4da',
  },
  itemText: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
});
