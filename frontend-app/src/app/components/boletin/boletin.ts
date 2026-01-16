import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Severidad = 'crítica' | 'alta' | 'media' | 'baja';

interface Alerta {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string; // 'Plaga', 'Enfermedad', 'Evento Climático', 'Aviso General'
  provincia: string;
  fecha: Date;
  severidad: Severidad;
  esLangosta?: boolean; // Indicador especial para plagas de langosta
}

@Component({
  selector: 'app-boletin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './boletin.html',
  styleUrl: './boletin.css',
})
export class BoletinComponent implements OnInit {
  // Provincia del usuario (en un escenario real, vendría del servicio de auth)
  provinciaUsuario: string = 'Manabí';

  // Lista de todas las alertas
  todasLasAlertas: Alerta[] = [];

  // Alertas filtradas
  alertasFiltradasYOrdenadas: Alerta[] = [];

  // Filtros
  tipoSeleccionado: string = 'Todos';
  severidadSeleccionada: string = 'Todos';
  provinciaSeleccionada: string = 'Todos';

  // Opciones de filtro
  tipos: string[] = ['Todos', 'Plaga', 'Enfermedad', 'Evento Climático', 'Aviso General'];
  severidades: string[] = ['Todos', 'crítica', 'alta', 'media', 'baja'];
  provincias: string[] = [
    'Todos',
    'Azogues',
    'Cuenca',
    'Azuay',
    'Cotopaxi',
    'Imbabura',
    'Tungurahua',
    'Manabí',
    'Santo Domingo',
    'Los Ríos',
    'Guayas',
    'Santa Elena',
    'Pichincha',
    'Morona Santiago',
    'Zamora Chinchipe',
    'Napo',
    'Orellana',
    'Sucumbíos',
  ];

  ngOnInit() {
    this.cargarAlertas();
    this.aplicarFiltros();
  }

  cargarAlertas() {
    // Datos simulados de alertas
    this.todasLasAlertas = [
      {
        id: 1,
        titulo: 'Alerta de Langosta en Manabí',
        descripcion:
          'Se han reportado focos de langosta en las provincias de Manabí y Los Ríos. Se recomienda monitoreo constante y aplicación de medidas de control integrado.',
        tipo: 'Plaga',
        provincia: 'Manabí',
        fecha: new Date('2025-01-15'),
        severidad: 'crítica',
        esLangosta: true,
      },
      {
        id: 2,
        titulo: 'Brote de Sigatoka Negra en Guayas',
        descripcion:
          'Se ha detectado aumento de casos de Sigatoka Negra en plantaciones de banano. Incrementar deshoje sanitario y monitoreo.',
        tipo: 'Enfermedad',
        provincia: 'Guayas',
        fecha: new Date('2025-01-14'),
        severidad: 'alta',
      },
      {
        id: 3,
        titulo: 'Sequía moderada esperada',
        descripcion:
          'Pronóstico indica período de escasas precipitaciones en la región interandina. Planificar sistemas de riego.',
        tipo: 'Evento Climático',
        provincia: 'Pichincha',
        fecha: new Date('2025-01-13'),
        severidad: 'media',
      },
      {
        id: 4,
        titulo: 'Control de Polilla de la Papa',
        descripcion:
          'Aumento de poblaciones de polilla de la papa (Phthorimaea operculella) en zonas productoras. Usar trampas de feromona.',
        tipo: 'Plaga',
        provincia: 'Tungurahua',
        fecha: new Date('2025-01-12'),
        severidad: 'alta',
      },
      {
        id: 5,
        titulo: 'Roya de la Soya en Los Ríos',
        descripcion:
          'Confirmados casos de roya del cultivo de soya. Iniciar tratamiento preventivo en lotes vulnerables.',
        tipo: 'Enfermedad',
        provincia: 'Los Ríos',
        fecha: new Date('2025-01-11'),
        severidad: 'media',
      },
      {
        id: 6,
        titulo: 'Aviso: Nuevas regulaciones de pesticidas',
        descripcion:
          'El MAGAP ha establecido nuevas restricciones en el uso de ciertos pesticidas. Consultar lista actualizada.',
        tipo: 'Aviso General',
        provincia: 'Todos',
        fecha: new Date('2025-01-10'),
        severidad: 'baja',
      },
      {
        id: 7,
        titulo: 'Lluvia torrencial esperada en Azuay',
        descripcion:
          'Sistema de baja presión traerá lluvias intensas. Asegurar drenaje en cultivos sensibles.',
        tipo: 'Evento Climático',
        provincia: 'Azuay',
        fecha: new Date('2025-01-09'),
        severidad: 'media',
      },
      {
        id: 8,
        titulo: 'Mosca de la Fruta en Manabí',
        descripcion:
          'Detección de Anastrepha spp. en frutas. Implementar mallas y atrayentes.Aler',
        tipo: 'Plaga',
        provincia: 'Manabí',
        fecha: new Date('2025-01-08'),
        severidad: 'alta',
      },
    ];
  }

  aplicarFiltros() {
    let alertasFiltradas = this.todasLasAlertas;

    // Filtrar por tipo
    if (this.tipoSeleccionado !== 'Todos') {
      alertasFiltradas = alertasFiltradas.filter(a => a.tipo === this.tipoSeleccionado);
    }

    // Filtrar por severidad
    if (this.severidadSeleccionada !== 'Todos') {
      alertasFiltradas = alertasFiltradas.filter(
        a => a.severidad === this.severidadSeleccionada
      );
    }

    // Filtrar por provincia
    if (this.provinciaSeleccionada !== 'Todos') {
      alertasFiltradas = alertasFiltradas.filter(
        a => a.provincia === this.provinciaSeleccionada || a.provincia === 'Todos'
      );
    }

    // Ordenar: Primero langostas críticas en provincia del usuario, luego cronológico descendente
    this.alertasFiltradasYOrdenadas = alertasFiltradas.sort((a, b) => {
      // Prioridad 1: Langosta en provincia del usuario (crítica)
      const aEsLangostaCrítica = a.esLangosta && a.provincia === this.provinciaUsuario;
      const bEsLangostaCrítica = b.esLangosta && b.provincia === this.provinciaUsuario;

      if (aEsLangostaCrítica && !bEsLangostaCrítica) return -1;
      if (!aEsLangostaCrítica && bEsLangostaCrítica) return 1;

      // Prioridad 2: Orden cronológico descendente (más recientes primero)
      return b.fecha.getTime() - a.fecha.getTime();
    });
  }

  onFiltroChange() {
    this.aplicarFiltros();
  }

  getColorSeveridad(severidad: Severidad): string {
    switch (severidad) {
      case 'crítica':
        return '#d32f2f';
      case 'alta':
        return '#f57c00';
      case 'media':
        return '#f9a825';
      case 'baja':
        return '#689f38';
      default:
        return '#757575';
    }
  }

  getColorTipo(tipo: string): string {
    switch (tipo) {
      case 'Plaga':
        return '#e91e63';
      case 'Enfermedad':
        return '#9c27b0';
      case 'Evento Climático':
        return '#2196f3';
      case 'Aviso General':
        return '#4caf50';
      default:
        return '#757575';
    }
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-EC', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
