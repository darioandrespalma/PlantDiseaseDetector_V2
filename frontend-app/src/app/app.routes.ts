import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

// Importa los componentes
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { MainLayoutComponent } from './components/main-layout/main-layout';
import { DashboardComponent } from './components/dashboard/dashboard';
import { FincaComponent } from './components/finca/finca';
import { TareasComponent } from './components/tareas/tareas';
import { DetectionComponent } from './components/detection/detection';
import { ResultComponent } from './components/result/result';

export const routes: Routes = [
  // Rutas públicas
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rutas privadas
  { 
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'finca', component: FincaComponent },
      { path: 'tareas', component: TareasComponent },
      
      // FLUJO DE DETECCIÓN
      { path: 'deteccion/:crop', component: DetectionComponent },
      { path: 'result/:id', component: ResultComponent },
      
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/login' }
];