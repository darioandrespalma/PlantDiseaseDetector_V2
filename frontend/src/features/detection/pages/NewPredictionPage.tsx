// src/features/detection/pages/NewPredictionPage.tsx
import { useState } from 'react';
import DashboardLayout from '@/shared/components/templates/DashboardLayout';
import { predictionService, PredictionResult } from '../api/prediction.service';
import { UploadCloud, CheckCircle, AlertTriangle, X, Loader2, Sprout, Coffee, Flower2 } from 'lucide-react';

export default function NewPredictionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState<string>('banana'); // Default
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Handlers ---
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null); // Reset previous result
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      // Optional: Get geolocation
      let lat, lon;
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          lat = position.coords.latitude;
          lon = position.coords.longitude;
        } catch (err) {
          console.warn("Could not get location", err);
        }
      }

      const data = await predictionService.predict(file, crop, lat, lon);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al procesar la imagen.');
    } finally {
      setLoading(false);
    }
  };

  // --- Render Helpers ---

  const getCropIcon = (c: string) => {
    switch (c) {
      case 'banana': return <Flower2 className="text-yellow-500" />;
      case 'coffee': return <Coffee className="text-orange-700" />;
      case 'rice': return <Sprout className="text-emerald-500" />;
      default: return <Sprout />;
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
        
        <header>
          <h1 className="text-3xl font-bold text-white mb-2">Nueva Predicción</h1>
          <p className="text-slate-400">Sube una foto de la hoja afectada para detectar enfermedades.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* --- LEFT: FORM --- */}
          <div className="space-y-6">
            
            {/* 1. Select Crop */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <label className="block text-sm font-medium text-slate-300 mb-4">1. Selecciona el Cultivo</label>
              <div className="grid grid-cols-3 gap-3">
                {['banana', 'rice', 'coffee'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCrop(c)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                      crop === c 
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400' 
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {getCropIcon(c)}
                    <span className="capitalize text-sm font-medium">
                      {c === 'banana' ? 'Banano' : c === 'rice' ? 'Arroz' : 'Café'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Upload Image */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <label className="block text-sm font-medium text-slate-300 mb-4">2. Sube la Imagen</label>
              
              {!preview ? (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-slate-600 rounded-xl h-48 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors cursor-pointer relative bg-slate-900/50"
                >
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <UploadCloud size={40} className="mb-2" />
                  <p className="text-sm font-medium">Arrastra o haz clic para subir</p>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG (Max 5MB)</p>
                </div>
              ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-600 group">
                  <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                  <button 
                    onClick={() => { setFile(null); setPreview(null); setResult(null); }}
                    className="absolute top-2 right-2 p-2 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* 3. Action Button */}
            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              {loading ? (
                <><Loader2 className="animate-spin" /> Procesando...</>
              ) : (
                <>Analizar Planta</>
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3">
                <AlertTriangle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

          </div>

          {/* --- RIGHT: RESULTS --- */}
          <div className="space-y-6">
            {result ? (
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 animate-fade-in-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Análisis Completado</h2>
                    <p className="text-slate-400 text-sm">ID: {result._id}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-1">Diagnóstico</p>
                    <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-700">
                      <span className="text-2xl font-bold text-white capitalize">{result.result.disease}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${result.result.confidence > 80 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {result.result.confidence.toFixed(1)}% Confianza
                      </span>
                    </div>
                  </div>

                  {result.result.recommendations && result.result.recommendations.length > 0 && (
                    <div>
                      <p className="text-sm text-slate-400 uppercase tracking-wider font-bold mb-2">Recomendaciones</p>
                      <ul className="space-y-2">
                        {result.result.recommendations.map((rec, i) => (
                          <li key={i} className="flex gap-3 text-slate-300 bg-slate-900/50 p-3 rounded-lg text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 p-12 text-center">
                <Sprout size={64} className="mb-4 opacity-20" />
                <h3 className="text-lg font-bold text-slate-500">Esperando imagen...</h3>
                <p className="text-sm max-w-xs mx-auto mt-2">
                  Selecciona un cultivo y sube una foto para ver el diagnóstico de la IA aquí.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}