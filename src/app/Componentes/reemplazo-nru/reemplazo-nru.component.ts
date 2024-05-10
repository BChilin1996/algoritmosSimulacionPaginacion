import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-reemplazo-nru',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './reemplazo-nru.component.html',
  styleUrl: './reemplazo-nru.component.css'
})
export class ReemplazoNRUComponent {
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
          "direccionFisica": "0x" + (i * this.configuracionSistemaForm.controls['tamanioPaginas'].value).toString(16),
          "numeroMarco": i,
          "idProceso": null,
          "nombreProceso": null,
          "numeroPagina": null,
          "tiempoOcupadoProceso": null
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


  bloquearProceso(idProcesoBloquear: Number) {
    let marcoMPABloquear = this.marcosMemoriaPrincipal.filter((marco: any) => marco.idProceso === idProcesoBloquear);

    if (marcoMPABloquear.length > 0) {

      for (let i = 0; i < marcoMPABloquear.length; i++) {
        let indice = Number(marcoMPABloquear[i].numeroMarco) - 1;
        this.marcosMemoriaPrincipal[indice].idProceso = null;
        this.marcosMemoriaPrincipal[indice].nombreProceso = null;
        this.marcosMemoriaPrincipal[indice].numeroPagina = null;
      }

      let datosProceso = this.listaProcesos.find((option: any) => option.id === idProcesoBloquear);

      let numeroPaginas = Math.ceil(datosProceso.tamanioProceso / this.tamanioPaginas);
      let cantidadPaginasAsignados = 0;

      let paginasMemoriaSecundaria = this.paginasMemoriaSecundaria.filter((marco: any) => marco.idProceso === null);


      for (let i = 0; i < paginasMemoriaSecundaria.length; i++) {

        let indice = Number(paginasMemoriaSecundaria[i].numeroAlmacenamiento) - 1;

        this.paginasMemoriaSecundaria[indice].idProceso = datosProceso.id;
        this.paginasMemoriaSecundaria[indice].nombreProceso = datosProceso.nombreProceso;
        this.paginasMemoriaSecundaria[indice].numeroPagina = cantidadPaginasAsignados;
        cantidadPaginasAsignados = cantidadPaginasAsignados + 1;

        if (cantidadPaginasAsignados >= numeroPaginas) {
          break;
        }

      }

      this.listaProcesos[Number(idProcesoBloquear) - 1].estado = "Bloqueado";
      this.listaProcesos[Number(idProcesoBloquear) - 1].Ms = 0;
      this.listaProcesos[Number(idProcesoBloquear) - 1].Mp = 0;

    } else {
      this.listaProcesos[Number(idProcesoBloquear) - 1].estado = "Bloqueado";
    }

  }

  terminarProceso(idProcesoEliminar: Number) {
    let marcoMPAEliminar = this.marcosMemoriaPrincipal.filter((marco: any) => marco.idProceso === idProcesoEliminar);
    let paginasMSEliminar = this.paginasMemoriaSecundaria.filter((pagina: any) => pagina.idProceso === idProcesoEliminar);

    for (let i = 0; i < marcoMPAEliminar.length; i++) {
      let indice = Number(marcoMPAEliminar[i].numeroMarco) - 1;
      this.marcosMemoriaPrincipal[indice].idProceso = null;
      this.marcosMemoriaPrincipal[indice].nombreProceso = null;
      this.marcosMemoriaPrincipal[indice].numeroPagina = null;
      this.marcosMemoriaPrincipal[indice].tiempoOcupadoProceso = null;
    }


    console.log("Eliminar Memoria Secundaria " + paginasMSEliminar);

    for (let i = 0; i < paginasMSEliminar.length; i++) {
      let indice = Number(paginasMSEliminar[i].numeroAlmacenamiento) - 1;
      this.paginasMemoriaSecundaria[indice].idProceso = null;
      this.paginasMemoriaSecundaria[indice].nombreProceso = null;
      this.paginasMemoriaSecundaria[indice].numeroPagina = null;
    }

    this.listaProcesos[Number(idProcesoEliminar) - 1].estado = "Terminado";
    this.listaProcesos[Number(idProcesoEliminar) - 1].Ms = 0;
    this.listaProcesos[Number(idProcesoEliminar) - 1].Mp = 0;

  }

  cargarAMemoriaPrincipal(idProcesoReemplazar: Number, nombreProcesoReemplazar: String) {

    const falloPagina = this.marcosMemoriaPrincipal.find((option: any) => option.idProceso === idProcesoReemplazar);

    if (falloPagina) {
      alert("Proceso ya se encuentra en la Memoria Principal, no hay fallo");
      const reiniciarPaginaReferenciada = this.marcosMemoriaPrincipal.filter((option: any) => option.idProceso === idProcesoReemplazar);

      for (let i = 0; i < reiniciarPaginaReferenciada.length; i++) {
        let indice = Number(reiniciarPaginaReferenciada[i].numeroMarco) - 1;
        this.marcosMemoriaPrincipal[indice].tiempoOcupadoProceso = 0;
      }

    } else {
      alert("Proceso no se encuentra en la Memoria Principal, Fallo de Pagina");

      //Aplicar algoritmo FIFO
      let procesoMasAntiguoReemplazar = this.marcosMemoriaPrincipal.reduce((previous: any, current: any) => {
        return current.tiempoOcupadoProceso > previous.tiempoOcupadoProceso ? current : previous;
      });;

      const procesoMarcoLiberar = this.marcosMemoriaPrincipal.find((option: any) => option.idProceso === procesoMasAntiguoReemplazar.idProceso);

      //Paginas necesarias para el nuevo Proceso
      let datosProcesoReemplazar = this.listaProcesos.find((option: any) => option.id === idProcesoReemplazar);

      let paginasReemplazar = Math.ceil(datosProcesoReemplazar.tamanioProceso / this.tamanioPaginas);
      let marcosLibres = this.marcosMemoriaPrincipal.filter((marco: any) => marco.idProceso === null);
      console.log("Marcos Libres " + marcosLibres.length);
      console.log("Paginas a Reemplazar " + paginasReemplazar);

      if (marcosLibres.length >= paginasReemplazar) {
        console.log("Hay Marcos Libres");
     
        for (let i = 0; i < marcosLibres.length; i++) {
          let indice = Number(marcosLibres[i].numeroMarco) - 1;
          this.marcosMemoriaPrincipal[indice].idProceso = idProcesoReemplazar;
          this.marcosMemoriaPrincipal[indice].nombreProceso = nombreProcesoReemplazar;
          this.marcosMemoriaPrincipal[indice].numeroPagina = i;
          this.marcosMemoriaPrincipal[indice].tiempoOcupadoProceso = 0;
        }

        //Liberar los espacios de Memoria Secundaria
        let paginasEliminar = this.paginasMemoriaSecundaria.filter((option: any) => option.idProceso === idProcesoReemplazar);

        for (let i = 0; i < paginasEliminar.length; i++) {
          let indice = Number(paginasEliminar[i].numeroAlmacenamiento) - 1;
          this.paginasMemoriaSecundaria[indice].idProceso = null;
          this.paginasMemoriaSecundaria[indice].nombreProceso = null;
          this.paginasMemoriaSecundaria[indice].numeroPagina = null;
        }

      } else {
        console.log("No hay marcos libres, liberar memoria principal");
        //Liberar los Espacios de Memoria Principal
        let marcoMPALiberar = this.marcosMemoriaPrincipal.filter((marco: any) => marco.idProceso === procesoMarcoLiberar.idProceso);
        let procesoTrasladarMemoriaSecundaria = marcoMPALiberar[0].idProceso;

        for (let i = 0; i < marcoMPALiberar.length; i++) {
          let indice = Number(marcoMPALiberar[i].numeroMarco) - 1;
          this.marcosMemoriaPrincipal[indice].idProceso = idProcesoReemplazar;
          this.marcosMemoriaPrincipal[indice].nombreProceso = nombreProcesoReemplazar;
          this.marcosMemoriaPrincipal[indice].tiempoOcupadoProceso = 0;
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

    let marcosMemoriaPrincipalAsignada: any = this.marcosMemoriaPrincipal.filter((marco: any) => marco.idProceso != null && marco.idProceso != idProcesoReemplazar);
    
    for (let i = 0; i < marcosMemoriaPrincipalAsignada.length; i++) {

      let indices = marcosMemoriaPrincipalAsignada[i].numeroMarco - 1;
      this.marcosMemoriaPrincipal[indices].tiempoOcupadoProceso = Number(this.marcosMemoriaPrincipal[indices].tiempoOcupadoProceso) + 1;

    }


  }

  agregarProcesoNRU() {
    if (this.agregarProcesoForm.valid === true) {

      this.contadorPagina = this.contadorPagina + 1;

      let idProceso = this.listaProcesos.length + 1;
      let numeroPaginas = Math.ceil(this.agregarProcesoForm.controls['tamanioProceso'].value / this.tamanioPaginas);


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

      var cantidadMarcosAsignados = 0;
      let marcosMemoriaPrincipalAsignada: any = this.marcosMemoriaPrincipal.filter((marco: any) => marco.idProceso != null);

      if (this.memoriaPrincipalLlena === false) {

        let marcosMemoriaPrincipalVacia: any = this.marcosMemoriaPrincipal.filter((marco: any) => marco.idProceso === null);
  

        for (let i = 0; i < marcosMemoriaPrincipalVacia.length; i++) {

          if (cantidadMarcosAsignados < numeroPaginas) {
            let indices = marcosMemoriaPrincipalVacia[i].numeroMarco - 1;
            this.marcosMemoriaPrincipal[indices].nombreProceso = this.agregarProcesoForm.controls['nombreProceso'].value
            this.marcosMemoriaPrincipal[indices].numeroPagina = cantidadMarcosAsignados;
            this.marcosMemoriaPrincipal[indices].idProceso = idProceso;
            this.marcosMemoriaPrincipal[indices].tiempoOcupadoProceso = 0;
            cantidadMarcosAsignados = cantidadMarcosAsignados + 1;
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

      for (let i = 0; i < marcosMemoriaPrincipalAsignada.length; i++) {

        let indices = marcosMemoriaPrincipalAsignada[i].numeroMarco - 1;
        this.marcosMemoriaPrincipal[indices].tiempoOcupadoProceso = Number(this.marcosMemoriaPrincipal[indices].tiempoOcupadoProceso) + 1;

      }


      this.agregarProcesoForm.controls['nombreProceso'].setValue('Proceso #' + (idProceso + 1).toString());

    }
  }
}
