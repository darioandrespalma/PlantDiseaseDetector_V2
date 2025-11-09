import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from '../../services/auth';
import { filter } from 'rxjs';

// --- Importaciones de Angular Material ---
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  styleUrls: ['./main-layout.css']
})
export class MainLayoutComponent implements OnDestroy {
  mobileQuery: MediaQueryList;
  isSidenavCollapsed = false;
  userName = 'Usuario'; // Lo cargaremos
  
  // Lista de items del menú
  menuItems = [
    { name: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { name: 'Mi Finca', icon: 'agriculture', route: '/finca' },
    { name: 'Tareas', icon: 'calendar_today', route: '/tareas' },
    { name: 'Recomendaciones', icon: 'lightbulb_outline', route: '/reco' },
    { name: 'Boletín', icon: 'campaign', route: '/boletin' },
    { name: 'Biblioteca', icon: 'library_books', route: '/biblioteca' },
  ];

  private _mobileQueryListener: () => void;

  constructor(
    private router: Router,
    private authService: AuthService,
    changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    // Cargar nombre de usuario
    // (Asegúrate de haber guardado 'username' en el localStorage durante el login)
    // this.userName = this.authService.getUserName(); // Necesitarás crear esta función
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}