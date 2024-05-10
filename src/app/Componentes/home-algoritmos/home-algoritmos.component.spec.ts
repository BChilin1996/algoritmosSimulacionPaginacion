import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAlgoritmosComponent } from './home-algoritmos.component';

describe('HomeAlgoritmosComponent', () => {
  let component: HomeAlgoritmosComponent;
  let fixture: ComponentFixture<HomeAlgoritmosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeAlgoritmosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeAlgoritmosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
