import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { motion } from 'framer-motion';
import './index.css';
import App from './App';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import UserSelection from './components/UserSelection';
import PantallaBienvenida from './components/PantallaBienvenida';
import Results from './components/Results'; // Importa el componente Results
import reportWebVitals from './reportWebVitals';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [showRegister, setShowRegister] = useState(false);
  const [isTitleHidden, setIsTitleHidden] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null); // Estado para controlar el usuario seleccionado
  const [showWelcomeScreen, setShowWelcomeScreen] = useState(false); // Estado para controlar la pantalla de bienvenida
  const [showResults, setShowResults] = useState(false); // Estado para controlar la pantalla de resultados

  useEffect(() => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsTitleHidden(true);
      } else {
        setIsTitleHidden(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLoginSuccess = (token, userId) => {
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setIsAuthenticated(true);
  
    // Verifica si el usuario es admin
    if (userId === 'adminFocusWare') {
      setSelectedUserId(null); // Asegúrate de mostrar la selección de usuario
    } else {
      setSelectedUserId(userId); // Redirige directamente al Dashboard del usuario
      setShowWelcomeScreen(true); // Muestra la pantalla de bienvenida
    }
  };

  const handleRegisterSuccess = () => {
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    setShowRegister(false);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setSelectedUserId(null); // Asegúrate de ocultar la selección de usuario al cerrar sesión
    setShowWelcomeScreen(false); // Asegúrate de ocultar la pantalla de bienvenida
    setShowResults(false); // Asegúrate de ocultar la pantalla de resultados
  };

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
    setShowDashboard(true);
  };

  const handleCloseDashboard = () => {
    setShowDashboard(false);
    setSelectedUserId(null); // Asegúrate de mostrar la selección de usuario
  };

  const handleCloseUserSelection = () => {
    setIsAuthenticated(false); // Regresar al login
    setSelectedUserId(null); // Asegúrate de ocultar la selección de usuario
  };

  const handleFinishWelcomeScreen = () => {
    setShowWelcomeScreen(false);
    setShowResults(true); // Muestra la pantalla de resultados
  };

  return (
    <div className="main-container">
      <motion.h1
        className={`app-title ${isTitleHidden ? 'hidden' : ''}`}
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        FocusWare
      </motion.h1>

      {isAuthenticated ? (
        showDashboard ? (
          <Dashboard userId={selectedUserId} onClose={handleCloseDashboard} />
        ) : showWelcomeScreen ? (
          <PantallaBienvenida onFinish={handleFinishWelcomeScreen} />
        ) : showResults ? (
          <Results />
        ) : (
          <UserSelection onSelectUser={handleSelectUser} onClose={handleCloseUserSelection} />
        )
      ) : (
        <div className="auth-container">
          <motion.div
            className="auth-form-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="wrapper">
              <div className="card-switch">
                <label className="switch">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={showRegister}
                    onChange={() => setShowRegister(!showRegister)}
                  />
                  <span className="slider"></span>
                  <span className="card-side"></span>
                  <div className="flip-card__inner">
                    <div className="flip-card__front">
                      <div className="title">Iniciar sesión</div>
                      <Login onLoginSuccess={handleLoginSuccess} />
                    </div>
                    <div className="flip-card__back">
                      <div className="title">Registrarse</div>
                      <Register onRegisterSuccess={handleRegisterSuccess} />
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Index />);

reportWebVitals();