// src/app/components/login/login.ts
import { Component, HostBinding, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

// Services
import { AuthService } from '../../services/auth';
import { WebsocketService } from '../../services/websocket';
import { ToastrService } from 'ngx-toastr';
import { ThemeService } from '../../services/theme';

// Angular Material (sub-paquetes)
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Animaciones
import { trigger, transition, style, animate } from '@angular/animations';
import { FixedSizeVirtualScrollStrategy } from '@angular/cdk/scrolling';

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
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('600ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnDestroy {
  @HostBinding('class.dark') dark = false;

  form!: FormGroup;
  hide = true;
  isLoading = false;

  private themeSub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private ws: WebsocketService,
    private router: Router,
    private toast: ToastrService,        // 👈 COMA AQUÍ
    private theme: ThemeService          // 👈 INYECTADO
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Sincroniza con ThemeService (persistente entre pantallas)
    this.dark = this.theme.isDark();
    this.themeSub = this.theme.dark$.subscribe(v => (this.dark = v));
  }

  toggleDark() { this.theme.toggle(); }  // 👈 usa el servicio, no solo variable local

  submit() {
    if (this.form.invalid) {
      this.toast.warning('Completa los campos correctamente');
      this.form.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.auth.login(this.form.value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: () => {
          this.toast.success('Bienvenido 🌿');
          this.ws.connect();
          this.router.navigate(['/dashboard']);
        },
        error: err => this.toast.error(err?.error?.message || 'Error al iniciar sesión')
      });
  }

  ngOnDestroy() {
    this.themeSub?.unsubscribe();
  }
}
