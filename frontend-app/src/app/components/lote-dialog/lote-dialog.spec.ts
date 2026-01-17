import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoteDialog } from './lote-dialog';

describe('LoteDialog', () => {
  let component: LoteDialog;
  let fixture: ComponentFixture<LoteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoteDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoteDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
