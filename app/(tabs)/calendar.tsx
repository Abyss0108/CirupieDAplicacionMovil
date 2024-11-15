import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
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

export default function Citas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(moment().format("YYYY-MM-DD"));
  const [citasFiltradas, setCitasFiltradas] = useState<Cita[]>([]);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    obtenerCitas();
  }, []);

  useEffect(() => {
    // Filtrar citas para la fecha seleccionada
    const citasEnFecha = citas.filter(
      cita => moment(cita.HorarioInicio).format("YYYY-MM-DD") === selectedDate
    );
    setCitasFiltradas(citasEnFecha);
  }, [selectedDate, citas]);

  const obtenerCitas = async () => {
    try {
      const response = await fetch("https://rest-api2-three.vercel.app/api/citas");
      const data = await response.json();
      setCitas(data);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las citas");
    }
  };

  const handleDateSelection = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleSelectEvent = (cita: Cita) => {
    setSelectedCita(cita);
    setModalVisible(true);
  };

  const renderCita = ({ item }: { item: Cita }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelectEvent(item)}>
      <Text style={styles.itemText}>{item.Nombre} {item.ApellidoP}</Text>
      <Text>{moment(item.HorarioInicio).format("HH:mm")} - {moment(item.HoraFin).format("HH:mm")}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendario de Citas</Text>
      <Calendar
        onDayPress={handleDateSelection}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: 'blue' },
          ...citas.reduce((acc, cita) => {
            const date = moment(cita.HorarioInicio).format("YYYY-MM-DD");
            acc[date] = { marked: true, dotColor: 'red' };
            return acc;
          }, {} as { [key: string]: { marked: boolean; dotColor?: string } })
        }}
      />

      {citasFiltradas.length > 0 ? (
        <FlatList
          data={citasFiltradas}
          keyExtractor={item => item.IdCita.toString()}
          renderItem={renderCita}
        />
      ) : (
        <Text style={styles.noCitasText}>No hay citas para esta fecha.</Text>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCita && (
              <View>
                <Text style={styles.modalTitle}>Detalles de la Cita</Text>
                <Text style={styles.modalText}>Paciente: {selectedCita.Nombre} {selectedCita.ApellidoP}</Text>
                <Text style={styles.modalText}>Inicio: {moment(selectedCita.HorarioInicio).format("LLL")}</Text>
                <Text style={styles.modalText}>Fin: {moment(selectedCita.HoraFin).format("LLL")}</Text>
                <Text style={styles.modalText}>Descripción: {selectedCita.Descripcion}</Text>
              </View>
            )}
            <Button title="Cerrar" onPress={() => setModalVisible(false)} color="#2196F3" />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  item: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 5,
    marginVertical: 5,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  noCitasText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 5,
    color: "#333",
  },
});
