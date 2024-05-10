import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReemplazoNRUComponent } from './reemplazo-nru.component';

describe('ReemplazoNRUComponent', () => {
  let component: ReemplazoNRUComponent;
  let fixture: ComponentFixture<ReemplazoNRUComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReemplazoNRUComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReemplazoNRUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
