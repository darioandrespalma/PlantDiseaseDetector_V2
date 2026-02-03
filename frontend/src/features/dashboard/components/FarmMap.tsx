import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Lote } from '@/features/farms/lots.service';

// Fix para iconos de Leaflet en React
import iconMarker from 'leaflet/dist/images/marker-icon.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconRetinaUrl: iconRetina,
    iconUrl: iconMarker,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Iconos personalizados por estado (Semáforo)
const getIconColor = (estado: string) => {
    // Aquí podrías usar SVGs personalizados de colores
    // Por simplicidad usaremos el default, pero en PRO usarías iconos verde/rojo
    return DefaultIcon; 
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