import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { ClimateService, Recomendacion } from '../../services/climate';

@Component({
  selector: 'app-map-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-selector.html',
  styleUrls: ['./map-selector.css']
})
export class MapSelectorComponent implements AfterViewInit {

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map!: L.Map;
  private marker: L.Marker | null = null;

  selectedLat: number | null = null;
  selectedLon: number | null = null;

  recomendaciones: Recomendacion[] = [];
  loading = false;
  error: string | null = null;

  constructor(private climateService: ClimateService) {}

  ngAfterViewInit(): void {
    // Centro inicial (por ejemplo Cevallos)
    const initialLat = -1.24;
    const initialLon = -78.62;

    this.map = L.map(this.mapContainer.nativeElement).setView(
      [initialLat, initialLon],
      10
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;

      this.selectedLat = lat;
      this.selectedLon = lng;

      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map);
      }
    });
  }

  obtenerRecomendaciones() {
    if (this.selectedLat == null || this.selectedLon == null) {
      this.error = 'Selecciona un punto en el mapa primero.';
      return;
    }

    this.loading = true;
    this.error = null;
    this.recomendaciones = [];

    const cultivo = 'Maíz'; // luego lo puedes hacer dinámico

    this.climateService
      .getRecomendacion(cultivo, this.selectedLat, this.selectedLon)
      .subscribe({
        next: (res) => {
          this.recomendaciones = res.recomendaciones;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'No se pudieron obtener recomendaciones.';
          this.loading = false;
        }
      });
  }

  generarEstrellas(cantidad: number): string {
    return '★'.repeat(cantidad) + '☆'.repeat(5 - cantidad);
  }
}
