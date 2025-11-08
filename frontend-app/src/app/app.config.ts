// frontend-app/src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Importa tus rutas

// --- ¡Añade estas importaciones! ---
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    // Esto configura tus rutas
    provideRouter(routes), 


    
    // --- ¡Añade estos 3 proveedores! ---

    // 1. Activa el HttpClient para todas las peticiones HTTP (a tu backend)
    provideHttpClient(withFetch()),

    // 2. Activa las animaciones (requerido por ngx-toastr)
    provideAnimations(), 
    
    // 3. Configura las notificaciones (Toastr)
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ]
};