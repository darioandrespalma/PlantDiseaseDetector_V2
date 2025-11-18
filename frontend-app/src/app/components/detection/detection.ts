import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'; // ✅ Añadir ViewChild y ElementRef
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PredictService, PredictionResult } from '../../services/predict';
import { ThemeService } from '../../services/theme';
import { WebsocketService } from '../../services/websocket';

import { 
  trigger, transition, style, animate, query, stagger 
} from '@angular/animations';

@Component({
  selector: 'app-detection',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './detection.html',
  styleUrls: ['./detection.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ]),
    trigger('staggerItems', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DetectionComponent implements OnInit, OnDestroy {
  crop: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isDragging = false;
  loading = false;
  errorMessage: string | null = null;

  @ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>; // ✅ Referencia

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public router: Router, // ✅ Público
    public predictService: PredictService,
    public theme: ThemeService,
    private websocket: WebsocketService
  ) {}

  ngOnInit() {
    // Obtener el cultivo de la ruta (banana)
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.crop = params.get('crop') || 'banana';
    });

    // Suscribirse al estado de carga
    this.predictService.loading$.pipe(takeUntil(this.destroy$)).subscribe(loading => {
      this.loading = loading;
    });

    // Suscribirse a la predicción actual
    this.predictService.currentPrediction$.pipe(takeUntil(this.destroy$)).subscribe(prediction => {
      if (prediction) {
        this.router.navigate(['/result', prediction._id]);
      }
    });

    // Conectar WebSocket
    this.websocket.connect();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Por favor selecciona un archivo de imagen válido';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'La imagen no debe superar 5MB';
      return;
    }

    this.errorMessage = null;
    this.selectedFile = file;
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  uploadImage() {
    if (!this.selectedFile || !this.crop) return;

    this.errorMessage = null;
    this.predictService.uploadImage(this.selectedFile, this.crop).subscribe({
      error: (err) => {
        console.error('Error en upload:', err);
        this.errorMessage = 'Error al subir la imagen. Intenta de nuevo.';
        this.predictService.clearPrediction();
      }
    });
  }

  removeImage() {
    this.selectedFile = null;
    this.previewUrl = null;
    this.errorMessage = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // ✅ Resetea el input
    }
  }
}