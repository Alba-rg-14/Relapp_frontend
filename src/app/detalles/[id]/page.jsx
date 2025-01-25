"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import MapWithMarkers from "@/components/MapWithMarkers";

const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

export default function Detalles() {
    const params = useParams();
    const router = useRouter(); // Para manejar la navegación
    const { id } = params;
    const [restaurante, setRestaurante] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchRestaurante = async () => {
            try {
                const response = await axios.get(`${BACKEND_BASE_API}/restaurantes/${id}`);
                setRestaurante(response.data);
            } catch (error) {
                console.error("Error al obtener los detalles del restaurante:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurante();
    }, [id]);

    if (loading) return <p className="text-center text-xl mt-10 text-pink-500">Cargando...</p>;

    if (!restaurante) return <p className="text-center text-xl mt-10 text-pink-500">No se encontró el restaurante.</p>;

    return (
        <div className="min-h-screen bg-pink-50 p-6 relative">
            {/* Botón para volver */}
            <button
                onClick={() => router.push("/home")}
                className="absolute top-4 left-4 w-12 h-12 bg-pink-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-pink-700 transition"
                title="Volver"
            >
                ←
            </button>

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <h1 className="text-4xl font-extrabold text-pink-600 mb-6">{restaurante.nombre}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información del restaurante */}
                    <div className="space-y-4">
                        <div>
                            <span className="text-lg font-semibold text-pink-600">Dirección:</span>
                            <p className="text-gray-700">{restaurante.direccion}</p>
                        </div>

                        <div>
                            <span className="text-lg font-semibold text-pink-600">Teléfono:</span>
                            <p className="text-gray-700">{restaurante.telefono || "No disponible"}</p>
                        </div>

                        <div>
                            <span className="text-lg font-semibold text-pink-600">Horario:</span>
                            <p className="text-gray-700">{restaurante.horario || "No disponible"}</p>
                        </div>

                        <div>
                            <span className="text-lg font-semibold text-pink-600">Categoría:</span>
                            <p className="text-gray-700">{restaurante.categoria}</p>
                        </div>

                        <div>
                            <span className="text-lg font-semibold text-pink-600">Descripción:</span>
                            <p className="text-gray-700">{restaurante.descripcion}</p>
                        </div>

                        <div>
                            <span className="text-lg font-semibold text-pink-600">Visitado:</span>
                            <p className="text-gray-700">
                                {restaurante.visitado
                                    ? "¡Has visitado este restaurante!"
                                    : "Aún no has visitado este restaurante."}
                            </p>
                        </div>
                    </div>

                    {/* Imagen del restaurante */}
                    {restaurante.imagenURL && (
                        <div>
                            <img
                                src={restaurante.imagenURL}
                                alt={`Imagen de ${restaurante.nombre}`}
                                className="rounded-lg shadow-md w-full object-cover"
                            />
                        </div>
                    )}
                </div>

                {/* Mapa con el marcador */}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4 text-pink-600">Ubicación:</h2>
                    <MapWithMarkers
                        markers={[
                            {
                                lat: restaurante.latitud,
                                lon: restaurante.longitud,
                                nombre: restaurante.nombre,
                            },
                        ]}
                        defaultCenter={[restaurante.latitud, restaurante.longitud]} // Centro en el restaurante
                        defaultZoom={15} // Zoom para ver el marcador de cerca
                    />
                </div>
            </div>
        </div>
    );
}
