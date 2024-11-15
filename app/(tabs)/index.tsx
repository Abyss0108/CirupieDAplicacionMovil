import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Button, TouchableOpacity } from 'react-native';


export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
       {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/CirupieD.png')} style={styles.logo} />
      </View>
     
      {/* Information Section */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>SOMOS UN EQUIPO MULTIDISCIPLINARIO DE PERSONAL DE LA SALUD</Text>
        <Text style={styles.subtitle}>Conserva tus pasos, cuida tus pies</Text>

      </View>

      {/* Carousel */}
      <ScrollView horizontal pagingEnabled style={styles.carousel}>
        <Image source={require('@/assets/images/slider-1.jpg')} style={styles.carouselImage} />
        <Image source={require('@/assets/images/slider-4.jpg')} style={styles.carouselImage} />
        <Image source={require('@/assets/images/slider-5.jpg')} style={styles.carouselImage} />
      </ScrollView>


      {/* Mission and Vision Section */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Misión</Text>
          <Text style={styles.cardText}>
            Proporcionar un servicio de atención integral con la finalidad de prevenir, detectar, diagnosticar,
            tratar y rehabilitar a los pacientes con pie diabético.
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Visión</Text>
          <Text style={styles.cardText}>
            Preservar la integridad de los pacientes con pie diabético, y crear un cambio consciente en los pacientes y su entorno.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  carousel: {
    height: 200,
  },
  carouselImage: {
    width: 300,
    height: 200,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  infoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
  },
});
