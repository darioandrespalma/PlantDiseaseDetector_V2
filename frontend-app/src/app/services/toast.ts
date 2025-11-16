import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
    panelClass: ['custom-snackbar']
  };

  constructor(
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  success(message: string, action: string = '✅') {
    this.show(message, action, ['success-snackbar']);
  }

  error(message: string, action: string = '❌') {
    this.show(message, action, ['error-snackbar']);
  }

  warning(message: string, action: string = '⚠️') {
    this.show(message, action, ['warning-snackbar']);
  }

  info(message: string, action: string = 'ℹ️') {
    this.show(message, action, ['info-snackbar']);
  }

  private show(message: string, action: string, panelClass: string[]) {
    if (isPlatformBrowser(this.platformId)) {
      // ✅ CORREGIDO: Verificar que panelClass sea un array
      const defaultPanelClass = this.defaultConfig.panelClass || [];
      const panelClassArray = Array.isArray(defaultPanelClass) 
        ? defaultPanelClass 
        : [defaultPanelClass];

      this.snackBar.open(message, action, {
        ...this.defaultConfig,
        panelClass: [...panelClassArray, ...panelClass]
      });
    }
  }
}