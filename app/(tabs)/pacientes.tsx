import React, { useState, useEffect } from "react";
import { View, Alert, StyleSheet, Modal } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { FlatList, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type Paciente = {
  IdPaciente: string;
  Nombre: string;
  ApellidoP: string;
  ApellidoM: string;
  Telefono: string;
  Correo: string;
  fechaNacimiento: string;
};

export default function Paciente() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [filteredPacientes, setFilteredPacientes] = useState<Paciente[]>([]);
  const [nombre, setNombre] = useState("");
  const [apellidoP, setApellidoP] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);

  useEffect(() => {
    obtenerPacientes();
  }, []);

  useEffect(() => {
    const result = pacientes.filter(paciente =>
      paciente.Nombre.toLowerCase().includes(search.toLowerCase()) ||
      paciente.ApellidoP.toLowerCase().includes(search.toLowerCase()) ||
      paciente.ApellidoM.toLowerCase().includes(search.toLowerCase()) ||
      paciente.Telefono.includes(search)
    );
    setFilteredPacientes(result);
  }, [search, pacientes]);

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
    if (!nombre || !apellidoP || !telefono || !correo) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios.");
      return;
    }

    if (!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(nombre) || !/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(apellidoP)) {
      Alert.alert("Error", "El nombre y el apellido paterno solo pueden contener letras.");
      return;
    }

    if (!/^\d{10}$/.test(telefono)) {
      Alert.alert("Error", "El número de teléfono debe tener 10 dígitos.");
      return;
    }

    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(correo)) {
      Alert.alert("Error", "El correo electrónico no es válido.");
      return;
    }

    try {
      const response = await fetch("https://rest-api2-three.vercel.app/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Nombre: nombre,
          ApellidoP: apellidoP,
          ApellidoM: apellidoM,
          Correo: correo,
          Telefono: telefono,
          fechaNacimiento: fechaNacimiento,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        Alert.alert("Éxito", data.msg);
        obtenerPacientes();
        setAddModalVisible(false);
      } else {
        Alert.alert("Error", data.msg);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar el paciente.");
    }
  };

  const handleDelete = () => {
    if (selectedPaciente) {
      Alert.alert(
        "Confirmar eliminación",
        "¿Estás seguro de que deseas eliminar este paciente?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            style: "destructive",
            onPress: async () => {
              try {
                const response = await fetch(
                  `https://rest-api2-three.vercel.app/api/pacientes/${selectedPaciente.IdPaciente}`,
                  { method: "DELETE" }
                );
                const data = await response.json();

                Alert.alert("Éxito", data.msg);
                obtenerPacientes();
                setSelectedPaciente(null);
                setModalVisible(false);
              } catch (error) {
                Alert.alert("Error", "No se pudo eliminar el paciente.");
              }
            },
          },
        ]
      );
    }
  };

  const renderPaciente = ({ item }: { item: Paciente }) => (
    <TouchableOpacity style={styles.card} onPress={() => { setSelectedPaciente(item); setModalVisible(true); }}>
      <Text style={styles.cardTitle}>{item.Nombre} {item.ApellidoP}</Text>
      <Text>Teléfono: {item.Telefono}</Text>
      <Text>Correo: {item.Correo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pacientes</Text>

      <TextInput
        label="Buscar"
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
        mode="outlined"
      />

      <Button mode="contained" onPress={() => setAddModalVisible(true)} style={styles.addButton}>
        Agregar nuevo paciente
      </Button>

      <FlatList
        data={filteredPacientes}
        renderItem={renderPaciente}
        keyExtractor={(item) => item.IdPaciente}
        contentContainerStyle={styles.list}
      />

      {/* Modal de agregar paciente */}
      <Modal visible={addModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Agregar nuevo paciente</Text>
            <TextInput label="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} mode="outlined" />
            <TextInput label="Apellido Paterno" value={apellidoP} onChangeText={setApellidoP} style={styles.input} mode="outlined" />
            <TextInput label="Apellido Materno" value={apellidoM} onChangeText={setApellidoM} style={styles.input} mode="outlined" />
            <TextInput label="Teléfono" value={telefono} onChangeText={setTelefono} style={styles.input} mode="outlined" keyboardType="numeric" />
            <TextInput label="Correo" value={correo} onChangeText={setCorreo} style={styles.input} mode="outlined" keyboardType="email-address" />
            <TextInput label="Fecha de Nacimiento" value={fechaNacimiento} onChangeText={setFechaNacimiento} style={styles.input} mode="outlined" />

            <Button mode="contained" onPress={handleSubmit} style={styles.modalButton}>Agregar</Button>
            <Button mode="outlined" onPress={() => setAddModalVisible(false)} style={styles.modalButton}>Cerrar</Button>
          </View>
        </View>
      </Modal>

      {/* Modal de detalles del paciente */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalles del Paciente</Text>
            {selectedPaciente && (
              <>
                <Text>Nombre: {selectedPaciente.Nombre}</Text>
                <Text>Apellido Paterno: {selectedPaciente.ApellidoP}</Text>
                <Text>Apellido Materno: {selectedPaciente.ApellidoM}</Text>
                <Text>Teléfono: {selectedPaciente.Telefono}</Text>
                <Text>Correo: {selectedPaciente.Correo}</Text>
                <Button mode="contained" onPress={handleDelete} color="red" style={styles.modalButton}>Eliminar</Button>
                <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.modalButton}>Cerrar</Button>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 16,
      },
      searchInput: {
        marginBottom: 16,
      },
      addButton: {
        marginBottom: 16,
      },
      list: {
        paddingBottom: 100,
      },
      card: {
        backgroundColor: "#f9f9f9",
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
      },
      cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
      },
      modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 8,
        width: "80%",
      },
      modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
      },
      input: {
        marginBottom: 12,
      },
      modalButton: {
        marginTop: 8,
      },
    });
