import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaInfoCircle, FaPlay, FaHourglassHalf } from 'react-icons/fa';
import './D2RTest.css';

const D2RTest = ({ startTest, endTest }) => {
    const [isInstructionsVisible, setIsInstructionsVisible] = useState(true);
    const [isTestStarted, setIsTestStarted] = useState(false);
    const [lettersGrid, setLettersGrid] = useState([]);
    const [score, setScore] = useState(0);
    const [isResultsVisible, setIsResultsVisible] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false); // Nuevo estado para el mensaje de agradecimiento
    const [currentRow, setCurrentRow] = useState(0);
    const [timeLeft, setTimeLeft] = useState(20);
    const [rowTimer, setRowTimer] = useState(null);
    const [gridDimensions] = useState({ rows: 14, cols: 57 });

    const generateGrid = () => {
        const { rows, cols } = gridDimensions;
        const totalElements = rows * cols;
        const correctCount = Math.floor(totalElements / 2.22);
        const correctIndices = new Set();

        while (correctIndices.size < correctCount) {
            correctIndices.add(Math.floor(Math.random() * totalElements));
        }

        const grid = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const index = i * cols + j;
                grid.push({
                    value: correctIndices.has(index) ? "d''" : Math.random() > 0.5 ? "d'" : 'd',
                    isCorrect: correctIndices.has(index),
                    clicked: false,
                    row: i,
                    col: j
                });
            }
        }

        setLettersGrid(grid);
    };

    // Función para iniciar el temporizador de la fila actual
    const startRowTimer = () => {
        // Clear any existing timer before starting a new one
        if (rowTimer) {
            clearInterval(rowTimer);
        }
        
        setTimeLeft(20);
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    moveToNextRow();
                    return 20;
                }
                return prevTime - 1;
            });
        }, 1000);
        
        setRowTimer(timer);
        return timer;
    };

    // Función para avanzar a la siguiente fila
    const moveToNextRow = () => {
        const nextRow = currentRow + 1;
        
        if (nextRow >= gridDimensions.rows) {
            // Si es la última fila, finalizar el test
            handleEndTest();
        } else {
            setCurrentRow(nextRow);
            // No iniciar aquí el temporizador para evitar problemas de sincronización
        }
    };

    // Use effect para iniciar el temporizador cuando cambia la fila actual
    useEffect(() => {
        if (isTestStarted && !isResultsVisible) {
            const timer = startRowTimer();
            return () => clearInterval(timer);
        }
    }, [currentRow, isTestStarted, isResultsVisible]);

    // Manejo del clic en una letra
    const handleLetterClick = (index) => {
        const clickedCell = lettersGrid[index];
        
        // Solo permitir clic si la celda está en la fila actual y no ha sido clickeada
        if (clickedCell.row === currentRow && !clickedCell.clicked) {
            const updatedGrid = [...lettersGrid];
            updatedGrid[index].clicked = true;
            setLettersGrid(updatedGrid);

            if (updatedGrid[index].isCorrect) {
                setScore(prev => prev + 1);
                updatedGrid[index].className = 'selected-correct';
            } else {
                updatedGrid[index].className = 'selected-incorrect';
            }
        }
    };

    // Iniciar el test
    const handleStartTest = () => {
        generateGrid();
        setIsTestStarted(true);
        setCurrentRow(0);
        setScore(0);
        // El temporizador se iniciará automáticamente por el useEffect
    };

    // Finalizar el test
    const handleEndTest = () => {
        if (rowTimer) {
            clearInterval(rowTimer);
            setRowTimer(null);
        }
        setIsTestStarted(false);
        setIsResultsVisible(true);
    };

    // Efecto para limpiar temporizadores cuando el componente se desmonte
    useEffect(() => {
        return () => {
            if (rowTimer) {
                clearInterval(rowTimer);
            }
        };
    }, [rowTimer]);

    const getLevel = (score) => {
        if (score >= 123) return 'Alto';
        if (score >= 108) return 'Medio alto';
        if (score >= 93) return 'Medio';
        if (score >= 78) return 'Medio bajo';
        return 'Bajo';
    };

    const getInterpretations = (score) => {
        const level = getLevel(score);
        return {
            level,
            concentration: score >= 93 ? 'Buena capacidad para mantener la concentración' : 'Problemas para mantener la concentración',
            speed: score >= 93 ? 'Buena velocidad de procesamiento' : 'Procesamiento lento',
            precision: score >= 93 ? 'Persona fue precisa' : 'Gran proporción de errores',
        };
    };

    const interpretations = getInterpretations(score);

    // Determinar si una celda está activa (en la fila actual)
    const isCellActive = (cellRow) => cellRow === currentRow;

    const isCellLocked = (cellRow) => cellRow < currentRow;

    const handleCloseTest = () => {
        setIsResultsVisible(false);
        setShowThankYou(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("userId"); // Eliminar el user_id del localStorage
        window.location.href = "/login"; // Redirigir a la página de inicio de sesión
    };

    return (
        <div>
            {isInstructionsVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="instructions-container"
                >
                    <h2>
                        <FaInfoCircle /> Instrucciones
                    </h2>
                    <p>
                        Este test consiste en identificar las letras <strong>d''</strong> en un
                        conjunto de estímulos. Haz clic únicamente en las <strong>d''</strong> para
                        obtener puntos.
                    </p>
                    <p>
                        <strong>¡Atención!</strong> Tendrás 20 segundos para cada fila. Después de ese tiempo,
                        pasarás automáticamente a la siguiente fila.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsInstructionsVisible(false)}
                    >
                        <FaPlay /> Continuar
                    </motion.button>
                </motion.div>
            )}

            {!isInstructionsVisible && !isTestStarted && !isResultsVisible && !showThankYou && (
                <motion.div className="start-screen">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleStartTest}
                    >
                        <FaPlay /> Iniciar Test
                    </motion.button>
                </motion.div>
            )}

            {isTestStarted && (
                <>
                    <div className="timer-container">
                        <FaHourglassHalf /> Tiempo restante: {timeLeft} segundos
                        <div className="row-indicator">Fila actual: {currentRow + 1} de {gridDimensions.rows}</div>
                    </div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="letters-grid"
                    >
                        {lettersGrid.map((cell, index) => (
                            <motion.div
                                key={index}
                                className={`letter 
                                    ${cell.clicked && cell.isCorrect ? 'correct' : ''} 
                                    ${isCellActive(cell.row) ? 'active' : ''}
                                    ${isCellLocked(cell.row) ? 'locked' : ''}
                                    ${cell.className || ''}`}
                                onClick={() => handleLetterClick(index)}
                            >
                                {cell.value}
                            </motion.div>
                        ))}
                    </motion.div>
                </>
            )}

            {isResultsVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="results-modal"
                >
                    <h2>Resultados del Test</h2>
                    <p><strong>Puntuación:</strong> {score}</p>
                    <p><strong>Nivel:</strong> {interpretations.level}</p>
                    <p><strong>Concentración:</strong> {interpretations.concentration}</p>
                    <p><strong>Velocidad de Trabajo:</strong> {interpretations.speed}</p>
                    <p><strong>Precisión:</strong> {interpretations.precision}</p>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCloseTest}
                    >
                        Cerrar Test
                    </motion.button>
                </motion.div>
            )}

            {showThankYou && (
                <div className="dashboard-container">
                    <h1>Gracias por usar FocusWare</h1>
                    <p>¡Hasta la próxima!</p>
                    <button onClick={handleLogout} className="close-button">
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
};

export default D2RTest;