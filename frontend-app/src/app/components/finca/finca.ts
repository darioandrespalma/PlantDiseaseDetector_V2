import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FincaService, Lote } from '../../services/finca.service';
import { ClimateService } from '../../services/climate'; // Para listar cultivos en el select

@Component({
  selector: 'app-finca',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './finca.html',
  styleUrls: ['./finca.css']
})
export class FincaComponent implements OnInit {
  private fincaService = inject(FincaService);
  private climateService = inject(ClimateService);

  // Estados
  lotes: Lote[] = [];
  cultivosDisponibles: any[] = [];
  loading = false;

  // Modales
  mostrarModalNuevo = false;
  mostrarModalHistorial = false;

  // Objetos temporales para formularios
  nuevoLote: Partial<Lote> = {
    nombre: '',
    cultivo: '',
    fechaSiembra: new Date(),
    area: 0
  };

  loteSeleccionado: Lote | null = null;
  nuevoEvento = {
    tipo: 'nota',
    titulo: '',
    descripcion: ''
  };

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;
    
    // 1. Cargar Lotes
    this.fincaService.obtenerLotes().subscribe({
      next: (res) => {
        this.lotes = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });

    // 2. Cargar Cultivos para el select
    this.climateService.obtenerCultivos().subscribe({
      next: (res) => {
        if(res.data && res.data.cultivos) {
          this.cultivosDisponibles = res.data.cultivos;
        }
      }
    });
  }

  // --- CRUD LOTES ---
  guardarLote() {
    // Validación básica
    if (!this.nuevoLote.nombre || !this.nuevoLote.cultivo) return;

    // Asignar usuario temporalmente (si no tienes auth interceptor funcionando)
    // const payload = { ...this.nuevoLote, usuario: 'ID_DE_PRUEBA_SI_FALLA_AUTH' }; 
    
    this.fincaService.crearLote(this.nuevoLote).subscribe({
      next: () => {
        this.cerrarModales();
        this.cargarDatos();
        // Reset form
        this.nuevoLote = { nombre: '', fechaSiembra: new Date(), area: 0 };
      },
      error: (err) => alert('Error creando lote: ' + err.message)
    });
  }

  eliminarLote(id: string | undefined) {
    if (!id || !confirm('¿Estás seguro de eliminar este lote?')) return;
    
    this.fincaService.eliminarLote(id).subscribe({
      next: () => this.cargarDatos()
    });
  }

  // --- HISTORIAL ---
  abrirHistorial(lote: Lote) {
    this.loteSeleccionado = lote;
    this.mostrarModalHistorial = true;
  }

  agregarNota() {
    if (!this.loteSeleccionado?._id) return;

    this.fincaService.agregarEvento(this.loteSeleccionado._id, this.nuevoEvento).subscribe({
      next: (res) => {
        // Actualizar el lote localmente con la respuesta del servidor (que trae el nuevo semáforo)
        if (this.loteSeleccionado) {
          this.loteSeleccionado.historial = res.data.historial;
          this.loteSeleccionado.estadoSalud = res.data.estadoSalud;
          
          // Actualizar en la lista general también
          const index = this.lotes.findIndex(l => l._id === res.data._id);
          if (index !== -1) this.lotes[index] = res.data;
        }
        
        // Reset evento form
        this.nuevoEvento = { tipo: 'nota', titulo: '', descripcion: '' };
      }
    });
  }

  // --- UI HELPERS ---
  cerrarModales() {
    this.mostrarModalNuevo = false;
    this.mostrarModalHistorial = false;
    this.loteSeleccionado = null;
  }
  getCultivoIcono(nombreCultivo: string): string {
    const nombre = nombreCultivo?.toLowerCase() || '';
    if (nombre.includes('maíz') || nombre.includes('maiz')) return 'corn';
    if (nombre.includes('tomate')) return 'nutrition'; // Material icon name
    if (nombre.includes('papa')) return 'eco';
    if (nombre.includes('arroz')) return 'grass';
    if (nombre.includes('cafe') || nombre.includes('café')) return 'local_cafe';
    if (nombre.includes('frijol')) return 'spa';
    return 'agriculture'; // Default icon
  }

  getSemaforoColor(estado: string): string {
      switch (estado) {
        case 'saludable': return 'status-success';
        case 'riesgo': return 'status-warning';
        case 'peligro': return 'status-danger';
        default: return 'status-neutral';
      }
  }

  getSemaforoTexto(estado: string): string {
    switch (estado) {
      case 'saludable': return 'Saludable';
      case 'riesgo': return 'Riesgo Detectado';
      case 'peligro': return 'Atención Urgente';
      default: return 'Desconocido';
    }
  }
}

