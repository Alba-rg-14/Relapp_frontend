"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { TextField, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";

const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

export default function PaginaLogs() {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState([]);

  // Si la sesión aún está cargando, retorna un mensaje de carga
  if (status === "loading") {
    return <p>Cargando...</p>;
  }

  // Fetch logs, solo cuando session esté disponible
  const fetchLogs = async () => {
    if (!session?.accessToken) return; // Si no hay token, no hacer la solicitud

    try {
      const response = await axios.get(`${BACKEND_BASE_API}/log`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setLogs(response.data);
    } catch (error) {
      console.error("Error al obtener los logs:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchLogs(); // Llamar a fetchLogs solo cuando la sesión esté disponible
    }
  }, [session]); // Ejecutar este efecto solo cuando la sesión cambie

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex flex-1 p-4">
        {/* Sección izquierda */}
        <div className="left-section flex-1 bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl flex flex-col justify-center items-center text-center p-8 shadow-lg">
          <h1 className="text-5xl font-bold text-blue-800 mb-4 font-poppins">
            📝🔍 ¡Mostrar Logs del Sistema! 🔍📝
          </h1>
          <p className="text-xl text-gray-700 italic font-poppins">
            Visualiza los registros de la aplicación
          </p>
          <div className="mt-8 flex space-x-4 text-2xl">
            <span>En realidad, es un listado simple de una entidad simple</span>
          </div>
        </div>

        {/* Sección derecha */}
        <div className="right-section flex-1 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-center items-center text-center">
          <div className="space-y-6">
            {/* Mostrar los logs */}
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-md">
                  <h3 className="text-2xl font-bold">Log ID: {log._id}</h3>
                  <p className="text-lg text-gray-700">Timestamp: {new Date(log.timestamp).toLocaleString()}</p>
                  <p className="text-lg text-gray-700">Email: {log.email}</p>
                  <p className="text-lg text-gray-700">Token Expiry: {new Date(log.tokenExpiry).toLocaleString()}</p>
                  <p className="text-lg text-gray-700">Token: {log.token}</p>
                </div>
              ))
            ) : (
              <div className="mt-4 text-xl font-semibold text-gray-600">
                No hay logs para mostrar.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
