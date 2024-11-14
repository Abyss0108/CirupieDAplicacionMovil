import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface InputProps {
  estado: {
    campo: string;
    valido: string | null;
  };
  cambiarEstado: React.Dispatch<React.SetStateAction<{
    campo: string;
    valido: string | null;
  }>>;
  tipo: string;
  label: string;
  placeholder: string;
  name: string;
  leyendaError: string;
  expresionRegular?: RegExp;
}

const ComponenteInput: React.FC<InputProps> = ({
  estado,
  cambiarEstado,
  tipo,
  label,
  placeholder,
  leyendaError,
  expresionRegular,
}) => {
  const validacion = (texto: string) => {
    if (expresionRegular) {
      if (expresionRegular.test(texto)) {
        cambiarEstado({ campo: texto, valido: "true" });
      } else {
        cambiarEstado({ campo: texto, valido: "false" });
      }
    } else {
      cambiarEstado({ campo: texto, valido: null });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, estado.valido === "false" && styles.errorInput]}
        placeholder={placeholder}
        value={estado.campo}
        onChangeText={(text) => validacion(text)}
        keyboardType={tipo === "tel" ? "phone-pad" : "default"}
      />
      {estado.valido === "false" && <Text style={styles.errorText}>{leyendaError}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
});

export default ComponenteInput;
