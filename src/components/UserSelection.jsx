import React, { useState, useEffect } from "react";
import "./UserSelection.css";

const UserSelection = ({ onSelectUser, onClose }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://backend-production-4e30.up.railway.app/get_users");
        const json = await res.json();
        if (json.success) {
          setUsers(json.users);
        } else {
          console.error(json.message);
        }
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleSelectUser = () => {
    if (selectedUser) {
      onSelectUser(selectedUser);
    }
  };

  return (
    <div className="user-selection">
      <h2>Seleccionar Usuario</h2>
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        className="user-select"
      >
        <option value="">Seleccione un usuario</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.email}
          </option>
        ))}
      </select>
      <button onClick={handleSelectUser} className="btn">
        Ver Dashboard
      </button>
      <button onClick={onClose} className="btn">
        Cancelar
      </button>
    </div>
  );
};

export default UserSelection;