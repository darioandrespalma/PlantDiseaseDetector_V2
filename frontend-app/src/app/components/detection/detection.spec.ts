import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detection } from './detection';

describe('Detection', () => {
  let component: Detection;
  let fixture: ComponentFixture<Detection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
