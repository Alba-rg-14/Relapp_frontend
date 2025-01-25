"use client";
import { useSession } from "next-auth/react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { TextField, Select, MenuItem, FormControl, InputLabel, Checkbox } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import ImageUploader from "@/components/ImageUploader";

const LOG_BASE_API = process.env.NEXT_PUBLIC_LOG_API
const MAPAS_BASE_API = process.env.NEXT_PUBLIC_MAPA_API;
const IMAGE_BASE_API = process.env.NEXT_PUBLIC_IMAGE_BASE_API;
const BACKEND_BASE_API = process.env.NEXT_PUBLIC_MONGO_DB_URI;

export default function Pagina() {
    const { data: session, status } = useSession();
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [horario, setHorario] = useState("");
    const [categoria, setCategoria] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [imagenURL, setImagenURL] = useState("");
    const [visitado, setVisitado] = useState(false);
    const router = useRouter();

    // Si la sesión aún está cargando, retorna un mensaje de carga
    if (status === "loading") {
        return <p>Cargando...</p>;
    }


    const handleSubmit = async (event) => {
        event.preventDefault();

        let latitud = null;
        let longitud = null;

        // Obtener coordenadas desde la API de mapas
        if (direccion.trim()) {
            try {
                const response = await axios.get(`${MAPAS_BASE_API}/${encodeURIComponent(direccion)}`);
                if (response.status === 200 && response.data) {
                    latitud = response.data.lat;
                    longitud = response.data.lon;
                } else {
                    alert("No se pudieron obtener coordenadas para la dirección.");
                    return;
                }
            } catch (error) {
                alert("Hubo un problema al procesar la dirección.");
                return;
            }
        }

        // Validar campos obligatorios
        if (!nombre.trim() || !direccion.trim() || !categoria.trim() || !descripcion.trim()) {
            alert("Por favor, rellena todos los campos obligatorios.");
            return;
        }

        // Crear objeto para enviar al backend
        const data = {
            nombre,
            direccion,
            latitud,
            longitud,
            telefono,
            horario,
            categoria,
            descripcion,
            imagenURL,
            visitado,
        };

        try {
            const res = await axios.post(`${BACKEND_BASE_API}/restaurantes/crear`, data, {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.status >= 200 && res.status < 300) {
                alert("Restaurante añadido con éxito!");
                router.push("/home");
            }
        } catch (error) {
            console.error("Error al crear el restaurante:", error);
            alert("Error al crear el restaurante.");
        }

    };


    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar />

            <main className="flex flex-1 p-4">
                {/* Sección izquierda */}
                <div className="left-section flex-1 bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl flex flex-col justify-center items-center text-center p-8 shadow-lg">
                    <h1 className="text-5xl font-bold text-blue-800 mb-4 font-poppins">
                        🌍💻 ¡Añade un restaurante que quieras probar! 💻🌍
                    </h1>
                    <p className="text-xl text-gray-700 italic font-poppins">
                        Formulario para crear un restaurante
                    </p>
                    <div className="mt-8 flex space-x-4 text-2xl">
                        <span>Incluyendo fotos</span>
                    </div>
                </div>

                {/* Sección derecha */}
                <div className="right-section flex-1 bg-white rounded-3xl p-8 shadow-lg flex flex-col justify-center items-center text-center">
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                            width: "100%",
                            maxWidth: "400px",
                        }}
                    >
                        <TextField
                            label="Nombre del restaurante"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                        <TextField
                            label="Direccion"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            helperText="Ejemplo: Calle Mayor, 1, Madrid"
                            multiline
                            required
                        />
                        <TextField
                            label="Telefono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            helperText="Ejemplo: 123456789"
                        />
                        <TextField
                            label="Horario"
                            value={horario}
                            onChange={(e) => setHorario(e.target.value)}
                            helperText="Ejemplo: 10:00 - 22:00"
                        />
                        <TextField
                            label="Descripción"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            multiline
                            required
                        />
                        <FormControl>
                            <InputLabel id="categoria-label">Categoría</InputLabel>
                            <Select
                                labelId="categoria-label"
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                required
                            >
                                <MenuItem value="Italiana">Italiana</MenuItem>
                                <MenuItem value="Japonesa">Japonesa</MenuItem>
                                <MenuItem value="Mexicana">Mexicana</MenuItem>
                            </Select>
                        </FormControl>


                        {/* Checkbox para visitado */}
                        <FormControl>
                            <label>
                                <Checkbox checked={visitado} onChange={(e) => setVisitado(e.target.checked)} />
                                ¿Visitado?
                            </label>
                        </FormControl>

                        <ImageUploader
                            onUploadComplete={(url) => setImagenURL(url)} // Actualiza imagenURL con la URL subida
                        />


                        <Button type="submit" variant="contained" color="primary">
                            Crear
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    );
}