import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private apiUrl = 'http://127.0.0.1:3000/api'; 

  constructor(private http: HttpClient) {}

  getCultivos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cultivos`); 
  }

  // Ahora esto trae lotes + recomendaciones
  obtenerLotes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/lotes`);
  }

  crearLote(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/lotes`, data);
  }

  eliminarLote(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/lotes/${id}`);
  }

  aceptarRecomendacion(data: { loteId: string, mensaje: string, accion: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/lotes/aceptar-recomendacion`, data);
  }
}