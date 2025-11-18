import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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
    // Escuchar resultados de WebSocket
    this.websocket.listen<PredictionResult>('prediction_result').subscribe(prediction => {
      this.loadingSubject.next(false);
      this.currentPredictionSubject.next(prediction);
    });
  }

  uploadImage(file: File, crop: string): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('crop', crop);

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.loadingSubject.next(true); // Activar estado de carga
    return this.http.post(`${this.apiUrl}/upload`, formData, { headers });
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