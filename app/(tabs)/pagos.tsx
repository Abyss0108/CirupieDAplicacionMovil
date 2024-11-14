import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

type Pago = {
  pacienteId: string;
  amount: number;
  status: string;
  paymentDate: string;
  paymentId: string;
};

export default function HistorialPagos() {
  const [historial, setHistorial] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerHistorial = async () => {
      try {
        const response = await fetch('https://rest-api2-three.vercel.app/api/historial-pagos');
        const data = await response.json();
        setHistorial(data);
      } catch (error) {
        console.error("Error al obtener el historial de pagos:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerHistorial();
  }, []);

  const renderPago = ({ item }: { item: Pago }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.pacienteId}</Text>
      <Text style={styles.cell}>${(item.amount / 100).toFixed(2)} MXN</Text>
      <Text style={[styles.cell, item.status === 'succeeded' ? styles.success : styles.failure]}>
        {item.status === 'succeeded' ? 'Exitoso' : 'Fallido'}
      </Text>
      <Text style={styles.cell}>{new Date(item.paymentDate).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de Pagos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={historial}
          keyExtractor={(item) => item.paymentId}
          renderItem={renderPago}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={styles.headerCell}>Paciente ID</Text>
              <Text style={styles.headerCell}>Monto</Text>
              <Text style={styles.headerCell}>Estado</Text>
              <Text style={styles.headerCell}>Fecha de Pago</Text>
            </View>
          }
        />
      )}
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: '#333',
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  success: {
    color: 'green',
  },
  failure: {
    color: 'red',
  },
});
