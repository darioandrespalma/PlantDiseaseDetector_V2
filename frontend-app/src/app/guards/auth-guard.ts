import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  
  // 1. Verificar si estamos en el navegador
  if (isPlatformBrowser(platformId)) {
    const token = localStorage.getItem('token');

    if (token) {
      // Opcional: Podrías verificar si el token expiró aquí decodificándolo
      return true; 
    }
  }

  // 2. Si no hay token o estamos en el servidor, redirigir
  // En el servidor siempre redirigimos a login para evitar contenido flash protegido
  // o permitimos renderizar pero el cliente luego redirige.
  // Lo más seguro para SSR es bloquear si no estamos seguros.
  
  // Necesitamos usar router.navigate dentro de una zona segura o permitir la navegación
  // si es SSR, pero lo estándar es redirigir a login.
  
  if (isPlatformBrowser(platformId)) {
     router.navigate(['/login']);
  }
  
  return false;
};