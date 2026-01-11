import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ClimateService, Recomendacion } from '../../services/climate'; // Asegúrate que la ruta sea correcta
// NO importamos Leaflet aquí arriba estáticamente para evitar error SSR

@Component({
  selector: 'app-map-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-selector.html',
  styleUrls: ['./map-selector.css']
})
export class MapSelectorComponent implements AfterViewInit {

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map: any; // Tipo any porque Leaflet se carga dinámicamente
  private marker: any;
  private isBrowser: boolean;

  selectedLat: number | null = null;
  selectedLon: number | null = null;

  recomendaciones: Recomendacion[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private climateService: ClimateService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngAfterViewInit() {
    if (this.isBrowser) {
      // 1. Carga dinámica de Leaflet (Soluciona error SSR/Hydration)
      const L = await import('leaflet');

      // 2. Solución a los iconos perdidos (Error 404)
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      L.Marker.prototype.options.icon = DefaultIcon;

      // 3. Inicializar Mapa
      this.initMap(L);
    }
  }

  private initMap(L: any): void {
    // Centro inicial (Cevallos)
    const initialLat = -1.24;
    const initialLon = -78.62;

    this.map = L.map(this.mapContainer.nativeElement).setView([initialLat, initialLon], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (event: any) => {
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

    const cultivo = 'Maíz'; 

    // Asegúrate que tu servicio tenga el método 'obtenerRecomendacion' o 'getRecomendacion'
    // Aquí uso 'obtenerRecomendacion' basado en el contexto anterior
    this.climateService.obtenerRecomendacion(cultivo, this.selectedLat, this.selectedLon)
      .subscribe({
        next: (res: any) => {
          console.log('Respuesta API:', res);
          
          // 4. CORRECCIÓN DE DATOS: Usar la estructura correcta del JSON
          if (res.success && res.data && res.data.topRecomendaciones) {
            this.recomendaciones = res.data.topRecomendaciones;
          } else {
             // Fallback por si la estructura cambia
             this.error = 'No se encontraron recomendaciones válidas.';
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error HTTP:', err);
          this.error = 'No se pudieron obtener recomendaciones. Revisa la consola.';
          this.loading = false;
        }
      });
  }

  generarEstrellas(cantidad: number): string {
    return '★'.repeat(cantidad) + '☆'.repeat(5 - cantidad);
  }
}