import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReemplazoSegundaOportunidadComponent } from './reemplazo-segunda-oportunidad.component';

describe('ReemplazoSegundaOportunidadComponent', () => {
  let component: ReemplazoSegundaOportunidadComponent;
  let fixture: ComponentFixture<ReemplazoSegundaOportunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReemplazoSegundaOportunidadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReemplazoSegundaOportunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
