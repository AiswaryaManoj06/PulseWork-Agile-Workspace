import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme = signal<ThemeMode>('dark');
  public readonly theme = this.currentTheme.asReadonly();

  constructor() {
    this.initTheme();
  }

  private initTheme(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedTheme = localStorage.getItem('pulsework_theme') as ThemeMode;
      if (savedTheme === 'light' || savedTheme === 'dark') {
        this.setTheme(savedTheme);
      } else {
        this.setTheme('dark');
      }
    }
  }

  public toggleTheme(): void {
    const nextTheme: ThemeMode = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  public setTheme(theme: ThemeMode): void {
    this.currentTheme.set(theme);
    if (typeof document !== 'undefined') {
      document.body.classList.remove('theme-dark', 'theme-light');
      document.body.classList.add(`theme-${theme}`);
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('pulsework_theme', theme);
    }
  }

  public isDark(): boolean {
    return this.currentTheme() === 'dark';
  }
}
