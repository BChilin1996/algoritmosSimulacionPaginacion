import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reemplazo-fifo',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './reemplazo-fifo.component.html',
  styleUrl: './reemplazo-fifo.component.css'
})
export class ReemplazoFIFOComponent {

  configuracionSistemaForm!: FormGroup;
  cantidadMarcos!: Number;
  cantidadPaginas!: Number;
  marcosMemoriaPrincipal: any = [];
  paginasMemoriaSecundaria: any = [];
  listaProcesos: any = [];
  agregarProcesoForm!: FormGroup;
  sistemaIniciado = false;
  contadorPagina = 0;
  tamanioPaginas = 1024;
  memoriaPrincipalLlena = false;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.configuracionSistemaForm = this.formBuilder.group({
      tamanioMemoriaPrincipal: [20480, Validators.required],
      tamanioMemoriaSecundaria: [51200, Validators.required],
      tamanioPaginas: [1024, Validators.required]
    });

    this.agregarProcesoForm = this.formBuilder.group({
      nombreProceso: ['Proceso #1', Validators.required],
      tamanioProceso: [4096, Validators.required]
    });

  }

  iniciarSistema() {
    if (this.configuracionSistemaForm.valid === true) {
      this.cantidadMarcos = this.configuracionSistemaForm.controls['tamanioMemoriaPrincipal'].value / this.configuracionSistemaForm.controls['tamanioPaginas'].value
      this.cantidadPaginas = this.configuracionSistemaForm.controls['tamanioMemoriaSecundaria'].value / this.configuracionSistemaForm.controls['tamanioPaginas'].value
      this.tamanioPaginas = this.configuracionSistemaForm.controls['tamanioPaginas'].value;
      for (let i = 1; i < Number(this.cantidadMarcos) + 1; i++) {
        this.marcosMemoriaPrincipal.push({
          "direccionFisica": i.toString(32),
          "numeroMarco": i,
          "idProceso": null,
          "nombreProceso": null,
          "numeroPagina": null
        });
      }

      for (let i = 1; i < Number(this.cantidadPaginas) + 1; i++) {
        this.paginasMemoriaSecundaria.push({
          "numeroAlmacenamiento": i,
          "idProceso": null,
          "nombreProceso": null,
          "numeroPagina": null
        });
      }

      this.sistemaIniciado = true;
    }

  }

  agregarProcesoFIFO() {
    if (this.agregarProcesoForm.valid === true) {

      this.contadorPagina = this.contadorPagina + 1;

      let idProceso = this.listaProcesos.length + 1;
      let numeroPaginas = Math.ceil(this.agregarProcesoForm.controls['tamanioProceso'].value / this.tamanioPaginas);

      this.listaProcesos.push({
        "id": idProceso,
        "nombreProceso": this.agregarProcesoForm.controls['nombreProceso'].value,
        "tamanioProceso": this.agregarProcesoForm.controls['tamanioProceso'].value,
        "numeroPaginas": numeroPaginas,
        "estado": "Listo",
        "mP": 2,
        "mS": 1
      });

      var cantidadMarcosAsignados = 0;

      let marcosLibres = this.marcosMemoriaPrincipal.filter((marco: any) =>
        marco.idProceso === null);

      let marcosLibresCount = marcosLibres.length;

      if (marcosLibresCount < numeroPaginas) {
        this.memoriaPrincipalLlena = true
      }

      if (this.memoriaPrincipalLlena === false) {
        for (let i = 0; i < this.marcosMemoriaPrincipal.length; i++) {

          if (this.marcosMemoriaPrincipal[i].idProceso === null) {
            this.marcosMemoriaPrincipal[i].nombreProceso = this.agregarProcesoForm.controls['nombreProceso'].value
            this.marcosMemoriaPrincipal[i].numeroPagina = this.contadorPagina;
            this.marcosMemoriaPrincipal[i].idProceso = idProceso;
            cantidadMarcosAsignados = cantidadMarcosAsignados + 1;
          }

          if (cantidadMarcosAsignados >= numeroPaginas) {
            break;
          }

        }
      }


      var cantidadPaginasAsignados = 0;

      if (this.memoriaPrincipalLlena === true) {
        for (let j = 0; j < this.paginasMemoriaSecundaria.length; j++) {
          if (this.paginasMemoriaSecundaria[j].idProceso === null) {
            this.paginasMemoriaSecundaria[j].nombreProceso = this.agregarProcesoForm.controls['nombreProceso'].value;
            this.paginasMemoriaSecundaria[j].numeroPagina = this.contadorPagina;
            this.paginasMemoriaSecundaria[j].idProceso = idProceso;
            cantidadPaginasAsignados = cantidadPaginasAsignados + 1;
          }

          if (cantidadPaginasAsignados >= numeroPaginas) {
            break;
          }

        }
      }

      this.agregarProcesoForm.controls['nombreProceso'].setValue('Proceso #' + (idProceso + 1).toString());

    }
  }

}
