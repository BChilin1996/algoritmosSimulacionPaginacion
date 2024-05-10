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
  ultimoMarcoFalloDePagina = 1;

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
          "direccionFisica": "0x" + (i * this.configuracionSistemaForm.controls['tamanioPaginas'].value).toString(16),
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

  cargarAMemoriaPrincipal(idProcesoReemplazar: Number, nombreProcesoReemplazar: String) {
    const falloPagina = this.marcosMemoriaPrincipal.find((option: any) => option.idProceso === idProcesoReemplazar);

    if (falloPagina) {
      alert("Proceso ya se encuentra en la Memoria Principal, no hay fallo");
    } else {
      alert("Proceso no se encuentra en la Memoria Principal, Fallo de Pagina");

      //Aplicar algoritmo FIFO
      const procesoMarcoLiberar = this.marcosMemoriaPrincipal.find((option: any) => option.numeroMarco === this.ultimoMarcoFalloDePagina);

      let marcoMPALiberar = this.marcosMemoriaPrincipal.filter((marco: any) => marco.idProceso === procesoMarcoLiberar.idProceso);
      let procesoTrasladarMemoriaSecundaria = marcoMPALiberar[0].idProceso;

      console.log("Proceso a Liberar " + JSON.stringify(marcoMPALiberar));

      //Liberar los Espacios de Memoria Principal
      for (let i = 0; i < marcoMPALiberar.length; i++) {
        let indice = Number(marcoMPALiberar[i].numeroMarco) - 1;
        this.marcosMemoriaPrincipal[indice].idProceso = idProcesoReemplazar;
        this.marcosMemoriaPrincipal[indice].nombreProceso = nombreProcesoReemplazar;
        this.ultimoMarcoFalloDePagina = marcoMPALiberar[i].numeroMarco + 1;
      }

      //Liberar los espacios de Memoria Secundaria
      let paginasEliminar = this.paginasMemoriaSecundaria.filter((option: any) => option.idProceso === idProcesoReemplazar);

      for (let i = 0; i < paginasEliminar.length; i++) {
        let indice = Number(paginasEliminar[i].numeroAlmacenamiento) - 1;
        this.paginasMemoriaSecundaria[indice].idProceso = null;
        this.paginasMemoriaSecundaria[indice].nombreProceso = null;
        this.paginasMemoriaSecundaria[indice].numeroPagina = null;
      }

      //Pasar el proceso a memoria secundaria
      const procesoTamanio = this.listaProcesos.find((option: any) => option.id === procesoTrasladarMemoriaSecundaria);

      var cantidadPaginasAsignados = 0;
      console.log("Tamaño MS " + procesoTamanio.tamanioProceso);
      let numeroPaginas = Math.ceil(procesoTamanio.tamanioProceso / this.tamanioPaginas);

      for (let j = 0; j < this.paginasMemoriaSecundaria.length; j++) {

        if (this.paginasMemoriaSecundaria[j].idProceso === null) {
          this.paginasMemoriaSecundaria[j].nombreProceso = procesoTamanio.nombreProceso;
          this.paginasMemoriaSecundaria[j].numeroPagina = cantidadPaginasAsignados;
          this.paginasMemoriaSecundaria[j].idProceso = procesoTamanio.id;
          cantidadPaginasAsignados = cantidadPaginasAsignados + 1;
        }

        if (cantidadPaginasAsignados >= numeroPaginas) {
          break;
        }

      }

      this.listaProcesos[procesoTrasladarMemoriaSecundaria - 1].mS = cantidadPaginasAsignados;
      this.listaProcesos[procesoTrasladarMemoriaSecundaria - 1].mP = 0;

      this.listaProcesos[Number(idProcesoReemplazar) - 1].mS = 0;
      this.listaProcesos[Number(idProcesoReemplazar) - 1].mP = cantidadPaginasAsignados;

    }

  }

  agregarProcesoFIFO() {
    if (this.agregarProcesoForm.valid === true) {

      this.contadorPagina = this.contadorPagina + 1;

      let idProceso = this.listaProcesos.length + 1;
      let numeroPaginas = Math.ceil(this.agregarProcesoForm.controls['tamanioProceso'].value / this.tamanioPaginas);


      var cantidadMarcosAsignados = 0;

      let marcosLibres = this.marcosMemoriaPrincipal.filter((marco: any) =>
        marco.idProceso === null);

      let marcosLibresCount = marcosLibres.length;

      if (marcosLibresCount < numeroPaginas) {
        this.memoriaPrincipalLlena = true
        this.listaProcesos.push({
          "id": idProceso,
          "nombreProceso": this.agregarProcesoForm.controls['nombreProceso'].value,
          "tamanioProceso": this.agregarProcesoForm.controls['tamanioProceso'].value,
          "numeroPaginas": numeroPaginas,
          "estado": "Listo",
          "mP": 0,
          "mS": numeroPaginas
        });
      } else {
        this.memoriaPrincipalLlena = false
        this.listaProcesos.push({
          "id": idProceso,
          "nombreProceso": this.agregarProcesoForm.controls['nombreProceso'].value,
          "tamanioProceso": this.agregarProcesoForm.controls['tamanioProceso'].value,
          "numeroPaginas": numeroPaginas,
          "estado": "Listo",
          "mP": numeroPaginas,
          "mS": 0
        });
      }


      if (this.memoriaPrincipalLlena === false) {
        for (let i = 0; i < this.marcosMemoriaPrincipal.length; i++) {

          if (this.marcosMemoriaPrincipal[i].idProceso === null) {
            this.marcosMemoriaPrincipal[i].nombreProceso = this.agregarProcesoForm.controls['nombreProceso'].value
            this.marcosMemoriaPrincipal[i].numeroPagina = cantidadMarcosAsignados;
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
            this.paginasMemoriaSecundaria[j].numeroPagina = cantidadPaginasAsignados;
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
