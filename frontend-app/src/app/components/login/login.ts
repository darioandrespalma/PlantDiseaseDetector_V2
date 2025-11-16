import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

// Services
import { AuthService } from '../../services/auth';
import { WebsocketService } from '../../services/websocket';
import { ToastService } from '../../services/toast';
import { ThemeService } from '../../services/theme';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Animaciones
import { formAnimations, logoAnimation, shakeAnimation } from '../../animations/auth-animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  animations: [formAnimations, logoAnimation, shakeAnimation]
})
export class LoginComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  hide = true;
  isLoading = false;
  logoState = 'normal';
  dark = false; // ✅ AÑADIDO: Propiedad para el template

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private ws: WebsocketService,
    private router: Router,
    private toast: ToastService,
    public theme: ThemeService // ✅ CAMBIADO A PUBLIC
  ) {}

  ngOnInit() {
    this.initForm();
    this.animateLogo();
    
    // ✅ Sincronizar propiedad dark con el servicio
    this.dark = this.theme.isDark();
    this.theme.dark$.pipe(takeUntil(this.destroy$)).subscribe(v => this.dark = v);
  }

  private initForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  private animateLogo() {
    setInterval(() => {
      this.logoState = 'pulse';
      setTimeout(() => this.logoState = 'normal', 300);
    }, 5000);
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  toggleDark() {
    this.theme.toggle();
  }

  submit() {
    if (this.form.invalid) {
      this.toast.warning('🌱 Completa los campos correctamente', 'Aviso');
      this.form.markAllAsTouched();
      // Trigger shake animation
      this.form.setErrors({ 'invalid': true });
      setTimeout(() => this.form.setErrors(null), 500);
      return;
    }

    this.isLoading = true;
    this.auth.login(this.form.value)
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.toast.success('🌿 Bienvenido a tu asistente agrícola', 'Éxito');
          this.ws.connect();
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          const message = err?.error?.message || 'Error al iniciar sesión';
          this.toast.error(message, 'Error');
          this.password?.reset();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}