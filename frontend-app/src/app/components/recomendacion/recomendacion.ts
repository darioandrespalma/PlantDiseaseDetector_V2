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
    this.recomendaciones = []; // Limpiar antes de cargar

    // CORRECCIÓN 1: Usar 'obtenerRecomendacion' (nombre correcto del servicio)
    this.climateService.obtenerRecomendacion(cultivo, lat, lon).subscribe({
      
      // CORRECCIÓN 2: Tipar 'res' como 'any' para evitar error TS7006
      next: (res: any) => {
        console.log('Datos recibidos:', res); // Debug para ver la estructura

        // CORRECCIÓN 3: Mapeo correcto según tu Postman (data.topRecomendaciones)
        if (res.success && res.data && res.data.topRecomendaciones) {
          this.recomendaciones = res.data.topRecomendaciones;
        } else {
          this.error = 'No se encontraron recomendaciones válidas.';
        }
        
        this.loading = false;
      },
      
      // CORRECCIÓN 2: Tipar 'err' como 'any'
      error: (err: any) => {
        console.error('Error HTTP:', err);
        this.error = 'No se pudieron cargar las recomendaciones. Revisa que el backend esté corriendo.';
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