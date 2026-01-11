import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Lote {
  _id?: string;
  nombre: string;
  cultivo: any; // Puede ser objeto poblado o string ID
  fechaSiembra: Date;
  area: number;
  estadoSalud: 'saludable' | 'riesgo' | 'peligro';
  historial?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class FincaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/lotes';

  obtenerLotes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  crearLote(lote: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, lote);
  }

  agregarEvento(loteId: string, evento: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${loteId}/historial`, evento);
  }

  eliminarLote(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}