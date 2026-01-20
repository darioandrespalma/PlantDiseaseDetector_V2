import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  // Datos
  lotes = signal<any[]>([]);
  tareas = signal<any[]>([]);
  
  // Filtros y Formulario
  selectedLoteFilter = 'todos';
  titulo = '';
  tipo = 'Riego';
  fecha = '';
  selectedLoteForm = '';

  // Calendario
  hoy = new Date();
  mes = this.hoy.getMonth();
  anio = this.hoy.getFullYear();
  
  tipos = ['Riego', 'Fertilizacion', 'Siembra', 'Cosecha', 'Poda', 'Monitoreo'];
  
  // NOTA: El orden debe coincidir con getDay() de JS (0=Dom, 1=Lun...)
  diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']; 

  ngOnInit() {
    this.cargarLotes();
    this.cargarTareas();
    this.fecha = new Date().toISOString().split('T')[0];
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
      notas: ''
    };

    this.taskService.createTask(nuevaTarea).subscribe({
      next: (task) => {
        this.titulo = '';
        this.cargarTareas();
      },
      error: () => alert('Error al crear tarea')
    });
  }

  // --- Lógica del Calendario (CORREGIDA) ---

  tareasDelDia(dia: number) {
    return this.tareas().filter(t => {
      // Convertir la fecha de la BD a un objeto Date
      const fechaTarea = new Date(t.fechaProgramada);
      
      // Ajustar la fecha del calendario
      // Importante: Usamos UTC para asegurar coincidencia si el backend guarda en UTC
      // O usamos comparacion local si queremos ser estrictos con la vista del usuario
      
      // MÉTODO SEGURO: Comparar Strings YYYY-MM-DD locales
      const fechaCalendario = new Date(this.anio, this.mes, dia);
      
      // Extraemos solo la parte de la fecha (sin horas) para comparar
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

  // CORREGIDO: Genera un array iterable para evitar error NG0900
  espaciosVacios(): any[] {
    const primerDiaIndex = new Date(this.anio, this.mes, 1).getDay(); // 0 = Domingo
    return new Array(primerDiaIndex).fill(0); // [0,0,0...] iterable
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
      'Poda': 'bg-red-100 text-red-700 border-red-200'
    };
    return map[tipo] || 'bg-gray-100 text-gray-700 border-gray-200';
  }
}