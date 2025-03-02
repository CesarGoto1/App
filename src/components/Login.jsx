import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        console.log("Intentando iniciar sesión con:", email, password); // Debug

        if (!email.trim() || !password.trim()) {
            alert("Por favor, llena todos los campos");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password.trim(),
                }),
            });

            const data = await response.json();
            console.log("Respuesta del backend:", data); // Debug

            if (response.ok) {
                alert("Inicio de sesión exitoso");
                localStorage.setItem("userId", data.userId); // Guardar el ID del usuario en localStorage
                onLoginSuccess();
            } else {
                alert(`Error: ${data.error || "Inicio de sesión fallido"}`);
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Error de conexión con el servidor");
        }
    };

    return (
        <motion.div
            className="login-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.form
                onSubmit={handleLogin}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 120 }}
                className="login-form"
            >
                <motion.input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Correo electrónico"
                    required
                    className="input-field"
                    whileFocus={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 150 }}
                />
                <motion.input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                    className="input-field"
                    whileFocus={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 150 }}
                />
                <motion.button
                    type="submit"
                    className="login-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    Iniciar Sesión
                </motion.button>
            </motion.form>
        </motion.div>
    );
};

export default Login;
