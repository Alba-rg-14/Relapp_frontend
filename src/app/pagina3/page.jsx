"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { TextField, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";
import MapWithMarkers from "@/components/MapWithMarkers";

const MAPAS_BASE_API = process.env.NEXT_PUBLIC_MAPA_API;
const IMAGE_BASE_API = process.env.NEXT_PUBLIC_IMAGE_BASE_API;
const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;
const LOG_BASE_API = process.env.NEXT_PUBLIC_LOG_API

export default function Home() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [restaurante, setRestaurante] = useState([]);
  const [campoFiltro, setCampoFiltro] = useState("");
  const [markers, setMarkers] = useState([]); // Marcadores del mapa

  // No usar condicionales en hooks, siempre deben ejecutarse
  useEffect(() => {
    if (status === "loading") return; // Evitar que la app intente hacer algo si la sesión aún se está cargando.
  }, [status]);


  const fetchRestaurantes = async (campoFiltro) => {
    setLoading(true);
    console.log("Filtro enviado al backend:", campoFiltro); // Verifica qué se envía
    try {
      const response = await axios.get(`${BACKEND_BASE_API}/restaurantes/nombre/${campoFiltro}`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      setRestaurante(response.data);
      // Generar marcadores para el mapa
      const nuevosMarkers = response.data.map((r1) => ({
        lat: r1.latitud,
        lon: r1.longitud,
        nombre: r1.nombre,
      }));
      setMarkers(nuevosMarkers);
    } catch (error) {
      console.error("Error al obtener las entidades:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex flex-1 p-4">
        {/* Sección izquierda: Filtro y mapa */}
        <div className="left-section flex-1 flex flex-col bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl p-8 shadow-lg">
          {/* Filtro */}
          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-5xl font-bold text-blue-800 mb-4 font-poppins">
              🌍 ¡Filtrado con mapa! 🌍
            </h1>
            <p className="text-xl text-gray-700 italic font-poppins">
              Puedes filtrar las entidades principales (que tienen coordenadas) con un campo y te aparecerá un mapa
            </p>
            <div className="mt-8 flex space-x-4 text-2xl">
              <input
                type="text"
                value={campoFiltro}
                onChange={(e) => setCampoFiltro(e.target.value)}
                placeholder="Nombre del restaurante"
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
              <Button onClick={() => fetchRestaurantes(campoFiltro)}>Filtrar</Button>
            </div>

          </div>

          {/* Mapa */}
          <div className="mt-8 flex justify-center w-full">
            <MapWithMarkers
              markers={restaurante.map((r1) => ({
                lat: r1.latitud,
                lon: r1.longitud,
                nombre: r1.nombre,
              }))}
              defaultCenter={[40.416775, -3.703790]} // Centro inicial (Madrid, España)
              defaultZoom={5} // Zoom inicial
            />
          </div>

        </div>

        {/* Sección derecha: Lista de entidades */}
        <div className="right-section flex-1 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-center items-center text-center">
          {loading ? (
            <p>Cargando datos...</p>
          ) : (
            <div className="space-y-6">
              {/* Mostrar las entidades 1 */}
              {restaurante.length === 0 ? (
                <p>No se encontraron entidades principales con ese filtro.</p>
              ) : (
                restaurante.map((r1) => (
                  <div key={r1._id} className="bg-gray-200 p-4 rounded-lg shadow-md">
                    <h3 className="text-2xl font-bold">Nombre: {r1.nombre}</h3>
                    <p className="text-lg font-semibold">Dirección: {r1.direccion}</p>
                    <p className="text-lg font-semibold">Descripción: {r1.descripcion}</p>

                    <p className="text-lg font-semibold">Horario: {r1.horario}</p>

                    <div className="mt-4">
                      <h4 className="text-xl font-medium">Foto:</h4>
                      {r1.imagenURL && r1.imagenURL.trim() ? (
                        <div>
                          <img
                            src={r1.imagenURL}
                            alt={`Imagen de ${r1.nombre}`}
                            className="w-32 h-32 object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <p style={{ marginTop: "20px" }}>No hay imagen subida.</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
