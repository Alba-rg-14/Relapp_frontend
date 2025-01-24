import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useState } from "react";

type ImageUploaderProps = {
    onUploadComplete?: (url: string) => void; // Callback para enviar la URL al componente padre
};

const ImageUploader = ({ onUploadComplete }: ImageUploaderProps) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append("image", file); // El campo "image" debe coincidir con el backend

        try {
            const response = await axios.post("http://localhost:5000/imagenes", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const uploadedUrl = response.data.url;
            setImageUrl(uploadedUrl); // Guardar la URL en el estado local

            // Si se proporciona un callback, llamar con la URL de la imagen
            if (onUploadComplete) {
                onUploadComplete(uploadedUrl);
            }

            alert("¡Imagen subida con éxito!");
        } catch (error) {
            console.error("Error al subir la imagen:", error);
            alert("Error al subir la imagen.");
        } finally {
            setIsUploading(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*",
        multiple: false, // Solo una imagen
    });

    return (
        <div>
            <div {...getRootProps()} style={{ border: "2px dashed gray", padding: "20px", textAlign: "center" }}>
                <input {...getInputProps()} />
                <p>Arrastra tu imagen aquí o haz clic para seleccionarla</p>
            </div>
            {isUploading && <p>Subiendo imagen...</p>}
            {imageUrl && (
                <div>
                    <img src={imageUrl} alt="Imagen subida" style={{ maxWidth: "100%", marginTop: "20px" }} />
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
