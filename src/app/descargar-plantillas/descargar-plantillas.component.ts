import { Component, OnInit } from '@angular/core';
import { SPServicio } from '../servicios/sp.servicio';
import { Plantilla } from '../dominio/plantilla';

@Component({
  selector: 'app-descargar-plantillas',
  templateUrl: './descargar-plantillas.component.html',
  styleUrls: ['./descargar-plantillas.component.css']
})
export class DescargarPlantillasComponent implements OnInit {

  plantillas: Plantilla[] = [];

  constructor(private servicio: SPServicio) {

  }

  ngOnInit() {
    this.obtenerPlantillas();
  }

  obtenerPlantillas(){
      this.servicio.ObtenerPlantillasDescargas().subscribe(
        (Response) => {
          this.plantillas = Plantilla.fromJsonList(Response);
          console.log(this.plantillas);
        },
        error => {
          console.log('Error obteniendo las plantillas para descargar: ' + error);
        }
      );
  }

  descargarArchivo(plantilla){
    console.log(plantilla);
    window.location.href = plantilla.urlPlantilla.Url;
  }

}
