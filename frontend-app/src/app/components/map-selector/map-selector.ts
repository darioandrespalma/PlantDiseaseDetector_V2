import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select'; // Para el filtro
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoteDialogComponent } from '../lote-dialog/lote-dialog';
import { LoteService } from '../../services/lote.service';
import { ToastrService } from 'ngx-toastr';
// Importa tu servicio de clima existente
import { ClimateService, Recomendacion } from '../../services/climate'; 

// 📍 Datos Geográficos para el Filtro
const PROVINCIAS = [
  { nombre: 'Azuay', lat: -2.9001, lon: -79.0059 },
  { nombre: 'Pichincha', lat: -0.2299, lon: -78.5249 },
  { nombre: 'Guayas', lat: -2.1962, lon: -79.8862 },
  { nombre: 'Manabí', lat: -1.0546, lon: -80.4544 },
  { nombre: 'Loja', lat: -3.9931, lon: -79.2042 },
  { nombre: 'Tungurahua', lat: -1.2491, lon: -78.6168 },
  { nombre: 'Imbabura', lat: 0.3517, lon: -78.1223 }
];

@Component({
  selector: 'app-map-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSelectModule, MatDialogModule],
  templateUrl: './map-selector.html', // Usaremos tu HTML modificado abajo
  styleUrls: ['./map-selector.css']
})
export class MapSelectorComponent implements AfterViewInit {

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map: any;
  private marker: any;
  private isBrowser: boolean;

  // Variables para Filtro y Mapa
  provincias = PROVINCIAS;
  provinciaSeleccionada: any = null;

  // Variables existentes (Tu código)
  selectedLat: number | null = null;
  selectedLon: number | null = null;
  recomendaciones: Recomendacion[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private dialog: MatDialog,
    private loteService: LoteService,
    private climateService: ClimateService,
    private toastr: ToastrService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngAfterViewInit() {
    if (this.isBrowser) {
      const L = await import('leaflet');
      
      // Fix iconos Leaflet (Tu código)
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      });
      L.Marker.prototype.options.icon = DefaultIcon;

      this.initMap(L);
    }
  }

  private initMap(L: any): void {
    // Centro inicial (Ecuador)
    this.map = L.map(this.mapContainer.nativeElement).setView([-1.8312, -78.1834], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // 🎯 EVENTO CLIC PRINCIPAL
    this.map.on('click', (event: any) => {
      const { lat, lng } = event.latlng;
      
      // 1. Actualizar visualmente (Tu código)
      this.selectedLat = lat;
      this.selectedLon = lng;
      
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map);
      }

      // 2. ABRIR DIALOGO DE REGISTRO
      this.abrirDialogoRegistro(lat, lng);
    });
  }

  // 🚀 Lógica del Filtro de Provincias
  irAProvincia() {
    if (this.provinciaSeleccionada && this.map) {
      this.map.flyTo(
        [this.provinciaSeleccionada.lat, this.provinciaSeleccionada.lon], 
        10, // Zoom más cercano
        { duration: 1.5 } // Animación suave
      );
    }
  }

  // 🚀 Lógica del Formulario Emergente
  abrirDialogoRegistro(lat: number, lon: number) {
    const dialogRef = this.dialog.open(LoteDialogComponent, {
      width: '450px',
      data: { lat, lon },
      disableClose: true // Obliga a usar botones
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Usuario dio clic en "Guardar Finca"
        this.guardarFinca(result, lat, lon);
      } else {
        // Usuario canceló, pero mantenemos coordenadas para "Consultar Clima" solamente
        this.toastr.info('Modo consulta activado. Puedes ver recomendaciones abajo.', 'Finca no guardada');
      }
    });
  }

  guardarFinca(formData: any, lat: number, lon: number) {
      // Construimos el objeto exacto que espera el backend
      const payload = {
        nombre: formData.nombre,
        cultivoId: formData.cultivoId, // Asegúrate de que el select use este nombre
        // Enviamos lat/lon sueltos porque tu controlador los lee así: const { lat, lon } = req.body;
        lat: lat,
        lon: lon,
        alertasActivas: formData.alertasActivas,
        frecuenciaAlertas: formData.frecuenciaAlertas
      };

      console.log('📤 Enviando payload:', payload); // Para depuración en consola

      this.loading = true;
      this.loteService.crearLote(payload).subscribe({
        next: (res) => {
          this.toastr.success('Hacienda registrada y alertas configuradas', '¡Éxito!');
          this.loading = false;
          this.obtenerRecomendaciones(); // Cargar datos del clima
        },
        error: (err) => {
          console.error('🔥 Error Backend:', err);
          // Mostrar mensaje específico si el backend lo envía
          const msg = err.error?.error || 'Error al guardar la finca';
          this.toastr.error(msg, 'Error de Validación');
          this.loading = false;
        }
      });
    }

  // TU MÉTODO EXISTENTE (Se mantiene igual, para consultas manuales)
  obtenerRecomendaciones() {
    if (this.selectedLat == null || this.selectedLon == null) return;

    this.loading = true;
    this.error = null;
    this.recomendaciones = [];
    const cultivo = 'Maíz'; 

    this.climateService.obtenerRecomendacion(cultivo, this.selectedLat, this.selectedLon)
      .subscribe({
        next: (res: any) => {
          if (res.success && res.data && res.data.topRecomendaciones) {
            this.recomendaciones = res.data.topRecomendaciones;
          } else {
             this.error = 'No se encontraron recomendaciones válidas.';
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No se pudieron obtener recomendaciones.';
          this.loading = false;
        }
      });
  }

  generarEstrellas(cantidad: number): string {
    return '★'.repeat(cantidad) + '☆'.repeat(5 - cantidad);
  }
}