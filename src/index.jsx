import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { motion } from 'framer-motion';
import './index.css';
import App from './App';
import Login from './components/Login';
import Register from './components/Register';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    localStorage.removeItem('token');
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  const handleLoginSuccess = (token) => {
    setToken(token);
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = () => {
    alert('Registro exitoso. Ahora puedes iniciar sesión.');
    setShowRegister(false);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="main-container">
      <motion.h1
        className="app-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        FocusWare
      </motion.h1>

      {isAuthenticated ? (
        <App onLogout={handleLogout} />
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
                <div className="flip-card__inner">
                  <div className="flip-card__front" onClick={() => setShowRegister(false)}>
                    <div className="title">Iniciar sesión</div>
                    <Login onLoginSuccess={handleLoginSuccess} />
                  </div>
                  <div className="flip-card__back" onClick={() => setShowRegister(true)}>
                    <div className="title">Registrarse</div>
                    <Register onRegisterSuccess={handleRegisterSuccess} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

root.render(
  <React.StrictMode>
    <Index />
  </React.StrictMode>
);

reportWebVitals();