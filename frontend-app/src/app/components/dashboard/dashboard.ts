import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

// Componentes propios
import { LunarCalendarComponent } from '../lunar-calendar/lunar-calendar';
import { ThemeService } from '../../services/theme';

// Animaciones
import { trigger, stagger, animate, style, query, transition } from '@angular/animations';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    LunarCalendarComponent
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  animations: [
    trigger('staggerCards', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(150, [
            animate('600ms cubic-bezier(0.35, 0, 0.25, 1)', 
              style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {
  cultivos = [
    {
      nombre: 'Detección de Banano',
      descripcion: 'Detecta enfermedades como Sigatoka negra, moko y más con IA.',
      imagen: 'banana.svg',
      color: '--color-sowing',
      icon: 'agriculture'
    },
    {
      nombre: 'Detección de Arroz',
      descripcion: 'Identifica tizón, mancha marrón y otros problemas foliares.',
      imagen: 'arroz.svg',
      color: '--color-harvest',
      icon: 'eco'
    },
    {
      nombre: 'Detección de Café',
      descripcion: 'Diagnóstico preciso de roya, antracnosis y minadores.',
      imagen: 'Cafe.svg',
      color: '--color-rest',
      icon: 'grain'
    }
  ];

  userName = 'Agricultor';
  currentDate = new Date();
  private destroy$ = new Subject<void>();

  constructor(public theme: ThemeService) {}

  slugify(nombre: string): string {
    return nombre.toLowerCase().replace(/\s+/g, '-');
  }

  ngOnInit() {
    // Cargar nombre del usuario desde localStorage
    if (typeof window !== 'undefined') {
      this.userName = localStorage.getItem('userName') || 'Agricultor';
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}