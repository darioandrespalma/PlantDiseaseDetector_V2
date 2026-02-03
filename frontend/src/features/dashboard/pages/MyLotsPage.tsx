import { useEffect, useState } from 'react';
import DashboardLayout from '@/shared/components/templates/DashboardLayout';
import { useFarmStore } from '@/features/farms/farm.store';
import { lotsService, Lote } from '@/features/farms/lots.service';
import FarmMap from '../components/FarmMap';
import { Sprout, Plus, MapPin, AlertTriangle, Droplets } from 'lucide-react';

export default function MyLotsPage() {
  const { currentFarm } = useFarmStore();
  
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [crops, setCrops] = useState<any[]>([]); // Catálogo
  const [loading, setLoading] = useState(true);
  
  // Estado para Modal de Creación
  const [showModal, setShowModal] = useState(false);
  const [newLotCoords, setNewLotCoords] = useState<{lat: number, lon: number} | null>(null);
  const [formData, setFormData] = useState({ nombre: '', area: 1, cultivoId: '', fechaSiembra: '' });

  // 1. Cargar Datos al cambiar de Finca
  useEffect(() => {
    if (!currentFarm) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [lotesData, cropsData] = await Promise.all([
            lotsService.getByFarm(currentFarm._id),
            lotsService.getCrops()
        ]);
        setLotes(lotesData);
        setCrops(cropsData);
      } catch (error) {
        console.error("Error cargando lotes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentFarm]); // 👈 ¡CLAVE! Se actualiza al cambiar finca en el Navbar

  // 2. Manejar Clic en Mapa
  const handleMapClick = (lat: number, lon: number) => {
    setNewLotCoords({ lat, lon });
    setShowModal(true);
  };

  // 3. Guardar Nuevo Lote
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFarm || !newLotCoords) return;

    try {
        const newLot = await lotsService.create({
            farmId: currentFarm._id,
            ...formData,
            lat: newLotCoords.lat,
            lon: newLotCoords.lon
        });
        setLotes([newLot, ...lotes]); // Actualizar UI
        setShowModal(false);
        setFormData({ nombre: '', area: 1, cultivoId: '', fechaSiembra: '' });
    } catch (error) {
        console.error("Error creando lote:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6 animate-fade-in-up">
        
        {/* --- COLUMNA IZQUIERDA: LISTA --- */}
        <div className="lg:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
            <header className="mb-2">
                <h1 className="text-2xl font-bold text-white">Mis Lotes</h1>
                <p className="text-slate-400 text-sm">Gestiona tus unidades productivas.</p>
            </header>

            {loading ? (
                <div className="text-center p-10 text-slate-500">Cargando gemelo digital...</div>
            ) : lotes.length === 0 ? (
                <div className="p-6 border border-dashed border-slate-700 rounded-2xl text-center">
                    <MapPin className="mx-auto text-slate-500 mb-2" />
                    <p className="text-slate-400 text-sm">No hay lotes en esta finca.</p>
                    <p className="text-emerald-400 text-xs mt-1">Haz clic en el mapa para crear uno.</p>
                </div>
            ) : (
                lotes.map(lote => (
                    <div key={lote._id} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl hover:border-emerald-500/50 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${lote.estadoSalud === 'saludable' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    <Sprout size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{lote.nombre}</h3>
                                    <p className="text-xs text-slate-400">{lote.cultivoData.nombre} • {lote.area} Has</p>
                                </div>
                            </div>
                            <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded text-slate-300">
                                {lote.edadDias} días
                            </span>
                        </div>
                        
                        {/* Alertas Inteligentes (Si existen) */}
                        {lote.recomendacionesDelDia && lote.recomendacionesDelDia.length > 0 && (
                            <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2">
                                <AlertTriangle size={14} className="text-yellow-400 shrink-0 mt-0.5" />
                                <p className="text-xs text-yellow-200">
                                    {lote.recomendacionesDelDia[0].mensaje}
                                </p>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>

        {/* --- COLUMNA DERECHA: MAPA --- */}
        <div className="lg:w-2/3 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl">
            {currentFarm ? (
                <FarmMap 
                    center={currentFarm.ubicacion} 
                    lotes={lotes} 
                    onMapClick={handleMapClick}
                />
            ) : (
                <div className="flex items-center justify-center h-full text-slate-500">Selecciona una finca</div>
            )}

            {/* Overlay de Instrucciones */}
            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-full border border-slate-700 text-xs text-white z-[400] shadow-lg flex items-center gap-2">
                <Plus size={14} className="text-emerald-400"/> Haz clic en el mapa para sembrar
            </div>
        </div>

        {/* --- MODAL DE CREACIÓN (Simple por ahora) --- */}
        {showModal && (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                    <h2 className="text-xl font-bold text-white mb-4">Sembrar Nuevo Lote</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Nombre del Sector</label>
                            <input autoFocus type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" placeholder="Ej: Lote Norte" 
                                value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Cultivo</label>
                                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                                    value={formData.cultivoId} onChange={e => setFormData({...formData, cultivoId: e.target.value})} required>
                                    <option value="">Seleccionar...</option>
                                    {crops.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Hectáreas</label>
                                <input type="number" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" 
                                    value={formData.area} onChange={e => setFormData({...formData, area: Number(e.target.value)})} required />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Fecha de Siembra</label>
                            <input type="date" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white" 
                                value={formData.fechaSiembra} onChange={e => setFormData({...formData, fechaSiembra: e.target.value})} required />
                        </div>
                        
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 text-slate-400 hover:bg-slate-800 rounded-lg transition">Cancelar</button>
                            <button type="submit" className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition shadow-lg shadow-emerald-500/20">Sembrar</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

      </div>
    </DashboardLayout>
  );
}