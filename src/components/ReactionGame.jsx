import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { XCircle, PlayCircle } from 'lucide-react';
import './ReactionGame.css';

const ReactionGame = ({ onClose }) => {
  const [gameState, setGameState] = useState("initial");
  const [reactionTime, setReactionTime] = useState(null);
  const timeoutRef = useRef(null);
  const startTimeRef = useRef(null);

  const startGame = () => {
    setGameState("waiting");
    const delay = Math.floor(Math.random() * 3000) + 2000;
    timeoutRef.current = setTimeout(() => {
      setGameState("ready");
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === "waiting") {
      clearTimeout(timeoutRef.current);
      setGameState("fail");
    } else if (gameState === "ready") {
      const reaction = Date.now() - startTimeRef.current;
      setReactionTime(reaction);
      setGameState("finished");
    }
  };

  return (
    <div id="game-board" onClick={handleClick}>
      {gameState === "initial" && (
        <motion.button
          className="start-button"
          onClick={(e) => {
            e.stopPropagation();
            startGame();
          }}
        >
          <PlayCircle size={24} /> Iniciar Reacción
        </motion.button>
      )}

      {gameState === "waiting" && (
        <div className="message waiting">
          <p>¡Espera la señal!</p>
        </div>
      )}

      {gameState === "ready" && (
        <div className="message ready">
          ¡AHORA! ¡Haz clic YA!
        </div>
      )}

      {gameState === "fail" && (
        <div className="message fail">
          <p>¡Demasiado pronto!</p>
          <p>Reacción cancelada.</p>
          <div className="result-container">
            <motion.button
              className="close-button"
              onClick={(e) => {
                e.stopPropagation();
                onClose && onClose();
              }}
            >
              <XCircle size={24} /> Cerrar Juego
            </motion.button>
          </div>
        </div>
      )}

      {gameState === "finished" && (
        <div className="message finished">
          <p>
            Tu tiempo de reacción es: <span className="reaction-time">{reactionTime} ms</span>
          </p>
          <div className="result-container">
            <motion.button
              className="close-button"
              onClick={(e) => {
                e.stopPropagation();
                onClose && onClose();
              }}
            >
              <XCircle size={24} /> Cerrar Juego
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionGame;