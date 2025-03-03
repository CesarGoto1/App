import React, { useState } from "react";
import { Camera, Eye, EyeOff, PlayCircle, BarChart2 } from "lucide-react";
import Webcam from "react-webcam";
import Dashboard from "./Dashboard"; // Importa el componente Dashboard
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
  const [showDashboard, setShowDashboard] = useState(false);

  // El botón "Iniciar Test" se activa si los minijuegos han finalizado y el test aún no se completó.
  const isIniciarTestEnabled = gamesCompleted && !testFinished;
  // El botón "Visualizar Resultados" se activa solo si el test D2R ha finalizado.
  const isVisualizarResultadosEnabled = testFinished;

  const toggleCamera = () => {
    setCameraEnabled((prev) => !prev);
  };

  const handleShowDashboard = () => {
    setShowDashboard(true);
  };

  if (showDashboard) {
    return <Dashboard token={token} onClose={() => setShowDashboard(false)} />;
  }

  return (
    <div className="results">
      <h2>HERRAMIENTA DE ANÁLISIS DE ATENCIÓN</h2>
      {cameraEnabled ? null : (
        <p>
          Para acceder a las actividades, primero debes activar la cámara.
        </p>
      )}

      {/* Botón para visualizar resultados */}
      <button
        disabled={!isVisualizarResultadosEnabled}
        onClick={handleShowDashboard}
      >
        <BarChart2 className="icon" />
        <span>Visualizar Resultados</span>
      </button>

      {/* Botón para activar/desactivar la cámara */}
      <button
        disabled={!toggleCameraEnabled}
        onClick={toggleCamera}
      >
        {cameraEnabled ? <EyeOff className="icon" /> : <Eye className="icon" />}
        <span>{cameraEnabled ? "Desactivar Cámara" : "Activar Cámara"}</span>
      </button>

      {/* Botón para iniciar el test */}
      <button
        disabled={!isIniciarTestEnabled}
        onClick={startTest}
      >
        <PlayCircle className="icon" />
        <span>Iniciar Test</span>
      </button>

      {/* Cámara en vivo */}
      {cameraEnabled && (
        <div className="camera-container mt-4">
          <p className="camera-status mb-2">📷 La cámara está activada.</p>
          <Webcam
            audio={false}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{ facingMode: "user" }}
            className="camera-feed rounded shadow"
          />
        </div>
      )}
    </div>
  );
};

export default Results;