import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { MainLayoutComponent } from './components/main-layout/main-layout';
import { DashboardComponent } from './components/dashboard/dashboard';
import { FincaComponent } from './components/finca/finca';
import { TareasComponent } from './components/tareas/tareas';
import { DetectionComponent } from './components/detection/detection';
import { ResultComponent } from './components/result/result';
import { RecomendacionComponent } from './components/recomendacion/recomendacion';
import { MapSelectorComponent } from './components/map-selector/map-selector';
import { BibliotecaComponent } from './components/biblioteca/biblioteca';


export const routes: Routes = [
  // RUTAS PÚBLICAS (Sin Guard)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // RUTAS PRIVADAS (Protegidas por authGuard)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'finca', component: FincaComponent },
      { path: 'tareas', component: TareasComponent },
      { path: 'deteccion/:crop', component: DetectionComponent },
      { path: 'result/:id', component: ResultComponent },

      // ya tenías:
      { path: 'recomendaciones', component: RecomendacionComponent },

      // ✨ NUEVA RUTA DEL MAPA
      { path: 'mapa', component: MapSelectorComponent },
      { path: 'biblioteca', component: BibliotecaComponent },

      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/login' }
];
