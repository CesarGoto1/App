import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = ({ userId, onClose }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(`https://backend-production-4e30.up.railway.app/get_results?user_id=${userId}`);
        const json = await res.json();
        if (json.success) {
          setData(json);
        } else {
          setError(json.message);
        }
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };

    fetchResults();
  }, [userId]);

  if (loading) {
    return <div className="p-4">Cargando resultados...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="text-3xl font-bold mb-6">Dashboard de Resultados</h2>
      
      {/* Mostrar el nombre del usuario */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Usuario: {data.email}</h3>
      </div>
      
      {/* Contenedor de datos en horizontal */}
      <div className="data-container">
        {/* Datos de la Sesión */}
        <div className="data-section">
          <h3 className="text-2xl font-semibold mb-2">Datos de la Sesión</h3>
          {data.sessionData ? (
            <div className="div-datos">
              <p><strong>ID:</strong> {data.sessionData.id}</p>
              <p><strong>Fecha:</strong> {data.sessionData.session_date}</p>
              <p><strong>Atención Promedio:</strong> {data.sessionData.avg_attention}</p>
              <p><strong>Gaze X Promedio:</strong> {data.sessionData.avg_gaze_x}</p>
              <p><strong>Gaze Y Promedio:</strong> {data.sessionData.avg_gaze_y}</p>
            </div>
          ) : (
            <p>No hay datos de sesión disponibles.</p>
          )}
        </div>
        
        {/* Datos Referenciales */}
        <div className="data-section">
          <h3 className="text-2xl font-semibold mb-2">Datos Referenciales</h3>
          {data.referenceData ? (
            <div className="div-datos">
              <p><strong>ID:</strong> {data.referenceData.id}</p>
              <p><strong>Fecha:</strong> {data.referenceData.computed_date}</p>
              <p><strong>Atención Promedio:</strong> {data.referenceData.avg_attention}</p>
              <p><strong>Gaze X Promedio:</strong> {data.referenceData.avg_gaze_x}</p>
              <p><strong>Gaze Y Promedio:</strong> {data.referenceData.avg_gaze_y}</p>
            </div>
          ) : (
            <p>No hay datos referenciales disponibles.</p>
          )}
        </div>
        
        {/* Datos Comparativos */}
        <div className="data-section">
          <h3 className="text-2xl font-semibold mb-2">Datos Comparativos</h3>
          {data.comparativeData ? (
            <div className="div-datos">
              <p><strong>ID:</strong> {data.comparativeData.id}</p>
              <p><strong>Fecha de Comparación:</strong> {data.comparativeData.comparison_date}</p>
              <p><strong>Diferencia de Atención:</strong> {data.comparativeData.diff_attention}</p>
              <p><strong>Diferencia de Gaze X:</strong> {data.comparativeData.diff_gaze_x}</p>
              <p><strong>Diferencia de Gaze Y:</strong> {data.comparativeData.diff_gaze_y}</p>
            </div>
          ) : (
            <p>No hay datos comparativos disponibles.</p>
          )}
        </div>
      </div>
      
      <button onClick={onClose} className="close-button">
        Cerrar Dashboard
      </button>
    </div>
  );
};

export default Dashboard;