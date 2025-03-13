import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import './Introducción.css';
import MiniJuegos from './MiniGames';
import PointFollowGame from './PointFollowGame';
import FindObjectGame from './FindObjectGame';
import ReactionGame from './ReactionGame';
import D2RTest from './D2RTest';

/* global GazeRecorderAPI, CY */

const Introducción = ({ onClose, showThankYou }) => {
  const [step, setStep] = useState(0);
  const [reactionGameCompleted, setReactionGameCompleted] = useState(false);
  const [showD2RTest, setShowD2RTest] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [sessionData, setSessionData] = useState({ morphcast: [], gazeRecorder: [] });
  const [stopMorphcastFn, setStopMorphcastFn] = useState(null);
  const stopGazeRecorderFn = useRef(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(Number(storedUserId));
    }
  }, []);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleReactionGameEnd = () => {
    setReactionGameCompleted(true);
    handleNextStep();
  };

  const saveSessionData = () => {
    if (!userId) {
      console.error("No se encontró userId, no se pueden guardar los datos de sesión");
      return;
    }
    if (!sessionData.morphcast.length && !sessionData.gazeRecorder.length) return;

    const payload = {
      user_id: userId,
      timestamp: new Date().toISOString(),
      session_data: sessionData,
    };

    // Llamada al backend
    fetch("https://backend-production-4e30.up.railway.app/save_session_data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos guardados:", data);
      })
      .catch((error) => console.error("Error:", error));
  };

  const startMorphcast = async () => {
    const scriptLoader = (src, config = null) =>
      new Promise((resolve) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.onload = resolve;
        if (config) script.setAttribute("data-config", config);
        script.src = src;
        document.head.appendChild(script);
      });

    await scriptLoader("https://sdk.morphcast.com/mphtools/v1.1/mphtools.js", "compatibilityUI, compatibilityAutoCheck");
    await scriptLoader("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");

    const loader = CY.loader();
    loader
      .licenseKey("sk37a377d84be2f65ba7e25230e108043c5b34ee038f7d")
      .addModule(CY.modules().FACE_ATTENTION.name, { smoothness: 0.83 })
      .addModule(CY.modules().DATA_AGGREGATOR.name, { initialWaitMs: 2000, periodMs: 1000 });

    const { start, stop } = await loader.load();
    start();

    const handleMorphcastData = (e) => {
      setSessionData((prevData) => ({
        ...prevData,
        morphcast: [...prevData.morphcast, { timestamp: new Date().toISOString(), data: e.detail }],
      }));
    };

    window.addEventListener(CY.modules().DATA_AGGREGATOR.eventName, handleMorphcastData);
    
    return () => {
      stop();
      window.removeEventListener(CY.modules().DATA_AGGREGATOR.eventName, handleMorphcastData);
    };
  };

  const startGazeRecorder = () => {
    const script = document.createElement("script");
    script.src = "https://app.gazerecorder.com/GazeRecorderAPI.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      GazeRecorderAPI.Rec();
    };

    script.onerror = () => console.error("Error al cargar GazeRecorder");

    return () => {
      GazeRecorderAPI.StopRec();
      const gazeData = GazeRecorderAPI.GetRecData();
      setSessionData((prevData) => ({
        ...prevData,
        gazeRecorder: [...prevData.gazeRecorder, { timestamp: new Date().toISOString(), data: gazeData }],
      }));
    };
  };

  useEffect(() => {
    if (cameraEnabled) {
      startMorphcast().then((stop) => setStopMorphcastFn(() => stop));
      stopGazeRecorderFn.current = startGazeRecorder();
    } else {
      if (stopMorphcastFn) stopMorphcastFn();
      if (stopGazeRecorderFn.current) stopGazeRecorderFn.current();
      saveSessionData();
      setSessionData({ morphcast: [], gazeRecorder: [] });
    }
  }, [cameraEnabled]);

  const handleStartTest = () => {
    setShowD2RTest(true);
  };

  const handleCloseTest = () => {
    showThankYou(true);
  };

  useEffect(() => {
    if (step >= 2 && step <= 7) {
      setCameraEnabled(true);
    } else {
      setCameraEnabled(false);
    }
  }, [step]);

  const renderContent = () => {
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
              En esta actividad, deberás reaccionar lo más rápido posible a los estímulos que aparezcan en la pantalla. Haz clic en los estímulos para ganar puntos.
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
            <h1>Test D2R</h1>
            <p>
              Ahora que has completado todas las actividades, es hora de realizar el test D2R.
            </p>
            <button className="btn" onClick={handleStartTest}>Ver Instrucciones</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="introduccion">
      {renderContent()}
    </div>
  );
};

export default Introducción;