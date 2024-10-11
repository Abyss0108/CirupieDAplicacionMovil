import React, { useState } from "react";

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
  expresionRegular?: RegExp; // Hacer que sea opcional
}

const ComponenteInput: React.FC<InputProps> = ({
  estado,
  cambiarEstado,
  tipo,
  label,
  placeholder,
  name,
  leyendaError,
  expresionRegular,
}) => {
  const [val, cambiarValor] = useState<string>("d-none");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    cambiarEstado({ ...estado, campo: e.target.value });
  };

  const validacion = () => {
    if (expresionRegular) {
      if (expresionRegular.test(estado.campo)) {
        cambiarEstado({ ...estado, valido: "true" });
        cambiarValor("d-none");
      } else {
        cambiarEstado({ ...estado, valido: "false" });
        cambiarValor("d-block");
      }
    }
  };

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        <strong>{label}</strong>
      </label>
      <input
        type={tipo}
        className="form-control"
        id={name}
        placeholder={placeholder}
        value={estado.campo}
        onChange={onChange}
        onKeyUp={validacion}
        onBlur={validacion}
        onKeyPress={validacion}
        required
      />
      <div className={val}>
        <div className="text-danger">{leyendaError}</div>
      </div>
    </div>
  );
};

export default ComponenteInput;
