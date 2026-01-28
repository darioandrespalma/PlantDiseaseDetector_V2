import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth';
import { WebsocketService } from './websocket';

export interface PredictionResult {
  _id: string;
  crop: string;
  imagePath: string;
  // Agregamos location al modelo del frontend
  location?: {
    type: string;
    coordinates: number[]; // [lon, lat]
  };
  result: {
    disease: string;
    confidence: number;
    recommendations: string[];
  };
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PredictService {
  private apiUrl = `${environment.apiUrl}/api/predict`;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private currentPredictionSubject = new BehaviorSubject<PredictionResult | null>(null);

  public loading$ = this.loadingSubject.asObservable();
  public currentPrediction$ = this.currentPredictionSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private websocket: WebsocketService
  ) {
    this.websocket.listen<PredictionResult>('prediction_result').subscribe(prediction => {
      console.log('⚡ WebSocket backup: Actualizando predicción');
      this.loadingSubject.next(false);
      this.currentPredictionSubject.next(prediction);
    });
  }

  // ✅ CAMBIO 1: Aceptar coords opcionales
  uploadImage(file: File, crop: string, coords?: { lat: number, lon: number }): Observable<PredictionResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('crop', crop);

    // Si existen coordenadas, las enviamos
    if (coords) {
      formData.append('lat', coords.lat.toString());
      formData.append('lon', coords.lon.toString());
    }

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.loadingSubject.next(true);

    return this.http.post<PredictionResult>(`${this.apiUrl}/upload`, formData, { headers }).pipe(
      tap({
        next: (response) => {
          console.log('✅ HTTP Rápido: Predicción recibida');
          this.loadingSubject.next(false);
          this.currentPredictionSubject.next(response);
        },
        error: (error) => {
          console.error('❌ Error HTTP:', error);
          this.loadingSubject.next(false);
        }
      })
    );
  }

  getPredictionById(id: string): Observable<PredictionResult> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<PredictionResult>(`${this.apiUrl}/${id}`, { headers });
  }

  // ✅ CAMBIO 2: Método para obtener historial (Para el mapa)
  getPredictionHistory(): Observable<PredictionResult[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    // Asumiendo que tu backend tiene GET /api/predict configurado para devolver lista
    return this.http.get<PredictionResult[]>(`${this.apiUrl}/history`, { headers });
  }

  clearPrediction(): void {
    this.currentPredictionSubject.next(null);
    this.loadingSubject.next(false);
  }
}