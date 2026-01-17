import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private apiUrl = 'http://localhost:5000/api'; // Ajusta si tu puerto es diferente

  constructor(private http: HttpClient) {}

  // Obtener lista de cultivos para el select del formulario
  getCultivos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cultivos`); 
    // Nota: Si no tienes esta ruta aún, hardcodearemos la lista en el componente temporalmente.
  }

  crearLote(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/lotes`, data);
  }
}