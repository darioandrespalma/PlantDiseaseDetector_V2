// src/app/components/register/register.ts
import { Component, HostBinding, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder, Validators, ReactiveFormsModule, FormGroup,
  AbstractControl, ValidationErrors
} from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { ThemeService } from '../../services/theme';

// Services
import { AuthService } from '../../services/auth';
import { ToastrService } from 'ngx-toastr';

// Angular Material (sub-paquetes)
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Animations
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatProgressBarModule, MatCheckboxModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('600ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class RegisterComponent implements OnDestroy {
  @HostBinding('class.dark') dark = false;

  private themeSub?: Subscription;

  registerForm!: FormGroup;
  isLoading = false;
  hidePwd = true;
  hidePwd2 = true;
  strength = 0; // 0..100

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private theme: ThemeService
  ) {
    this.buildForm();
    // sincroniza modo oscuro con el servicio (persistente)
    this.dark = this.theme.isDark();
    this.themeSub = this.theme.dark$.subscribe(v => (this.dark = v));
  }

  toggleDark() { this.theme.toggle(); }

  ngOnDestroy() { this.themeSub?.unsubscribe(); }

  private buildForm() {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        acceptTerms: [false, [Validators.requiredTrue]]
      },
      { validators: [this.passwordsMatchValidator()] }
    );

    this.registerForm.get('password')?.valueChanges.subscribe(v => {
      this.strength = this.calcStrength(v || '');
    });
  }

  private passwordsMatchValidator() {
    return (group: AbstractControl): ValidationErrors | null => {
      const pass = group.get('password')?.value;
      const conf = group.get('confirmPassword')?.value;
      return pass && conf && pass !== conf ? { passwordsNotMatch: true } : null;
    };
  }

  private calcStrength(pwd: string): number {
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length >= 6) s += 20;
    if (pwd.length >= 10) s += 15;
    if (/[a-z]/.test(pwd)) s += 15;
    if (/[A-Z]/.test(pwd)) s += 15;
    if (/\d/.test(pwd)) s += 15;
    if (/[^A-Za-z0-9]/.test(pwd)) s += 20;
    return Math.min(100, s);
  }

  get f() { return this.registerForm.controls; }

  get formErrors() {
    return { passwordsNotMatch: this.registerForm.hasError('passwordsNotMatch') };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toastr.warning('Revisa los campos del formulario');
      return;
    }

    const { username, email, password } = this.registerForm.value;
    this.isLoading = true;

    this.authService.register({ username, email, password })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.toastr.success('Cuenta creada exitosamente', '¡Registro completo!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Error al registrarse', 'Error');
        }
      });
  }
}
