import { useRouter } from "next/navigation";

export default function Card({ title, subtitle, image, onDetailsClick, actions }) {
    const router = useRouter();

    return (
        <div className="bg-white shadow-md rounded-lg p-4">
            {image && <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg" />}
            <h2 className="text-2xl font-bold mt-4">{title}</h2>
            <p className="text-gray-700">{subtitle}</p>
            <div className="mt-4 space-x-2">
                <button
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-400"
                    onClick={onDetailsClick}
                >
                    Ver detalles
                </button>
                {actions &&
                    actions.map((action, index) => (
                        <button
                            key={index}
                            className="bg-pink-300 px-4 py-2 rounded-lg hover:bg-pink-200"
                            onClick={action.onClick}
                        >
                            {action.label}
                        </button>
                    ))}
            </div>
        </div>
    );
}
