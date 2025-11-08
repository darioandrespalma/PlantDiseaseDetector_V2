// src/app/services/websocket.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from './auth'; // Ajustado a tu nombre de archivo

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket;

  constructor(private authService: AuthService) {
    // Inicializa el socket (sin conectar aún)
    this.socket = io(environment.apiUrl, { autoConnect: false });
  }

  // Llamar a esto DESPUÉS del login
  connect(): void {
    const userId = this.authService.getUserId();
    if (userId && !this.socket.connected) {
      this.socket.connect();
      this.socket.on('connect', () => {
        console.log('WebSocket Conectado:', this.socket.id);
        // Unirse a la "sala" privada del usuario
        this.socket.emit('join', userId);
      });
    }
  }

  disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  // Escuchar eventos (como la predicción)
  listen<T>(eventName: string): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
}