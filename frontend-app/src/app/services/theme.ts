import { Injectable, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private darkSubject = new BehaviorSubject<boolean>(false);
  dark$ = this.darkSubject.asObservable();

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initTheme();
  }

  private initTheme() {
    // ✅ SOLO acceder a localStorage en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('darkTheme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const isDark = saved ? JSON.parse(saved) : prefersDark;
      this.setTheme(isDark);
    }
  }

  toggle() {
    const newValue = !this.darkSubject.value;
    this.setTheme(newValue);
    
    // ✅ SOLO guardar en localStorage en el navegador
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('darkTheme', JSON.stringify(newValue));
    }
  }

  private setTheme(isDark: boolean) {
    const body = document.body;
    
    if (isDark) {
      this.renderer.addClass(body, 'dark-theme');
    } else {
      this.renderer.removeClass(body, 'dark-theme');
    }
    
    this.darkSubject.next(isDark);
  }

  isDark() {
    return this.darkSubject.value;
  }
}