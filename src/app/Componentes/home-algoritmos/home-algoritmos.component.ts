import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-algoritmos',
  standalone: true,
  imports: [],
  templateUrl: './home-algoritmos.component.html',
  styleUrl: './home-algoritmos.component.css'
})
export class HomeAlgoritmosComponent {

  constructor(
    private router: Router
  ) {

  }
  
  segundaOportunidad() {
    this.router.navigate(['/segunda-oportunidad'])
  }

  lru() {
    this.router.navigate(['/lru'])
  }

  fifo() {
    this.router.navigate(['/fifo'])
  }

}
