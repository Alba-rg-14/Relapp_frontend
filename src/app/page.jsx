"use client"; // Esto convierte este archivo en un componente del cliente
import { Button } from "@/components/ui/button"; // Importa el componente Button
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // Importa useRouter para la navegación
import { useState, useEffect } from "react"; // Importa useState y useEffect

export default function Landing() {
  // Hook para obtener la sesión del usuario
  const { data: session, status } = useSession();
  const router = useRouter(); // Inicializa el router

  const [isLoading, setIsLoading] = useState(true); // Estado para manejar el loading

  // Usamos useEffect para controlar la carga de la sesión
  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false); // Cuando la sesión esté lista, establecemos loading como false
    }
  }, [status]);

  const handleGitHubLogin = () => {
    // Redirige al usuario al flujo de inicio de sesión con GitHub
    signIn("github");
  };

  const handleLogout = () => {
    // Cierra la sesión
    signOut();
  };

  const navigateToHome = () => {
    // Redirige a la página de home
    router.push("/home");
  };

  // Mostrar mensaje de carga solo si está cargando la sesión
  if (isLoading) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="landing flex h-screen p-4 bg-gray-100">
      {/* Sección izquierda */}
      <div className="left-section flex-1 bg-gradient-to-r from-green-200 to-blue-200 rounded-3xl flex flex-col justify-center items-center text-center p-8 shadow-lg">
        <h1 className="text-5xl font-bold text-blue-800 mb-4 font-poppins">
          Relapp
        </h1>
        <p className="text-xl text-gray-700 italic font-poppins">
          Web por y para super novios
        </p>
        <div className="mt-8 flex space-x-4 text-2xl">
          <span>💻</span>
          <span>🌐</span>
        </div>
      </div>

      {/* Sección derecha */}
      <div className="right-section flex-1 flex flex-col justify-center items-center p-8 bg-white rounded-3xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 font-poppins">
          Inicia Sesión
        </h2>
        <div className="form w-full max-w-sm space-y-4">
          {!session ? (
            <Button
              className="w-full bg-blue-500 text-white"
              onClick={handleGitHubLogin}
            >
              Iniciar sesión con GitHub
            </Button>
          ) : (
            <div>
              <p className="mb-4">Hola, {session.user.email}. Estás autenticado.</p>
              <Button
                className="w-full bg-blue-500 text-white mb-4"
                onClick={navigateToHome} // Redirige a la página de home
              >
                Ir a Home
              </Button>
              <Button
                className="w-full bg-red-500 text-white"
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
