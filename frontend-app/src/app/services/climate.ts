import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface Recomendacion {
  fecha: string;
  score: number;
  estrellas: number;
  motivos: string[];
  alertas: string[];
  temp: number;
  lluvia: number;
  faseLunar: string;
  cultivo: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClimateService {
  private apiUrl = `${environment.apiUrl}/api/climate`;

  constructor(private http: HttpClient) {}

  getRecomendacion(
    cultivo: string,
    lat: number,
    lon: number
  ): Observable<{ success: boolean; recomendaciones: Recomendacion[] }> {
    return this.http.get<{ success: boolean; recomendaciones: Recomendacion[] }>(
      `${this.apiUrl}/recomendacion?cultivo=${encodeURIComponent(
        cultivo
      )}&lat=${lat}&lon=${lon}`
    );
  }
}
