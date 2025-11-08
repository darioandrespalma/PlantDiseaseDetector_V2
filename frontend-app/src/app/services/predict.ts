// frontend-app/src/app/services/predict.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth'; // Asegúrate que el nombre de archivo 'auth.ts' sea correcto

@Injectable({
  providedIn: 'root'
})
export class PredictService { // <--- El nombre correcto es PredictService
  private apiUrl = `${environment.apiUrl}/api/predict`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file); // 'image' debe coincidir con upload.single('image')

    // Crear los headers de autorización
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Subir el archivo
    return this.http.post(`${this.apiUrl}/upload`, formData, { headers: headers });
  }
}