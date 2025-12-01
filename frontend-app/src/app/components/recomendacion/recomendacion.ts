// src/app/components/recomendacion/recomendacion.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, NgForOf, NgIf } from '@angular/common';
import { ClimateService, Recomendacion } from '../../services/climate';

@Component({
  selector: 'app-recomendacion',
  standalone: true,
  imports: [CommonModule, NgIf, NgForOf, DatePipe],
  templateUrl: './recomendacion.html',
  styleUrls: ['./recomendacion.css']
})
export class RecomendacionComponent implements OnInit {
  recomendaciones: Recomendacion[] = [];
  loading = false;
  error: string | null = null;

  constructor(private climateService: ClimateService) {}

  ngOnInit() {
    // 🔹 Por ahora, valores fijos (Cevallos + Maíz)
    this.cargarRecomendaciones('Maíz', -1.24, -78.62);
  }

  cargarRecomendaciones(cultivo: string, lat: number, lon: number) {
    this.loading = true;
    this.error = null;

    this.climateService.getRecomendacion(cultivo, lat, lon).subscribe({
      next: (response) => {
        this.recomendaciones = response.recomendaciones;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar las recomendaciones';
        this.loading = false;
      }
    });
  }

  generarEstrellas(cantidad: number): string {
    return '★'.repeat(cantidad) + '☆'.repeat(5 - cantidad);
  }

  esRecomendacionExelente(rec: Recomendacion): boolean {
    return rec.score >= 80 && rec.alertas.length === 0;
  }
}
