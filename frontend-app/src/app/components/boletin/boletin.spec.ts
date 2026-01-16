import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoletinComponent } from './boletin';

describe('BoletinComponent', () => {
  let component: BoletinComponent;
  let fixture: ComponentFixture<BoletinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoletinComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BoletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load alerts on init', () => {
    expect(component.todasLasAlertas.length).toBeGreaterThan(0);
  });

  it('should prioritize langosta alerts in user province', () => {
    component.provinciaUsuario = 'Manabí';
    component.aplicarFiltros();
    
    // La primera alerta debe ser la de langosta crítica en Manabí
    if (component.alertasFiltradasYOrdenadas.length > 0) {
      const primera = component.alertasFiltradasYOrdenadas[0];
      expect(primera.esLangosta).toBe(true);
    }
  });

  it('should filter by type', () => {
    component.tipoSeleccionado = 'Plaga';
    component.aplicarFiltros();
    
    component.alertasFiltradasYOrdenadas.forEach(alerta => {
      expect(alerta.tipo).toBe('Plaga');
    });
  });

  it('should filter by severity', () => {
    component.severidadSeleccionada = 'crítica';
    component.aplicarFiltros();
    
    component.alertasFiltradasYOrdenadas.forEach(alerta => {
      expect(alerta.severidad).toBe('crítica');
    });
  });
});
