import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validación del usuario adminFocusWare
    if (email === 'adminFocusWare' && password === 'adminfocusware123') {
      onLoginSuccess('admin-token', 'adminFocusWare');
      return;
    }

    const response = await fetch('https://backend-production-4e30.up.railway.app/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("userId", data.user_id);
      onLoginSuccess(data.token, data.user_id);
    } else {
      alert('Login failed');
    }
  };

  return (
    <motion.form
      onSubmit={handleLogin}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="flip-card__form"
    >
      <motion.input
        type="text"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Usuario"
        required
        className="flip-card__input"
        whileFocus={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 150 }}
      />
      <motion.input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
        className="flip-card__input"
        whileFocus={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 150 }}
      />
      <motion.button
        type="submit"
        className="flip-card__btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        Iniciar Sesión
      </motion.button>
    </motion.form>
  );
};

export default Login;