// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard'; // Ajustado

// Importa los componentes
import { LoginComponent } from './components/login/login'; // Ajustado
import { RegisterComponent } from './components/register/register'; // Ajustado
import { DashboardComponent } from './components/dashboard/dashboard'; // Ajustado

export const routes: Routes = [
  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Ruta privada
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] // <-- Aquí aplicamos la seguridad
  },

  // Redirecciones
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } 
];