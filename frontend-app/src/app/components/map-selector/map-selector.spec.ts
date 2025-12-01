import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSelector } from './map-selector';

describe('MapSelector', () => {
  let component: MapSelector;
  let fixture: ComponentFixture<MapSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapSelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
