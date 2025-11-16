// src/app/services/auth.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core'; // <-- 1. Importa Inject y PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // <-- 2. Importa isPlatformBrowser
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // <-- 3. Inyecta el PLATFORM_ID
  ) {}

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // 4. Añade la comprobación
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response._id);
        }
      })
    );
  }

  logout(): void {
    // 5. Añade la comprobación
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  }

  getToken(): string | null {
    // 6. Añade la comprobación
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null; // Devuelve null si estamos en el servidor
  }

  getUserId(): string | null {
    // 7. Añade la comprobación
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userId');
    }
    return null; // Devuelve null si estamos en el servidor
  }

  isLoggedIn(): boolean {
    try {
      return typeof localStorage !== 'undefined' && localStorage.getItem('token') !== null;
    } catch {
      return false;
    }
  }

}