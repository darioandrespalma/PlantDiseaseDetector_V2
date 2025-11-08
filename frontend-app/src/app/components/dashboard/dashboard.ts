// src/app/components/dashboard/dashboard.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth'; // Ajustado
import { PredictService } from '../../services/predict'; // Ajustado
import { WebsocketService } from '../../services/websocket'; // Ajustado
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

// --- Importaciones de Angular Material ---
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar'; // Añadido
import { MatTooltipModule } from '@angular/material/tooltip'; // Añadido
import { CommonModule} from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatToolbarModule, // Añadido
    MatTooltipModule  // Añadido
  ],
  templateUrl: './dashboard.html', // Ajustado
  styleUrls: ['./dashboard.css']   // Ajustado
})
export class DashboardComponent implements OnInit, OnDestroy {
  selectedFile: File | null = null;
  selectedFileName = '';
  isLoading = false;
  predictionResult: any = null;
  wsSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private predictService: PredictService,
    private wsService: WebsocketService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.wsSubscription = new Subscription();
  }

  ngOnInit(): void {
    // Escuchar los resultados de predicción del WebSocket
    this.wsSubscription = this.wsService.listen('prediction_result').subscribe((data: any) => {
      this.isLoading = false;
      this.predictionResult = data;
      this.toastr.success('¡Análisis completado!', 'Predicción recibida');
    });
  }

  ngOnDestroy(): void {
    this.wsSubscription.unsubscribe();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.predictionResult = null; // Limpiar resultado anterior
    }
  }

  onUpload(): void {
    if (!this.selectedFile) {
      this.toastr.warning('Por favor, selecciona un archivo primero.', 'Archivo no seleccionado');
      return;
    }

    this.isLoading = true;
    this.predictService.uploadImage(this.selectedFile).subscribe({
      next: (response) => {
        // La respuesta HTTP 201 solo confirma la subida.
        // El resultado real vendrá por el WebSocket.
        this.toastr.info('Imagen subida. Procesando análisis...', 'En progreso');
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(err.error.message || 'Error al subir la imagen.', 'Error');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.wsService.disconnect();
    this.router.navigate(['/login']);
  }
}