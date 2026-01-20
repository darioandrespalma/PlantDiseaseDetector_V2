import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, OnInit, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // ✅ CAMBIO: Importar Router
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoteDialogComponent } from '../lote-dialog/lote-dialog';
import { LoteService } from '../../services/lote.service';
import { TaskService } from '../../services/task.service'; // ✅ CAMBIO: Importar TaskService
import { ToastrService } from 'ngx-toastr';
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
  templateUrl: './map-selector.html',
  styleUrls: ['./map-selector.css']
})
export class MapSelectorComponent implements AfterViewInit, OnInit {

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map: any;
  private marker: any;
  private markersGroup: any;
  private isBrowser: boolean;

  // Inyección de dependencias moderna (puedes usar constructor también)
  private taskService = inject(TaskService); // ✅ CAMBIO: Inyección TaskService
  private router = inject(Router); // ✅ CAMBIO: Inyección Router

  // Variables Filtro y Mapa
  provincias = PROVINCIAS;
  provinciaSeleccionada: any = null;

  // Variables Clima
  selectedLat: number | null = null;
  selectedLon: number | null = null;
  recomendaciones: Recomendacion[] = [];
  
  // Variables Gestión de Lotes
  misLotes: any[] = [];
  
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

  ngOnInit(): void {
    this.cargarMisLotes();
  }

  async ngAfterViewInit() {
    if (this.isBrowser) {
      const L = await import('leaflet');
      
      const DefaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
      });
      L.Marker.prototype.options.icon = DefaultIcon;

      this.initMap(L);
    }
  }

  // --- LÓGICA DE GESTIÓN DE LOTES ---

  cargarMisLotes() {
    this.loading = true;
    this.loteService.obtenerLotes().subscribe({
      next: (res: any) => {
        this.misLotes = res.data || [];
        this.loading = false;
        if (this.map) {
          this.pintarLotesEnMapa();
        }
      },
      error: (err) => {
        console.error('Error cargando lotes:', err);
        this.loading = false;
      }
    });
  }

  borrarLote(id: string) {
    if (confirm('¿Estás seguro de eliminar esta finca y sus datos históricos?')) {
      this.loteService.eliminarLote(id).subscribe({
        next: () => {
          this.toastr.info('Finca eliminada correctamente');
          this.cargarMisLotes();
        },
        error: () => this.toastr.error('No se pudo eliminar la finca')
      });
    }
  }

  // ✅ CAMBIO IMPORTANTE: Lógica corregida para crear Tarea en lugar de usar API antigua
  convertirEnTarea(lote: any, recomendacion?: any) {
    // 1. Determinar mensaje y tipo
    const titulo = recomendacion 
      ? `Tarea Sugerida: ${recomendacion.accionSugerida || 'Acción Requerida'}`
      : `Riego Sugerido - ${lote.nombre}`;
      
    const notas = recomendacion 
      ? `Recomendación basada en clima: ${recomendacion.mensaje}`
      : 'Tarea generada automáticamente desde el asistente del mapa.';

    // 2. Preparar objeto Tarea
    const nuevaTarea = {
      titulo: titulo,
      tipo: 'Riego', // Puedes hacer lógica para cambiar esto según la recomendación
      fechaProgramada: new Date().toISOString().split('T')[0], // Para hoy
      loteId: lote._id,
      notas: notas
    };

    this.loading = true;

    // 3. Llamar al TaskService
    this.taskService.createTask(nuevaTarea).subscribe({
      next: () => {
        this.loading = false;
        this.toastr.success('✅ Tarea creada en tu agenda', 'Agenda Actualizada');
        
        // Opcional: Llevar al usuario a ver su agenda
        if(confirm('Tarea creada. ¿Quieres ir a tu agenda ahora?')) {
            this.router.navigate(['/tareas']);
        }
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        this.toastr.error('Error al crear la tarea automática', 'Error');
      }
    });
  }

  // --- LÓGICA DEL MAPA (Sin cambios mayores) ---

  private async initMap(L: any) {
    this.map = L.map(this.mapContainer.nativeElement).setView([-1.8312, -78.1834], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.markersGroup = L.layerGroup().addTo(this.map);
    this.pintarLotesEnMapa();

    this.map.on('click', (event: any) => {
      const { lat, lng } = event.latlng;
      this.selectedLat = lat;
      this.selectedLon = lng;
      
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      } else {
        this.marker = L.marker([lat, lng]).addTo(this.map);
      }

      this.abrirDialogoRegistro(lat, lng);
    });
  }

  async pintarLotesEnMapa() {
    if (!this.map || !this.markersGroup) return;
    
    const L = await import('leaflet');
    this.markersGroup.clearLayers();

    const FarmIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    this.misLotes.forEach(lote => {
      if (lote.ubicacion && lote.ubicacion.lat) {
        L.marker([lote.ubicacion.lat, lote.ubicacion.lon], { icon: FarmIcon })
          .addTo(this.markersGroup)
          .bindPopup(`<b>${lote.nombre}</b><br>Cultivo: ${lote.cultivo?.nombre}<br>Estado: ${lote.estadoSalud}`);
      }
    });
  }

  irAProvincia() {
    if (this.provinciaSeleccionada && this.map) {
      this.map.flyTo(
        [this.provinciaSeleccionada.lat, this.provinciaSeleccionada.lon], 
        10, 
        { duration: 1.5 }
      );
    }
  }

  // --- LÓGICA DE REGISTRO ---

  abrirDialogoRegistro(lat: number, lon: number) {
    const dialogRef = this.dialog.open(LoteDialogComponent, {
      width: '450px',
      data: { lat, lon },
      disableClose: true 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.guardarFinca(result, lat, lon);
      } else {
        this.toastr.info('Modo consulta activado. Ver resultados abajo.', 'Sin Guardar');
        this.obtenerRecomendacionesManuales();
      }
    });
  }

  guardarFinca(formData: any, lat: number, lon: number) {
    const payload = {
      nombre: formData.nombre,
      cultivoId: formData.cultivoId,
      lat: lat,
      lon: lon,
      alertasActivas: formData.alertasActivas,
      frecuenciaAlertas: formData.frecuenciaAlertas
    };

    this.loading = true;
    this.loteService.crearLote(payload).subscribe({
      next: (res) => {
        this.toastr.success('Finca registrada correctamente', '¡Éxito!');
        this.loading = false;
        this.cargarMisLotes();
        this.obtenerRecomendacionesManuales();
      },
      error: (err) => {
        console.error('Error Backend:', err);
        const msg = err.error?.error || 'Error al guardar la finca';
        this.toastr.error(msg, 'Error');
        this.loading = false;
      }
    });
  }

  // --- LÓGICA DE CONSULTA MANUAL ---
  
  obtenerRecomendaciones() {
    this.obtenerRecomendacionesManuales();
  }

  obtenerRecomendacionesManuales() {
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
          this.error = 'No se pudo obtener el clima.';
          this.loading = false;
        }
      });
  }

  generarEstrellas(cantidad: number): string {
    return '★'.repeat(cantidad) + '☆'.repeat(5 - cantidad);
  }
}