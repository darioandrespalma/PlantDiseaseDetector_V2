import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // <--- 1. IMPORTANTE: Añadir esto
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth';
import { WebsocketService } from './websocket';

export interface PredictionResult {
  _id: string;
  crop: string;
  imagePath: string;
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
    // El WebSocket se queda como RESPALDO.
    // Si por alguna razón la HTTP falla pero el socket llega, esto actualizará la UI.
    this.websocket.listen<PredictionResult>('prediction_result').subscribe(prediction => {
      console.log('⚡ WebSocket backup: Actualizando predicción');
      this.loadingSubject.next(false);
      this.currentPredictionSubject.next(prediction);
    });
  }

  uploadImage(file: File, crop: string): Observable<PredictionResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('crop', crop);

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.loadingSubject.next(true); // Activar Spinner

    // --- 2. AQUÍ ESTÁ LA CORRECCIÓN ---
    return this.http.post<PredictionResult>(`${this.apiUrl}/upload`, formData, { headers }).pipe(
      tap({
        next: (response) => {
          console.log('✅ HTTP Rápido: Predicción recibida');
          this.loadingSubject.next(false);       // Apagar Spinner inmediatamente
          this.currentPredictionSubject.next(response); // Mostrar resultado
        },
        error: (error) => {
          console.error('❌ Error HTTP:', error);
          this.loadingSubject.next(false); // Apagar Spinner si falla
        }
      })
    );
  }

  getPredictionById(id: string): Observable<PredictionResult> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<PredictionResult>(`${this.apiUrl}/${id}`, { headers });
  }

  clearPrediction(): void {
    this.currentPredictionSubject.next(null);
    this.loadingSubject.next(false);
  }
}