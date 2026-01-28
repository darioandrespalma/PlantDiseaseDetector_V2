import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PredictService, PredictionResult } from '../../services/predict';
import { ThemeService } from '../../services/theme';

import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './result.html',
  styleUrls: ['./result.css'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class ResultComponent implements OnInit, OnDestroy {
  prediction: PredictionResult | null = null;
  loading = true;
  errorMessage: string | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private predictService: PredictService,
    public theme: ThemeService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.loadPrediction(id);
    } else {
      this.predictService.currentPrediction$.pipe(takeUntil(this.destroy$)).subscribe(pred => {
        if (pred) {
          this.prediction = pred;
          this.loading = false;
        } else {
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  loadPrediction(id: string) {
    this.predictService.getPredictionById(id).subscribe({
      next: (pred) => {
        this.prediction = pred;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading prediction:', err);
        this.errorMessage = 'No se pudo cargar el resultado';
        this.loading = false;
      }
    });
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 80) return 'var(--color-success)';
    if (confidence >= 50) return 'var(--color-warning)';
    return 'var(--color-error)';
  }

  scheduleTreatment() {
    if (!this.prediction) return;

    // 1. Detectar si es planta sana o enferma para el título y tipo
    const diseaseName = this.prediction.result.disease.toLowerCase();
    const isHealthy = diseaseName.includes('healthy') || diseaseName.includes('sana') || diseaseName.includes('saludable');

    // 2. Formatear las recomendaciones como notas de texto
    const recomendacionesTexto = this.prediction.result.recommendations && this.prediction.result.recommendations.length > 0
      ? `\n- ${this.prediction.result.recommendations.join('\n- ')}`
      : 'Sin recomendaciones específicas.';

    const rawConf = this.prediction.result.confidence;
    const porcentaje = this.prediction.result.confidence;

    const notasCompletas = `Diagnóstico IA (Confianza: ${(this.prediction.result.confidence * 100).toFixed(0)}%):${recomendacionesTexto}`;

    // 3. Preparar parámetros para enviar a Tareas
    const queryParams = {
      autoFill: 'true',
      titulo: isHealthy 
        ? `Monitoreo Preventivo: ${this.prediction.crop}` 
        : `Tratamiento Fitosanitario: ${this.prediction.result.disease}`,
      tipo: isHealthy ? 'Monitoreo' : 'Sanidad', // 'Sanidad' se usará en Tareas
      fecha: new Date().toISOString().split('T')[0], // Fecha de hoy
      notas: notasCompletas,
      // Si tuvieras el loteId en la predicción, podrías pasarlo: loteId: this.prediction.loteId
    };

    // 4. Navegar
    this.router.navigate(['/tareas'], { queryParams: queryParams });
  }

  goBack() {
    const crop = this.prediction?.crop || 'banana';
    this.predictService.clearPrediction();
    this.router.navigate(['/deteccion', crop]);
  }

  goToHistory() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}