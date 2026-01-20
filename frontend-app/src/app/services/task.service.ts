import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development'; // Ajusta según tu estructura

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/tasks'; // O usa environment.apiUrl

  getTasks(filters?: any): Observable<any[]> {
    let params = new HttpParams();
    if (filters?.loteId) params = params.set('loteId', filters.loteId);
    if (filters?.mes !== undefined) params = params.set('mes', filters.mes);
    if (filters?.anio) params = params.set('anio', filters.anio);

    return this.http.get<any[]>(this.apiUrl, { params });
  }

  createTask(task: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, task);
  }

  updateTask(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}