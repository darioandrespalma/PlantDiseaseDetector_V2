import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// Eliminamos la importación de environment que causaba error TS2307

export interface Recomendacion {
  fecha: string;
  fechaFormateada: string;
  score: number;
  estrellas: number;
  motivos: string[];
  alertas: string[];
  temp: number;
  lluvia: number;
  faseLunar: string;
  condiciones: any;
}

@Injectable({
  providedIn: 'root'
})
export class ClimateService {
  private http = inject(HttpClient);
  
  // URL directa para desarrollo local
  private apiUrl = 'http://localhost:3000/api/climate'; 

  // El método se llama obtenerRecomendacion
  obtenerRecomendacion(cultivo: string, lat: number, lon: number): Observable<any> {
    const params = new HttpParams()
      .set('cultivo', cultivo)
      .set('lat', lat.toString())
      .set('lon', lon.toString());

    return this.http.get<any>(`${this.apiUrl}/recomendacion`, { params });
  }

  obtenerCultivos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cultivos`);
  }
}