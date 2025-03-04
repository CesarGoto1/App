// MiniGames.jsx
import React, { useState, useEffect } from "react";
import "./MiniGames.css";
import ReactionGame from "./ReactionGame"; // Juego de reacción
import PointFollowGame from "./PointFollowGame"; // Juego "Seguir el punto"
import FindObjectGame from "./FindObjectGame"; // Juego "Buscar el objeto"

const MiniGames = ({ onGameStart, onGameEnd, onAllGamesComplete }) => {
  const [activeGame, setActiveGame] = useState(null); // Controla el juego activo
  const [disabledGames, setDisabledGames] = useState([]); // Juegos deshabilitados

  // Efecto que verifica si se han completado los 3 minijuegos
  useEffect(() => {
    if (disabledGames.length === 3) {
      onAllGamesComplete && onAllGamesComplete();
    }
  }, [disabledGames, onAllGamesComplete]);

  // Función para activar un juego
  const toggleGame = (game) => {
    if (disabledGames.includes(game)) return; // Si está deshabilitado, no hace nada
    setActiveGame((prev) => (prev === game ? null : game)); // Alterna mostrar/ocultar el juego
    onGameStart && onGameStart(); // Notifica que se inició un juego
  };

  // Función para cerrar un juego y deshabilitarlo
  const closeGame = (game) => {
    setActiveGame(null); // Cierra el juego
    setDisabledGames((prev) => [...prev, game]); // Deshabilita el juego
    onGameEnd && onGameEnd(); // Notifica que el juego terminó
  };

  return (
    <div className="mini-games">
      <h2>🎮 Mini Juegos</h2>

      {/* Botón para "Seguir el punto" */}
      <button
        onClick={() => toggleGame("pointFollowGame")}
        className={disabledGames.includes("pointFollowGame") ? "disabled" : ""}
        disabled={disabledGames.includes("pointFollowGame")}
      >
        {disabledGames.includes("pointFollowGame")
          ? "❌ Seguir el punto"
          : "➡️ Seguir el punto"}
      </button>
      {activeGame === "pointFollowGame" && (
        <div className="mini-games-container">
          <PointFollowGame onClose={() => closeGame("pointFollowGame")} />
        </div>
      )}

      {/* Botón para "Buscar el objeto" */}
      <button
        onClick={() => toggleGame("findObjectGame")}
        className={disabledGames.includes("findObjectGame") ? "disabled" : ""}
        disabled={disabledGames.includes("findObjectGame")}
      >
        {disabledGames.includes("findObjectGame")
          ? "❌ Buscar el objeto"
          : "🔍 Buscar el objeto"}
      </button>
      {activeGame === "findObjectGame" && (
        <div className="mini-games-container">
          <FindObjectGame onClose={() => closeGame("findObjectGame")} />
        </div>
      )}

      {/* Botón para "Reacción rápida" */}
      <button
        onClick={() => toggleGame("reactionGame")}
        className={disabledGames.includes("reactionGame") ? "disabled" : ""}
        disabled={disabledGames.includes("reactionGame")}
      >
        {disabledGames.includes("reactionGame")
          ? "❌ Reacción rápida"
          : "⚡ Reacción rápida"}
      </button>
      {activeGame === "reactionGame" && (
        <div className="mini-games-container">
          <ReactionGame onClose={() => closeGame("reactionGame")} />
        </div>
      )}
    </div>
  );
};

export default MiniGames;