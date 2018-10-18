import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescargarPlantillasComponent } from './descargar-plantillas.component';

describe('DescargarPlantillasComponent', () => {
  let component: DescargarPlantillasComponent;
  let fixture: ComponentFixture<DescargarPlantillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescargarPlantillasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescargarPlantillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
