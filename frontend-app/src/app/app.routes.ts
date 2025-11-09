import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

// Importa los componentes de layout y páginas
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { MainLayoutComponent } from './components/main-layout/main-layout';
import { DashboardComponent } from './components/dashboard/dashboard';
import { FincaComponent } from './components/finca/finca';
import { TareasComponent } from './components/tareas/tareas';

export const routes: Routes = [
  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // --- NUEVA ESTRUCTURA DE RUTA PRIVADA ---
  { 
    path: '', // La raíz de la app protegida
    component: MainLayoutComponent, // Carga el "Shell" con el menú
    canActivate: [authGuard], // Protege este layout y todos sus hijos
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'finca', component: FincaComponent },
      { path: 'tareas', component: TareasComponent },
      // ... (Aquí irán las otras rutas: recomendaciones, boletin, etc.)
      
      // Redirección por defecto al entrar al layout
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  },

  // Redirección final si ninguna ruta coincide
  { path: '**', redirectTo: '/login' }
];