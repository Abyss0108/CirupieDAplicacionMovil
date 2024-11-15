import React, { useState, useEffect } from "react";
import { View, Text, Button, Modal, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";

interface Cita {
  IdCita: number;
  Nombre: string;
  ApellidoP: string;
  HorarioInicio: string;
  HoraFin: string;
  Descripcion: string;
}

export default function CitasDisponibles() {
  const router = useRouter();
  const [citasDisponibles, setCitasDisponibles] = useState<Cita[]>([]);
  const [citasFiltradas, setCitasFiltradas] = useState<Cita[]>([]);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isPatient, setIsPatient] = useState(false);
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState({ rating: 5, comment: "" });

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

  const handlePatientVerification = async () => {
    try {
      const response = await fetch(`https://rest-api2-three.vercel.app/api/pacientes-correo/${email}`);
      const data = await response.json();
      if (data.IdPaciente) {
        setPacienteId(data.IdPaciente); // Guarda el id del paciente
        setIsPatient(true);
        setShowVerificationModal(false);
        setShowPaymentForm(true);
      } else {
        Alert.alert("Información", "No estás registrado como paciente. Por favor regístrate.");
      }
    } catch (error) {
      Alert.alert("Error", "Error al verificar paciente");
    }
  };

  const verificarFeedbackExistente = async (pacienteId: number | null) => {
    if (!pacienteId) return; // Verifica que pacienteId no sea nulo antes de continuar
    try {
      const response = await fetch(`https://rest-api2-three.vercel.app/api/existe_feedback/${pacienteId}`);
      const data = await response.json();
      console.log(data.exists);
      if (data.exists === false) {
        setShowFeedbackModal(true);
      }
    } catch (error) {
      console.error("Error al verificar el feedback:", error);
    }
  };
  const handlePaymentSuccess = async () => {
    if (!selectedCita || !pacienteId) return;
    verificarFeedbackExistente(pacienteId);
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
      await response.json();
      Alert.alert("Éxito", "Se agendó su cita correctamente");
      setShowPaymentForm(false);
      verificarFeedbackExistente(pacienteId); // Muestra el modal de feedback después del pago exitoso
      obtenerCitasDisponibles();
    } catch (error) {
      Alert.alert("Error", "Error al actualizar cita");
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!pacienteId) return;

    try {
      const response = await fetch("https://rest-api2-three.vercel.app/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pacienteId: pacienteId,
          calificacion: feedback.rating,
          comentario: feedback.comment,
        }),
      });

      if (response.ok) {
        Alert.alert("Gracias", "Gracias por su retroalimentación.");
        setShowFeedbackModal(false);
        setFeedback({ rating: 5, comment: "" });
      } else {
        throw new Error("Error al enviar el feedback");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo enviar el feedback.");
    }
  };

  const CheckoutForm = ({ onPaymentSuccess }: { onPaymentSuccess: () => void }) => {
    const { confirmPayment, loading } = useConfirmPayment();
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
      setMessage("");
      onPaymentSuccess();
      
      try {
        const response = await fetch("https://rest-api2-three.vercel.app/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: 1000, pacienteId: selectedCita?.IdCita }),
        });

        const textResponse = await response.text();
        console.log("API Response:", textResponse);
        const jsonResponse = JSON.parse(textResponse);
        const { clientSecret } = jsonResponse;

        const { error, paymentIntent } = await confirmPayment(clientSecret, {
          paymentMethodType: "Card",
        });

        if (error) {
          setMessage(`Error: ${error.message}`);
        } else if (jsonResponse.success === true) {
          setMessage("Pago exitoso. Su cita ha sido agendada.");
          Alert.alert("Éxito", "Pago exitoso. Su cita ha sido agendada.");
          onPaymentSuccess();
        }
      } catch (error) {
        setMessage("Hubo un error al procesar el pago.");
        console.error("Payment Error:", error);
      }
    };

    return (
      <View style={styles.paymentContainer}>
        <CardField
          postalCodeEnabled={true}
          placeholders={{
            number: "Número de tarjeta",
            expiration: "MM/AA",
            cvc: "CVC",
          }}
          cardStyle={{
            backgroundColor: "#FFFFFF",
            textColor: "#000000",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#DDDDDD",
          }}
          style={{
            width: "100%",
            height: 50,
            marginBottom: 10,
          }}
        />
        <TouchableOpacity style={styles.payButton} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.payButtonText}>Pagar y Agendar Cita</Text>
        </TouchableOpacity>
        {loading && <ActivityIndicator size="small" color="#007AFF" style={{ marginTop: 10 }} />}
        {message && <Text style={styles.paymentMessage}>{message}</Text>}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Ir al Login" onPress={() => router.push("/login")} />
      <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}>Citas Disponibles</Text>

      <Calendar
        onDayPress={(day) => handleDateSelection(day.dateString)}
        markedDates={citasDisponibles.reduce((acc, cita) => {
          const date = new Date(cita.HorarioInicio).toISOString().split("T")[0];
          acc[date] = { marked: true, selectedColor: "blue" };
          return acc;
        }, {} as { [key: string]: { marked: boolean; selectedColor: string } })}
      />

      {citasFiltradas.length > 0 && (
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
      )}

      <Modal visible={showVerificationModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmar Cita {selectedCita && new Date(selectedCita.HorarioInicio).toLocaleString()}</Text>
            <Text>Por favor, ingresa tu correo electrónico para verificar si ya eres paciente:</Text>
            <TextInput
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.button} onPress={handlePatientVerification}>
              <Text style={styles.buttonText}>Agendar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setShowVerificationModal(false)}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showPaymentForm} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Formulario de Pago</Text>
            <CheckoutForm onPaymentSuccess={handlePaymentSuccess} />
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setShowPaymentForm(false)}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showFeedbackModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Retroalimentación</Text>
            <Text>Calificación:</Text>
            <TextInput
              placeholder="Calificación (1-5)"
              keyboardType="numeric"
              value={String(feedback.rating)}
              onChangeText={(value) => setFeedback({ ...feedback, rating: parseInt(value) })}
              style={styles.input}
            />
            <Text>Comentario:</Text>
            <TextInput
              placeholder="Escribe un comentario"
              value={feedback.comment}
              onChangeText={(value) => setFeedback({ ...feedback, comment: value })}
              style={[styles.input, { height: 60 }]}
              multiline
            />
            <TouchableOpacity style={styles.button} onPress={handleFeedbackSubmit}>
              <Text style={styles.buttonText}>Enviar </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => setShowFeedbackModal(false)}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
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
    padding: 10,
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
  paymentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: "90%",
    alignSelf: "center",
  },
  paymentTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333333",
  },
  payButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  paymentMessage: {
    marginTop: 15,
    fontSize: 14,
    color: "#333333",
    textAlign: "center",
  },
});
