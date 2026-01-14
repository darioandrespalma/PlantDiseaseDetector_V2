import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type TipoTarea = 'Riego' | 'Fertilización' | 'Siembra' | 'Cosecha' | 'Poda';

interface Tarea {
  titulo: string;
  tipo: TipoTarea;
  fecha: string; // YYYY-MM-DD
  completada: boolean;
}



@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tareas.html',
  styleUrl: './tareas.css',

})
export class TareasComponent {

  constructor() {
  const saved = localStorage.getItem('tareas');
  this.tareas = saved ? JSON.parse(saved) : [];
}
  // -----------------------
  // Datos
  // -----------------------
  tipos: TipoTarea[] = ['Riego', 'Fertilización', 'Siembra', 'Cosecha', 'Poda'];
  tareas: Tarea[] = [];

  // formulario
  titulo = '';
  tipo: TipoTarea = 'Riego';
  fecha = '';

  // calendario
  hoy = new Date();
  mes = this.hoy.getMonth();
  anio = this.hoy.getFullYear();

  // -----------------------
  // Crear tarea
  // -----------------------
  crearTarea() {
    
    if (!this.titulo || !this.fecha) return;

    const nueva: Tarea = {
      titulo: this.titulo,
      tipo: this.tipo,
      fecha: this.fecha,
      completada: false,
    };

    this.tareas.push(nueva);

    localStorage.setItem('tareas', JSON.stringify(this.tareas));

    // 👉 SUGERENCIA LUNAR (solo para siembra)
    if (this.tipo === 'Siembra') {
      const sugerida = this.buscarProximaLunaCreciente(new Date(this.fecha));
      alert(
        `🌙 Sugerencia: La Luna Creciente empieza el ${sugerida.toLocaleDateString()}.\nMejor programa la siembra para ese día.`
      );
    }

    this.titulo = '';
    this.fecha = '';
  }

  // -----------------------
  // Tareas por día
  // -----------------------
  tareasDelDia(dia: number) {
    const fecha = `${this.anio}-${String(this.mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    return this.tareas.filter(t => t.fecha === fecha);
  }

  // -----------------------
  // FASE LUNAR (simple y suficiente para la clase)
  // -----------------------
  faseLunar(dia: number): string {
    const date = new Date(this.anio, this.mes, dia);
    const ciclo = 29.53;
    const base = new Date(2000, 0, 6);
    const diff = (date.getTime() - base.getTime()) / (1000 * 60 * 60 * 24);
    const fase = diff % ciclo;

    if (fase < 7) return '🌑';
    if (fase < 14) return '🌓';
    if (fase < 21) return '🌕';
    return '🌗';
  }

  buscarProximaLunaCreciente(desde: Date): Date {
    let d = new Date(desde);
    for (let i = 0; i < 30; i++) {
      d.setDate(d.getDate() + 1);
      const icono = this.faseLunar(d.getDate());
      if (icono === '🌓') return d;
    }
    return d;
  }

  // -----------------------
  // Días del mes
  // -----------------------
  diasDelMes(): number[] {
    return Array.from(
      { length: new Date(this.anio, this.mes + 1, 0).getDate() },
      (_, i) => i + 1
    );
  }

  nombreMes() {
  return new Date(this.anio, this.mes, 1).toLocaleDateString('es-EC', { month: 'long', year: 'numeric' });
  }

  mesAnterior() {
    if (this.mes === 0) { this.mes = 11; this.anio--; }
    else this.mes--;
  }

  mesSiguiente() {
    if (this.mes === 11) { this.mes = 0; this.anio++; }
    else this.mes++;
  }

}
