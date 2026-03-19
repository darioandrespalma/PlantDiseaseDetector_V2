import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Iconos personalizados por estado usando L.divIcon con Tailwind CSS
const getIconColor = (estado: string) => {
    let html = '';
    if (estado === 'Crítico') {
        // Círculo rojo con animación de ping
        html = `
            <div class="relative w-6 h-6">
                <div class="absolute inset-0 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-75"></div>
                <div class="relative w-6 h-6 bg-red-500 rounded-full"></div>
            </div>
        `;
    } else if (estado === 'Sano') {
        // Círculo verde esmeralda con brillo
        html = `
            <div class="w-6 h-6 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
        `;
    } else {
        // Estado neutro o por defecto
        html = `
            <div class="w-6 h-6 bg-gray-500 rounded-full"></div>
        `;
    }

    return L.divIcon({
        html,
        className: 'custom-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

// Componente para manejar clics en el mapa
function MapClickEvents({ onMapClick }: { onMapClick: (lat: number, lon: number) => void }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

interface FarmMapProps {
    center: { lat: number; lon: number };
    lotes: Lote[];
    onMapClick: (lat: number, lon: number) => void;
}

export default function FarmMap({ center, lotes, onMapClick }: FarmMapProps) {
    return (
        <MapContainer 
            center={[center.lat, center.lon]} 
            zoom={15} 
            className="w-full h-full rounded-2xl z-0"
        >
            {/* Capa Satelital (Opcional) o Estándar */}
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Renderizar Lotes Existentes */}
            {lotes.map((lote) => (
                <Marker 
                    key={lote._id} 
                    position={[lote.ubicacion.lat, lote.ubicacion.lon]}
                    icon={getIconColor(lote.estadoSalud)}
                >
                    <Popup>
                        <div className="text-slate-900">
                            <strong className="block text-lg">{lote.nombre}</strong>
                            <span className="text-xs font-bold uppercase text-emerald-600">
                                {lote.cultivoData.nombre}
                            </span>
                            <br />
                            <span className="text-xs">Edad: {lote.edadDias} días</span>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Detector de Clics para crear */}
            <MapClickEvents onMapClick={onMapClick} />
        </MapContainer>
    );
}