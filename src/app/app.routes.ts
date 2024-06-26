import { RouterModule, Routes } from '@angular/router';
import { ReemplazoFIFOComponent } from './Componentes/reemplazo-fifo/reemplazo-fifo.component';
import { ReemplazoNRUComponent } from './Componentes/reemplazo-nru/reemplazo-nru.component';
import { ReemplazoSegundaOportunidadComponent } from './Componentes/reemplazo-segunda-oportunidad/reemplazo-segunda-oportunidad.component';
import { NgModule } from '@angular/core';
import { HomeAlgoritmosComponent } from './Componentes/home-algoritmos/home-algoritmos.component';

export const routes: Routes = [{
    path: 'fifo',
    component: ReemplazoFIFOComponent,
  },{
    path: 'lru',
    component: ReemplazoNRUComponent,
  },{
    path: 'segunda-oportunidad',
    component: ReemplazoSegundaOportunidadComponent,
  },{
    path: 'home',
    component: HomeAlgoritmosComponent,
  },{
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  }];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
  