import React, { useEffect, useState } from "react";
import { View, Text, Alert, TextInput, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button } from "react-native-paper";
import moment from "moment";

interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
}

export default function AgregarCita() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [start, setStart] = useState<Date | null>(new Date());
  const [end, setEnd] = useState<Date | null>(new Date());
  const [description, setDescription] = useState("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    obtenerPacientes();
  }, []);

  const obtenerPacientes = async () => {
    try {
      const response = await fetch("https://rest-api2-three.vercel.app/api/pacientes");
      const data = await response.json();
      const pacientesFormateados = data.map((paciente: any) => ({
        id: paciente.IdPaciente,
        nombre: paciente.Nombre,
        apellido: paciente.ApellidoP,
      }));
      setPacientes(pacientesFormateados);
    } catch (error) {
      Alert.alert("Error", "Error en el servidor al obtener los pacientes");
    }
  };

  const handleSubmit = async () => {
    if (!selectedPaciente || !start || !end || !description) {
      Alert.alert("Campos incompletos", "Por favor completa todos los campos");
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
        throw new Error(data.msg || "Error al agregar la cita");
      }

      Alert.alert("Éxito", "Cita agregada correctamente");
      setSelectedPaciente(null);
      setStart(null);
      setEnd(null);
      setDescription("");
    } catch (error: unknown) {
      console.error("Error al agregar la cita:", error);
      if (error instanceof Error) {
        Alert.alert("Error", error.message || "Error en el servidor al agregar la cita");
      } else {
        Alert.alert("Error", "Error desconocido al agregar la cita");
      }
    }
  };

  const handleStartDateChange = (_: any, selectedDate: Date | undefined) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      const currentStart = start || new Date();
      currentStart.setFullYear(selectedDate.getFullYear());
      currentStart.setMonth(selectedDate.getMonth());
      currentStart.setDate(selectedDate.getDate());
      setStart(new Date(currentStart));
      setShowStartTimePicker(true);
    }
  };

  const handleStartTimeChange = (_: any, selectedTime: Date | undefined) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const currentStart = start || new Date();
      currentStart.setHours(selectedTime.getHours());
      currentStart.setMinutes(selectedTime.getMinutes());
      setStart(new Date(currentStart));
    }
  };

  const handleEndDateChange = (_: any, selectedDate: Date | undefined) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      const currentEnd = end || new Date();
      currentEnd.setFullYear(selectedDate.getFullYear());
      currentEnd.setMonth(selectedDate.getMonth());
      currentEnd.setDate(selectedDate.getDate());
      setEnd(new Date(currentEnd));
      setShowEndTimePicker(true);
    }
  };

  const handleEndTimeChange = (_: any, selectedTime: Date | undefined) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const currentEnd = end || new Date();
      currentEnd.setHours(selectedTime.getHours());
      currentEnd.setMinutes(selectedTime.getMinutes());
      setEnd(new Date(currentEnd));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Cita</Text>
      <Picker
        selectedValue={selectedPaciente}
        onValueChange={(itemValue) => setSelectedPaciente(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecciona un paciente" value={null} />
        {pacientes.map((paciente) => (
          <Picker.Item
            key={paciente.id}
            label={`${paciente.nombre} ${paciente.apellido}`}
            value={paciente.id}
          />
        ))}
      </Picker>

      <Button
        mode="contained"
        onPress={() => setShowStartDatePicker(true)}
        style={styles.button}
      >
        Seleccionar Fecha de Inicio
      </Button>
      <Text style={styles.dateText}>
        {start ? moment(start).format("YYYY-MM-DD HH:mm") : "Fecha de Inicio no seleccionada"}
      </Text>

      {showStartDatePicker && (
        <DateTimePicker
          value={start || new Date()}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}
      {showStartTimePicker && (
        <DateTimePicker
          value={start || new Date()}
          mode="time"
          display="default"
          onChange={handleStartTimeChange}
        />
      )}

      <Button
        mode="contained"
        onPress={() => setShowEndDatePicker(true)}
        style={styles.button}
      >
        Seleccionar Fecha de Fin
      </Button>
      <Text style={styles.dateText}>
        {end ? moment(end).format("YYYY-MM-DD HH:mm") : "Fecha de Fin no seleccionada"}
      </Text>

      {showEndDatePicker && (
        <DateTimePicker
          value={end || new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
      {showEndTimePicker && (
        <DateTimePicker
          value={end || new Date()}
          mode="time"
          display="default"
          onChange={handleEndTimeChange}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
        Agregar Cita
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 16,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  picker: {
    height: 50,
    marginBottom: 24,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  button: {
    marginBottom: 12,
    backgroundColor: "#007bff",
  },
  dateText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
    marginBottom: 16,
    backgroundColor: "#ffffff",
  },
  submitButton: {
    marginTop: 20,
  },
});
