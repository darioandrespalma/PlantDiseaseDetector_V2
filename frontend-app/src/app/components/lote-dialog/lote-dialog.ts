import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { LoteService } from '../../services/lote.service';

@Component({
  selector: 'app-lote-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule, 
    MatCheckboxModule, MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>🌱 Registrar Nueva Finca</h2>
    <form [formGroup]="form" (ngSubmit)="guardar()">
      <mat-dialog-content class="dialog-content">
        <div class="coords-info">
          <small>Ubicación: {{ data.lat | number:'1.4-4' }}, {{ data.lon | number:'1.4-4' }}</small>
        </div>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre de la Hacienda</mat-label>
          <input matInput formControlName="nombre" placeholder="Ej. Finca La Esperanza">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Cultivo</mat-label>
          <mat-select formControlName="cultivoId">
            <mat-option *ngFor="let c of cultivos" [value]="c._id">
              {{ c.nombre }}
            </mat-option>

            <mat-option *ngIf="cultivos.length === 0" disabled>
              Cargando cultivos o No hay datos...
            </mat-option>
          </mat-select>
        </mat-form-field>

        <div class="alert-box">
          <h3>🔔 Alertas Climáticas</h3>
          <mat-checkbox formControlName="alertasActivas" color="primary">
            Activar monitoreo y alertas
          </mat-checkbox>
          
          <mat-form-field appearance="outline" class="full-width" *ngIf="form.get('alertasActivas')?.value">
            <mat-label>Frecuencia de Reportes</mat-label>
            <mat-select formControlName="frecuenciaAlertas">
              <mat-option value="diaria">Diaria (Todos los días 7AM)</mat-option>
              <mat-option value="semanal">Semanal (Resumen Viernes)</mat-option>
              <mat-option value="critica">Solo Emergencias (Heladas/Sequía)</mat-option>
            </mat-select>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="cerrar()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          Guardar Finca
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width { width: 100%; margin-bottom: 8px; }
    .dialog-content { display: flex; flex-direction: column; gap: 10px; min-width: 350px; }
    .alert-box { background: #f0f7ff; padding: 15px; border-radius: 8px; border: 1px solid #cce3ff; }
    .coords-info { color: #666; margin-bottom: 10px; font-style: italic; }
  `]
})
export class LoteDialogComponent implements OnInit {
  form: FormGroup;
  cultivos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private loteService: LoteService,
    public dialogRef: MatDialogRef<LoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { lat: number, lon: number }
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      cultivoId: ['', Validators.required],
      alertasActivas: [false],
      frecuenciaAlertas: ['semanal']
    });
  }

  ngOnInit() {
    // Llamada al backend para llenar la lista
    this.loteService.getCultivos().subscribe({
      next: (res: any) => {
        // Asegura leer 'data' si viene envuelto
        this.cultivos = res.data || res; 
        console.log('Cultivos cargados:', this.cultivos);
      },
      error: (err) => console.error('Error cargando cultivos:', err)
    });
  }

  guardar() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cerrar() {
    this.dialogRef.close(null);
  }
}