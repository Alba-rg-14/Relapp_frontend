"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import MapWithMarkers from "@/components/MapWithMarkers";
import Card from "@/components/Card";

const LOG_BASE_API = process.env.NEXT_PUBLIC_LOG_API
const MAPAS_BASE_API = process.env.NEXT_PUBLIC_MAPA_API;
const IMAGE_BASE_API = process.env.NEXT_PUBLIC_IMAGE_BASE_API;
const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

export default function Pagina() {
  const { data: session, status } = useSession();
  const [entidad1, setEntidad1] = useState([]);
  const [entidad2, setEntidad2] = useState({});
  const [restaurante, setRestaurante] = useState([]);
  const router = useRouter();
  const [markers, setMarkers] = useState([]);
  // Si la sesión aún está cargando, retorna un mensaje de carga
  useEffect(() => {
    if (session) {
      fetchRestaurantes();  // Llamada solo si hay sesión
    }
  }, [session]); // Reaccionar cuando session cambie

  // Fetch entidad principal
  const fetchRestaurantes = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_BASE_API}/restaurantes/todos`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const restaurantesData = response.data;
      setRestaurante(restaurantesData);

      // Extraer las coordenadas para los marcadores
      const markersData = restaurantesData.map((r) => ({
        lat: r.latitud,
        lon: r.longitud,
        nombre: r.nombre,
      }));
      setMarkers(markersData); // Guardar los marcadores en el estado
    } catch (error) {
      console.error("Error al obtener los restaurantes:", error);
    }
  }, [session]);

  const navigateAddRestaurant = () => {
    // Redirige a la página de añadir restaurante
    router.push("/add-restaurant");
  };

  useEffect(() => {
    if (session) {
      fetchRestaurantes();
    }
  }, [session, fetchRestaurantes]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_BASE_API}/restaurantes/eliminar/${id}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      alert("Restaurante eliminado correctamente");
      fetchRestaurantes();
    }
    catch (error) {
      console.error("Error al eliminar el restaurante:", error);
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex flex-1 p-4">
        {/* Sección izquierda */}
        <div className="left-section flex-1 bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl flex flex-col justify-center items-center text-center p-8 shadow-lg">
          <h1 className="text-5xl font-bold text-blue-800 mb-4 font-poppins">
            Estos son todos los restaurantes que habeis guardado
          </h1>
          <p className="text-xl text-gray-700 italic font-poppins">
            Me encanta comer</p>
          <div className="mt-8 flex space-x-4 text-2xl">
            <span>Sobre todo a mi novio</span>
          </div>
          <div className="mt-8 w-full">
            {/* Mapa con los marcadores */}
            <MapWithMarkers markers={markers} defaultZoom={5} />
          </div>
          <div>
            <Button
              className="mt-8"
              onClick={() => {
                navigateAddRestaurant();
              }}
            >
              Añadir un nuevo restaurante
            </Button>
          </div>
        </div>

        {/* Sección derecha */}
        <div className="right-section flex-1 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-center items-center text-center">
          <div className="space-y-6">
            {/* Mostrar las entidades 1 */}
            {restaurante.map((r) => (
              <Card
                key={r._id}
                title={r.nombre}
                subtitle={r.direccion}
                image={r.imagenURL}
                onDetailsClick={() => router.push(`/detalles/${r._id}`)} // Lógica para el botón "Ver detalles"
                actions={[
                  {
                    label: "Editar",
                    onClick: () => console.log("Editar", r._id),
                  },
                  {
                    label: "Eliminar",
                    onClick: () => handleDelete(r._id),
                  },
                ]}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}