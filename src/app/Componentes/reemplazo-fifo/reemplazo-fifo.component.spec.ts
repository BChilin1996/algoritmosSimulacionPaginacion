import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReemplazoFIFOComponent } from './reemplazo-fifo.component';

describe('ReemplazoFIFOComponent', () => {
  let component: ReemplazoFIFOComponent;
  let fixture: ComponentFixture<ReemplazoFIFOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReemplazoFIFOComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReemplazoFIFOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
