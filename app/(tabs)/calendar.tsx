import React, { useState, useEffect } from "react";
import { View, Text, Modal, Button, StyleSheet } from "react-native";
import { Agenda, AgendaSchedule } from "react-native-calendars";
import { AgendaEntry } from "react-native-calendars";

import moment from "moment";
import "moment-timezone"; 

interface Cita {
  IdCita: number;
  Nombre: string;
  ApellidoP: string;
  HorarioInicio: string;
  HoraFin: string;
  Descripcion: string;
  Estado: boolean;
}
interface CustomAgendaEntry extends AgendaEntry {
  id: number;
  name: string;
  start: Date;
  end: Date;
  description: string;
  estado: boolean;
}

interface Evento {
  id: number;
  name: string;
  start: Date;
  end: Date;
  description: string;
  estado: boolean;
}

export default function Admin() {
  const [citas, setCitas] = useState<AgendaSchedule>({});
  const [selectedEvent, setSelectedEvent] = useState<Evento | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    obtenerCitas();
  }, []);

  const obtenerCitas = async () => {
    try {
      const response = await fetch("https://rest-api2-three.vercel.app/api/citas");
      const data: Cita[] = await response.json();
      
      // Ordenar citas por HorarioInicio
      const citasOrdenadas = data.sort((a, b) => moment(a.HorarioInicio).diff(moment(b.HorarioInicio)));
      
      const citasFormateadas = citasOrdenadas.reduce<AgendaSchedule>((acc, cita) => {
        const date = moment(cita.HorarioInicio).format("YYYY-MM-DD");
        if (!acc[date]) acc[date] = [];
        const start = moment.tz(cita.HorarioInicio, "America/Argentina/Buenos_Aires").add(6, 'hours');
        const end = moment.tz(cita.HoraFin, "America/Argentina/Buenos_Aires").add(6, 'hours'); 
        acc[date].push({
          id: cita.IdCita,
          name: `${cita.Nombre} ${cita.ApellidoP}`,
          start: start.toDate(),
          end: end.toDate(),
          description: cita.Descripcion,
          estado: cita.Estado,
        } as CustomAgendaEntry);
        
        return acc;
      }, {});
      
      setCitas(citasFormateadas);
    } catch (error) {
      console.error("Error al obtener citas:", error);
    }
  };
  

  const handleSelectEvent = (event: Evento) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Calendario</Text>
      <Agenda
        items={citas}
        selected={moment().format("YYYY-MM-DD")}
        renderItem={(item: any) => {
          const cita = item as Evento;
          return (
            <View style={styles.item}>
              <Text onPress={() => handleSelectEvent(cita)}>
                {cita.name}: {moment(cita.start).format("MM-DD HH:mm")} - {moment(cita.end).format("HH:mm")}
              </Text>
            </View>
          );
        }}
       
        theme={{
          agendaDayTextColor: "black",
          agendaDayNumColor: "black",
          agendaTodayColor: "red",
          agendaKnobColor: "blue",
          backgroundColor: "#f0f0f0", 
        }}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            {selectedEvent && (
              <View>
                <Text style={styles.modalTitle}>Detalles de la cita</Text>
                <Text style={styles.modalText}>Título: {selectedEvent.name}</Text>
                <Text style={styles.modalText}>Inicio: {moment(selectedEvent.start).format("LLL")}</Text>
                <Text style={styles.modalText}>Fin: {moment(selectedEvent.end).format("LLL")}</Text>
                <Text style={styles.modalText}>Descripción: {selectedEvent.description}</Text>
              </View>
            )}
            <Button 
              title="Cerrar" 
              onPress={() => setModalVisible(false)} 
              color="#2196F3" 
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginVertical: 20,
  },
  item: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 1, 
    borderRadius: 5, 
  },
  emptyDate: {
    padding: 50, 
    backgroundColor: "#e0e0e0", 
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 5, 
  },  
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    padding: 20,
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#2196F3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
