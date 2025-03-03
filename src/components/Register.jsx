import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Register.css';

const Register = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    const response = await fetch('https://backend-production-4e30.up.railway.app/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      onRegisterSuccess();
    } else {
      alert('Registration failed');
    }
  };

  return (
    <motion.form
      onSubmit={handleRegister}
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
        Registrarse
      </motion.button>
    </motion.form>
  );
};

export default Register;