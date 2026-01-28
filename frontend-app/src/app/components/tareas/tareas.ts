import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { LoteService } from '../../services/lote.service';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas.html',
  styleUrls: ['./tareas.css']
})
export class TareasComponent implements OnInit {
  private taskService = inject(TaskService);
  private loteService = inject(LoteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Datos
  lotes = signal<any[]>([]);
  tareas = signal<any[]>([]);
  
  // Filtros y Formulario
  selectedLoteFilter = 'todos';
  titulo = '';
  tipo = 'Riego';
  fecha = '';
  selectedLoteForm = '';
  notas = ''; // Nuevo campo para las notas de IA

  // Calendario
  hoy = new Date();
  mes = this.hoy.getMonth();
  anio = this.hoy.getFullYear();
  
  // Agregamos 'Sanidad' para tratamientos de enfermedades
  tipos = ['Riego', 'Fertilizacion', 'Siembra', 'Cosecha', 'Poda', 'Monitoreo', 'Sanidad'];
  
  ngOnInit() {
    this.cargarLotes();
    this.cargarTareas();
    
    // Lógica de Autocompletado desde Detección
    this.route.queryParams.subscribe(params => {
      if (params['autoFill'] === 'true') {
        console.log('🤖 Autocompletando tarea desde IA...');
        
        if (params['titulo']) this.titulo = params['titulo'];
        if (params['fecha']) this.fecha = params['fecha'];
        if (params['notas']) this.notas = params['notas'];
        if (params['loteId']) this.selectedLoteForm = params['loteId'];
        
        // Verificar si el tipo enviado existe en nuestra lista
        if (params['tipo'] && this.tipos.includes(params['tipo'])) {
          this.tipo = params['tipo'];
        } else {
          this.tipo = 'Sanidad'; // Default para enfermedades
        }

        // Scroll suave hacia el formulario para que el usuario vea la acción
        setTimeout(() => {
          document.querySelector('.new-task-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
      } else {
        // Default si no viene de la IA
        this.fecha = new Date().toISOString().split('T')[0];
      }
    });
  }

  cargarLotes() {
    this.loteService.obtenerLotes().subscribe({
      next: (res: any) => this.lotes.set(res.data || []),
      error: (err) => console.error(err)
    });
  }

  cargarTareas() {
    const filtros = {
      loteId: this.selectedLoteFilter,
      mes: this.mes,
      anio: this.anio
    };
    
    this.taskService.getTasks(filtros).subscribe({
      next: (data) => this.tareas.set(data),
      error: (e) => console.error(e)
    });
  }

  crearTarea() {
    if (!this.titulo || !this.fecha) return;

    const nuevaTarea = {
      titulo: this.titulo,
      tipo: this.tipo,
      fechaProgramada: this.fecha,
      loteId: this.selectedLoteForm || null,
      notas: this.notas // Enviamos las notas
    };

    this.taskService.createTask(nuevaTarea).subscribe({
      next: (task) => {
        this.titulo = '';
        this.notas = ''; // Limpiamos notas
        this.cargarTareas();
        
        // Limpiamos la URL para evitar re-llenado al refrescar
        this.router.navigate([], { queryParams: {} });
      },
      error: () => alert('Error al crear tarea')
    });
  }

  // --- Lógica del Calendario ---

  tareasDelDia(dia: number) {
    return this.tareas().filter(t => {
      const fechaTarea = new Date(t.fechaProgramada);
      const fechaCalendario = new Date(this.anio, this.mes, dia);
      
      const strTarea = new Date(fechaTarea.getFullYear(), fechaTarea.getMonth(), fechaTarea.getDate()).toDateString();
      const strCal = fechaCalendario.toDateString();

      return strTarea === strCal;
    });
  }
  
  cambiarEstado(tarea: any, event: Event) {
    event.stopPropagation(); 
    const nuevoEstado = tarea.estado === 'Completada' ? 'Pendiente' : 'Completada';
    
    this.tareas.update(prev => prev.map(t => 
        t._id === tarea._id ? { ...t, estado: nuevoEstado } : t
    ));

    this.taskService.updateTask(tarea._id, { estado: nuevoEstado }).subscribe();
  }

  cambiarMes(delta: number) {
    this.mes += delta;
    if (this.mes < 0) { this.mes = 11; this.anio--; }
    else if (this.mes > 11) { this.mes = 0; this.anio++; }
    this.cargarTareas();
  }

  diasDelMes(): number[] {
    return Array.from({ length: new Date(this.anio, this.mes + 1, 0).getDate() }, (_, i) => i + 1);
  }

  espaciosVacios(): any[] {
    const primerDiaIndex = new Date(this.anio, this.mes, 1).getDay(); // 0 = Domingo
    return new Array(primerDiaIndex).fill(0);
  }
  
  nombreMes() {
    return new Date(this.anio, this.mes, 1).toLocaleDateString('es-EC', { month: 'long', year: 'numeric' });
  }

  faseLunar(dia: number) { 
    return '🌑'; 
  }

  getColorClase(tipo: string): string {
    const map: any = {
      'Riego': 'bg-blue-100 text-blue-700 border-blue-200',
      'Fertilizacion': 'bg-amber-100 text-amber-700 border-amber-200',
      'Siembra': 'bg-green-100 text-green-700 border-green-200',
      'Cosecha': 'bg-orange-100 text-orange-700 border-orange-200',
      'Poda': 'bg-red-100 text-red-700 border-red-200',
      'Sanidad': 'bg-rose-100 text-rose-700 border-rose-200', // Color nuevo para Sanidad
      'Monitoreo': 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return map[tipo] || 'bg-gray-100 text-gray-700 border-gray-200';
  }
}