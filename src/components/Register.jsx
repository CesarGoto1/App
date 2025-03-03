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
      body: JSON.stringify({ email: email, password }),
    });

    const data = await response.json();

    if (data.success) {
      onRegisterSuccess();
    } else {
      alert('Registration failed');
    }
  };

  return (
    <motion.div
      className="register-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.form
        onSubmit={handleRegister}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 120 }}
        className="form"
      >
        <div className="input-span">
          <label className="label" htmlFor="email">Usuario</label>
          <motion.input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Usuario"
            required
            whileFocus={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 150 }}
          />
        </div>
        <div className="input-span">
          <label className="label" htmlFor="password">Contraseña</label>
          <motion.input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            whileFocus={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 150 }}
          />
        </div>
        <motion.button
          type="submit"
          className="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          Registrarse
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default Register;