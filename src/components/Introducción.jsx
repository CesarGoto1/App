import React, { useState } from 'react';
import Webcam from 'react-webcam';
import './Introducción.css';
import MiniJuegos from './MiniGames';
import PointFollowGame from './PointFollowGame';
import FindObjectGame from './FindObjectGame';
import ReactionGame from './ReactionGame';
import D2RTest from './D2RTest';
import Dashboard from './Dashboard';

const Introducción = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [reactionGameCompleted, setReactionGameCompleted] = useState(false);
  const [showD2RTest, setShowD2RTest] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleReactionGameEnd = () => {
    setReactionGameCompleted(true);
    handleNextStep();
  };

  const handleStartTest = () => {
    setShowD2RTest(true);
  };

  const handleCloseTest = () => {
    alert("El test ha finalizado. Se mostrará un dashboard con los resultados.");
    setShowD2RTest(false);
    setShowDashboard(true);
  };

  const renderContent = () => {
    if (showDashboard) {
      return <Dashboard onClose={onClose} />;
    }

    if (showD2RTest) {
      return <D2RTest endTest={handleCloseTest} />;
    }

    switch (step) {
      case 0:
        return (
          <div className="introduccion-container">
            <h1>Bienvenido a FocusWare</h1>
            <p>
              Este programa está diseñado para evaluar tu nivel de atención mediante el uso de tecnologías avanzadas de reconocimiento facial y rastreo ocular.
            </p>
            <p>
              Durante el uso del programa, la cámara recolectará datos sobre tus emociones y patrones de atención. Estos datos se utilizarán para analizar tu rendimiento y proporcionar resultados detallados.
            </p>
            <p>
              El programa consta de tres actividades interactivas y un test final. Asegúrate de completar todas las actividades para obtener una evaluación precisa.
            </p>
            <p>
              ¡Buena suerte y disfruta de la experiencia!
            </p>
            <button className="btn" onClick={handleNextStep}>Continuar</button>
          </div>
        );
      case 1:
        return (
          <div className="introduccion-container">
            <h1>Verificación de Cámara</h1>
            <p>
              A continuación, asegúrate de que tu cámara esté funcionando correctamente. Recuerda que tu video se seguirá capturando mientras realizas las actividades
            </p>
            <div className="camera-verification">
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                width="300px"
                height="300px"
                videoConstraints={{ facingMode: "user" }}
                className="camera-feed"
              />
            </div>
            <button className="btn" onClick={handleNextStep}>Continuar</button>
          </div>
        );
      case 2:
        return (
          <div className="introduccion-container">
            <h1>Instrucciones: Seguir el Punto</h1>
            <p>
              En esta actividad, deberás seguir un punto que se moverá aleatoriamente por la pantalla. Haz clic en el punto lo más rápido posible para ganar puntos.
            </p>
            <button className="btn" onClick={handleNextStep}>Comenzar</button>
          </div>
        );
      case 3:
        return (
          <div className="game-with-camera">
            <div className="camera-frame">
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                width="300px"
                height="300px"
                videoConstraints={{ facingMode: "user" }}
                className="camera-feed"
              />
            </div>
            <div className="game-frame">
              <PointFollowGame onClose={handleNextStep} />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="introduccion-container">
            <h1>Instrucciones: Buscar el Objeto</h1>
            <p>
              En esta actividad, deberás encontrar un objeto específico entre varios objetos en la pantalla. Haz clic en el objeto correcto para ganar puntos.
            </p>
            <button className="btn" onClick={handleNextStep}>Comenzar</button>
          </div>
        );
      case 5:
        return (
          <div className="game-with-camera">
            <div className="camera-frame">
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                width="300px"
                height="300px"
                videoConstraints={{ facingMode: "user" }}
                className="camera-feed"
              />
            </div>
            <div className="game-frame">
              <FindObjectGame onClose={handleNextStep} />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="introduccion-container">
            <h1>Instrucciones: Reacción Rápida</h1>
            <p>
              En esta actividad, deberás reaccionar lo más rápido posible cuando veas una señal en la pantalla. Haz clic en la señal para medir tu tiempo de reacción.
            </p>
            <button className="btn" onClick={handleNextStep}>Comenzar</button>
          </div>
        );
      case 7:
        return (
          <div className="game-with-camera">
            <div className="camera-frame">
              <Webcam
                audio={false}
                screenshotFormat="image/jpeg"
                width="300px"
                height="300px"
                videoConstraints={{ facingMode: "user" }}
                className="camera-feed"
              />
            </div>
            <div className="game-frame">
              <ReactionGame onClose={handleReactionGameEnd} />
            </div>
          </div>
        );
      case 8:
        return (
          <div className="introduccion-container">
            <h1>¡Felicidades!</h1>
            <p>Has completado todas las actividades. Ahora puedes iniciar el test final.</p>
            <button className="btn" onClick={handleStartTest} disabled={!reactionGameCompleted}>Iniciar Test</button>
          </div>
        );
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
};

export default Introducción;