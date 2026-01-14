import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { MainLayoutComponent } from './components/main-layout/main-layout';
import { DashboardComponent } from './components/dashboard/dashboard';
import { FincaComponent } from './components/finca/finca';
import { DetectionComponent } from './components/detection/detection';
import { ResultComponent } from './components/result/result';
import { MapSelectorComponent } from './components/map-selector/map-selector';
import { BibliotecaComponent } from './components/biblioteca/biblioteca';

import { TareasComponent } from './pages/tareas/tareas';
import { RecomendacionesComponent } from './pages/recomendaciones/recomendaciones';


import { authGuard } from './guards/auth-guard';


export const routes: Routes = [
  // RUTAS PÚBLICAS (Sin Guard)
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tareas', component: TareasComponent },
  { path: 'recomendaciones', component: RecomendacionesComponent },


  // RUTAS PRIVADAS (Protegidas por authGuard)
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'finca', component: FincaComponent },
      //{ path: 'tareas', component: TareasComponent },
      //{ path: 'recomendaciones', component: RecomendacionesComponent },
      { path: 'deteccion/:crop', component: DetectionComponent },
      { path: 'result/:id', component: ResultComponent },
      { path: 'mapa', component: MapSelectorComponent },
      { path: 'biblioteca', component: BibliotecaComponent },

      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ]
  },

  { path: '**', redirectTo: '/login' }
];
