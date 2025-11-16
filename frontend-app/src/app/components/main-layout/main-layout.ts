import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../../services/auth';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

// Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

// Componentes propios

import { ThemeService } from '../../services/theme';

// Animaciones
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css'],
  animations: [
    trigger('sidenavAnimation', [
      transition(':enter', [
        style({ width: 0, opacity: 0 }),
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ width: '250px', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)', 
          style({ width: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  isSidenavCollapsed = false;
  userName = 'Agricultor';
  currentRoute = '';
  
  menuItems = [
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { name: 'Mi Finca', icon: 'agriculture', route: '/finca' },
    { name: 'Tareas', icon: 'task_alt', route: '/tareas' },
    { name: 'Recomendaciones', icon: 'lightbulb_outline', route: '/reco' },
    { name: 'Boletín', icon: 'campaign', route: '/boletin' },
    { name: 'Biblioteca', icon: 'library_books', route: '/biblioteca' },
  ];

  private destroy$ = new Subject<void>();
  private _mobileQueryListener: () => void;

  constructor(
    private router: Router,
    private authService: AuthService,
    public theme: ThemeService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    
    if (isPlatformBrowser(this.platformId)) {
      this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }

    // Sincronizar colapsado desde localStorage
    if (isPlatformBrowser(this.platformId)) {
      this.isSidenavCollapsed = JSON.parse(localStorage.getItem('sidenavCollapsed') || 'false');
    }
  }

  ngOnInit() {
    // Cargar nombre de usuario
    if (isPlatformBrowser(this.platformId)) {
      this.userName = localStorage.getItem('userName') || 'Agricultor';
    }

    // Detectar ruta actual
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidenav(): void {
    this.isSidenavCollapsed = !this.isSidenavCollapsed;
    
    // Guardar preferencia
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('sidenavCollapsed', JSON.stringify(this.isSidenavCollapsed));
    }
  }

  logout(): void {
    this.authService.logout();
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }

  isActive(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }
}