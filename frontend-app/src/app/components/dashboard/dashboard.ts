import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations'; // Importa animaciones

// --- Importaciones de Angular Material ---
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// Importa el nuevo componente Lunar
import { LunarCalendarComponent } from '../lunar-calendar/lunar-calendar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    LunarCalendarComponent // Añade el componente lunar
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  // --- Define la animación de "stagger" (escalonado) ---
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // Cada vez que la lista cambia
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('0.5s cubic-bezier(0.25, 0.8, 0.25, 1)', 
              style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class DashboardComponent {
  
  // Lista de cultivos
  cultivos = [
    {
      nombre: 'Detección de banano',
      descripcion: 'Detecta enfermedades como el Sigatoka negra y el moko.',
      imagen: 'assets/images/banano.jpg', // Necesitarás crear esta carpeta y añadir imágenes
      icono: 'assets/icons/banana-icon.png'
    },
    {
      nombre: 'Detección de arroz',
      descripcion: 'Identifica problemas como el tizón del arroz o la mancha marrón.',
      imagen: 'assets/images/arroz.jpg',
      icono: 'assets/icons/rice-icon.png'
    },
    {
      nombre: 'Detección de café',
      descripcion: 'Diagnóstico de la roya del café y la antracnosis.',
      imagen: 'assets/images/cafe.jpg',
      icono: 'assets/icons/coffee-icon.png'
    }
  ];

  constructor() { }
}