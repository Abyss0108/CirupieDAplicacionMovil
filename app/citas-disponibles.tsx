import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, FlatList, ActivityIndicator, Modal, TextInput } from "react-native";
import { Calendar } from "react-native-calendars";
import { useStripe } from "@stripe/stripe-react-native";

interface Cita {
  IdCita: number;
  Nombre: string;
  ApellidoP: string;
  HorarioInicio: string;
  HoraFin: string;
  Descripcion: string;
}

export default function CitasDisponibles() {
  const [citasDisponibles, setCitasDisponibles] = useState<Cita[]>([]);
  const [citasFiltradas, setCitasFiltradas] = useState<Cita[]>([]);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [email, setEmail] = useState("");
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useEffect(() => {
    obtenerCitasDisponibles();
  }, []);

  const obtenerCitasDisponibles = async () => {
    try {
      const response = await fetch("https://rest-api2-three.vercel.app/api/citas-disponibles");
      if (!response.ok) throw new Error("Error al obtener las citas disponibles");
      const citas = await response.json();
      setCitasDisponibles(citas);
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar las citas disponibles");
    }
  };

  const handleDateSelection = (dateString: string) => {
    const citasEnFecha = citasDisponibles.filter(
      (cita) => new Date(cita.HorarioInicio).toISOString().split("T")[0] === dateString
    );
    setCitasFiltradas(citasEnFecha);
  };

  const handleCitaSelection = (cita: Cita) => {
    setSelectedCita(cita);
    setShowVerificationModal(true);
  };

  const verifyPatient = async () => {
    try {
      const response = await fetch(`https://rest-api2-three.vercel.app/api/pacientes-correo/${email}`);
      const data = await response.json();
      if (data.IdPaciente) {
        setPacienteId(data.IdPaciente);
        setShowVerificationModal(false);
        initializePaymentSheet(data.IdPaciente);
      } else {
        Alert.alert("Información", "No estás registrado como paciente. Por favor regístrate.");
      }
    } catch (error) {
      Alert.alert("Error", "Error al verificar paciente");
    }
  };

  const initializePaymentSheet = async (idPaciente: number) => {
    if (!selectedCita) return;

    try {
      setIsLoading(true);

      const response = await fetch("https://rest-api2-three.vercel.app/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1000, citaId: selectedCita.IdCita, pacienteId: idPaciente }),
      });

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        throw new Error("Error al inicializar el PaymentSheet.");
      }

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "Tu Empresa",
      });

      if (error) {
        throw new Error(error.message || "Error al inicializar el PaymentSheet.");
      }

      setShowPaymentSheet(true);
    } catch (error) {
      console.error("Error al inicializar el PaymentSheet:", error);
      Alert.alert("Error", "No se pudo inicializar el formulario de pago.");
    } finally {
      setIsLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    try {
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert("Pago cancelado", error.message || "El pago fue cancelado.");
      } else {
        Alert.alert("Pago exitoso", "¡El pago se realizó con éxito!");
        setShowPaymentSheet(false);
        actualizarCita();
      }
    } catch (error) {
      console.error("Error al presentar el PaymentSheet:", error);
      Alert.alert("Error", "Hubo un problema al procesar el pago.");
    }
  };

  const actualizarCita = async () => {
    if (!selectedCita || !pacienteId) return;

    try {
      const response = await fetch(`https://rest-api2-three.vercel.app/api/citas-disponibles/${selectedCita.IdCita}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IdPaciente: pacienteId,
        }),
      });
      if (response.ok) {
        Alert.alert("Éxito", "Cita agendada correctamente.");
        obtenerCitasDisponibles();
      } else {
        throw new Error("Error al actualizar la cita.");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo agendar la cita.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>Citas Disponibles</Text>

      <Calendar
        onDayPress={(day) => handleDateSelection(day.dateString)}
        markedDates={citasDisponibles.reduce((acc, cita) => {
          const date = new Date(cita.HorarioInicio).toISOString().split("T")[0];
          acc[date] = { marked: true, selectedColor: "blue" };
          return acc;
        }, {} as { [key: string]: { marked: boolean; selectedColor: string } })}
      />

      <FlatList
        data={citasFiltradas}
        keyExtractor={(item) => item.IdCita.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleCitaSelection(item)}>
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" }}>
              <Text style={{ fontSize: 16 }}>{item.Nombre} {item.ApellidoP}</Text>
              <Text>{new Date(item.HorarioInicio).toLocaleTimeString()} - {new Date(item.HoraFin).toLocaleTimeString()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={showVerificationModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Verificar Paciente</Text>
            <TextInput
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={verifyPatient}>
              <Text style={styles.buttonText}>Verificar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => setShowVerificationModal(false)}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showPaymentSheet} animationType="slide" transparent={true}>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Formulario de Pago</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={openPaymentSheet}>
            <Text style={styles.buttonText}>Pagar y Agendar Cita</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => setShowPaymentSheet(false)} // Cierra el modal
          >
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: "#6c757d",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
