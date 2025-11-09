import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LunarCalendar } from './lunar-calendar';

describe('LunarCalendar', () => {
  let component: LunarCalendar;
  let fixture: ComponentFixture<LunarCalendar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LunarCalendar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LunarCalendar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
