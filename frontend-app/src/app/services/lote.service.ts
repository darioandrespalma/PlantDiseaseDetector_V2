import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  // 🔴 CAMBIO OBLIGATORIO: Cambia 5000 por 3000
  private apiUrl = 'http://127.0.0.1:3000/api'; 

  constructor(private http: HttpClient) {}

  getCultivos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cultivos`); 
  }

  crearLote(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/lotes`, data);
  }
}