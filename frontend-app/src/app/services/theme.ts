import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const KEY = 'pdd-theme'; // 'dark' | 'light'

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _dark$ = new BehaviorSubject<boolean>(false);
  dark$ = this._dark$.asObservable();

  constructor() {
    const initial = this.readPref();
    this._dark$.next(initial);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private readPref(): boolean {
    if (!this.isBrowser()) return false; // evita error en SSR

    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') return saved === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }

  isDark(): boolean {
    return this._dark$.value;
  }

  setDark(dark: boolean) {
    this._dark$.next(dark);
    if (this.isBrowser()) {
      localStorage.setItem(KEY, dark ? 'dark' : 'light');
    }
  }

  toggle() {
    this.setDark(!this._dark$.value);
  }
}
