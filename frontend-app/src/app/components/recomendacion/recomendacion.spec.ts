import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recomendacion } from './recomendacion';

describe('Recomendacion', () => {
  let component: Recomendacion;
  let fixture: ComponentFixture<Recomendacion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recomendacion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recomendacion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
