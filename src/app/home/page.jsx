"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { TextField, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";
import { useRouter } from "next/navigation";

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

      // Fetch entidades hijas
      //const fetchPromises = restaurantesData.map((e1) => fetchEntidad2(e1.algunCampoEntidad1));
      //await Promise.all(fetchPromises);
    } catch (error) {
      console.error("Error al obtener las entidades:", error);
    }
  }, [session]);


  const navigateAddRestaurant = () => {
    // Redirige a la página de añadir restaurante
    router.push("/add-restaurant");
  };

  // Fetch entidad hija
  // const fetchEntidad2 = useCallback(async (algunCampoEntidad1) => {
  //   try {
  //     const response = await axios.get(`${BACKEND_BASE_API}/entidad2/${algunCampoEntidad1}`, {
  //       headers: {
  //         Authorization: `Bearer ${session.accessToken}`,
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     setEntidad2((prevEntidad2) => ({
  //       ...prevEntidad2,
  //       [algunCampoEntidad1]: response.data,
  //     }));
  //   } catch (error) {
  //     console.error(`Error al obtener las entidades para ${algunCampoEntidad1}:`, error);
  //   }
  // }, [session]);

  useEffect(() => {
    if (session) {
      fetchRestaurantes();
    }
  }, [session, fetchRestaurantes]);

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
            {restaurante.map((r1) => (
              <div key={r1._id} className="bg-gray-200 p-4 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold">Nombre: {r1.nombre}</h3>
                <p className="text-lg font-semibold">Dirección: {r1.direccion}</p>
                <p className="text-lg font-semibold">Descripción: {r1.descripcion}</p>

                <p className="text-lg font-semibold">Horario: {r1.horario}</p>

                <div className="mt-4">
                  <h4 className="text-xl font-medium">Foto:</h4>
                  <img
                    src={r1.imagenURL} // Asegúrate de que este campo contiene la URL correcta
                    alt={`Imagen de ${r1.nombre}`}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}