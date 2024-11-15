import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

interface Feedback {
  id: number;
  calificacion: number;
  fecha: string;
  comentario: string;
}

export default function FeedbackView() {
  const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
  const [ratingCounts, setRatingCounts] = useState<{ [key: number]: number }>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('https://rest-api2-three.vercel.app/api/obtener_feedback');
      const data: Feedback[] = await response.json();
      setFeedbackData(data);

      const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      data.forEach((feedback: Feedback) => {
        const calificacionKey = feedback.calificacion as keyof typeof counts;
        counts[calificacionKey] = (counts[calificacionKey] || 0) + 1;
      });
      setRatingCounts(counts);
    } catch (error) {
      console.error('Error al obtener feedback:', error);
    }
  };

  const barChartData = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        data: [ratingCounts[1] || 0, ratingCounts[2] || 0, ratingCounts[3] || 0, ratingCounts[4] || 0, ratingCounts[5] || 0],
      },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resumen de Feedback</Text>
      <BarChart
        data={barChartData}
        width={Dimensions.get('window').width * 0.9}
        height={220}
        fromZero={true}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#f2f2f2',
          backgroundGradientTo: '#f2f2f2',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={styles.chart}
      />
      <View style={styles.commentsContainer}>
        <Text style={styles.subtitle}>Comentarios</Text>
        {feedbackData.map((feedback: Feedback) => (
          <View key={feedback.id} style={styles.comment}>
            <Text style={styles.commentText}>
              <Text style={styles.commentBold}>Calificación:</Text> {feedback.calificacion} - <Text>{feedback.fecha}</Text>
            </Text>
            <Text>{feedback.comentario}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  commentsContainer: {
    marginTop: 30,
    width: '100%',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  comment: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commentText: {
    fontSize: 16,
    marginBottom: 4,
  },
  commentBold: {
    fontWeight: 'bold',
  },
});
