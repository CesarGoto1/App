import React, { useState } from "react";
import { Info } from "lucide-react";
import Introducción from "./Introducción"; // Importa el componente Introducción
import "./Results.css";

const Results = ({
  setCameraEnabled,
  cameraEnabled,
  startTest,
  gamesCompleted,
  token,
  testFinished,
  toggleCameraEnabled,
}) => {
  const [showIntroducción, setShowIntroducción] = useState(false); // Estado para mostrar la introducción

  const handleShowIntroducción = () => {
    setShowIntroducción(true);
  };

  if (showIntroducción) {
    return <Introducción onClose={() => setShowIntroducción(false)} />;
  }

  return (
    <div className="results p-4">
      <h2 className="results-title">HERRAMIENTA DE ANÁLISIS DE ATENCIÓN</h2>
      <p className="mb-4">Presione el botón para empezar</p>

      {/* Botón para abrir la introducción */}
      <button
        onClick={handleShowIntroducción}
        className="btn flex items-center space-x-2 mb-2"
      >
        <Info className="icon" />
        <span>Ver Introducción</span>
      </button>
    </div>
  );
};

export default Results;