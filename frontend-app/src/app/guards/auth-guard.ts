// src/app/guards/auth-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // Ajustado a tu nombre de archivo

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Usuario logueado, puede pasar
  } else {
    // No logueado, redirigir al login
    router.navigate(['/login']);
    return false;
  }
};