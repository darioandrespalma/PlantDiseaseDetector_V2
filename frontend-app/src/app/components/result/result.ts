import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // ✅ Importar
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
    MatProgressSpinnerModule // ✅ Añadir aquí
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

  goBack() {
    this.predictService.clearPrediction();
    this.router.navigate(['/deteccion', 'banana']);
  }

  goToHistory() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}