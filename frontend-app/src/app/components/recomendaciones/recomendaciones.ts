import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Tema = 'Fertilización' | 'Plagas' | 'Riego';
type Cultivo = 'Banano' | 'Arroz' | 'Maíz' | 'Papa';

interface Recomendacion {
  cultivo: Cultivo;
  tema: Tema;
  titulo: string;
  detalle: string;
}

@Component({
  selector: 'app-recomendaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recomendaciones.html',
  styleUrl: './recomendaciones.css',
})
export class RecomendacionesComponent {
  cultivos: (Cultivo | 'Todos')[] = ['Todos', 'Banano', 'Arroz', 'Maíz', 'Papa'];
  temas: (Tema | 'Todos')[] = ['Todos', 'Fertilización', 'Plagas', 'Riego'];

  cultivoSel: Cultivo | 'Todos' = 'Todos';
  temaSel: Tema | 'Todos' = 'Todos';

  base: Recomendacion[] = [
    {
      cultivo: 'Banano',
      tema: 'Fertilización',
      titulo: 'Fertilización en floración',
      detalle: 'Usar NPK 10-30-10 en etapa de floración. Ajustar dosis según análisis de suelo.',
    },
    {
      cultivo: 'Banano',
      tema: 'Plagas',
      titulo: 'Manejo preventivo de Sigatoka',
      detalle: 'Monitoreo semanal, deshoje sanitario y rotación de ingredientes activos.',
    },
    {
      cultivo: 'Arroz',
      tema: 'Riego',
      titulo: 'Riego por lámina',
      detalle: 'Mantener lámina controlada evitando encharcamientos prolongados en etapas tempranas.',
    },
    {
      cultivo: 'Maíz',
      tema: 'Fertilización',
      titulo: 'Fertilización de arranque',
      detalle: 'Aplicar fósforo al inicio para favorecer desarrollo radicular.',
    },
    {
      cultivo: 'Papa',
      tema: 'Plagas',
      titulo: 'Control de polilla',
      detalle: 'Uso de trampas, manejo de almacenamiento y control integrado.',
    },
  ];

  get filtradas() {
    return this.base.filter((r) => {
      const okCultivo = this.cultivoSel === 'Todos' ? true : r.cultivo === this.cultivoSel;
      const okTema = this.temaSel === 'Todos' ? true : r.tema === this.temaSel;
      return okCultivo && okTema;
    });
  }
}
