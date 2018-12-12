import { Component, OnInit } from '@angular/core';
import { Usuario } from '../dominio/usuario';
import { SPServicio } from '../servicios/sp.servicio';
import { Slip } from '../dominio/slip';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})

export class MisSolicitudesComponent implements OnInit {

  constructor(private servicio: SPServicio) {

   }

  displayedColumns: string[] = ['nombreCliente', 'fechaCreacion', 'fechaRenovacion', 'diasTranscurridos', 'tipoNegocio', 'estado', 'menu'];
  dataSource;
  usuarioActual: Usuario;
  misSlips: Slip[] = [];

  ngOnInit() {
    this.RecuperarUsuario();
    this.ObtenerMisSolicitudes();
  }

  RecuperarUsuario() {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
  }

  ObtenerMisSolicitudes(){
    let idUsuario = this.usuarioActual.id;
    this.servicio.obtenerMisSlips(idUsuario).subscribe(
      (Response) => {
        this.misSlips = Slip.fromJsonList(Response);
        console.log(this.misSlips);
        this.dataSource = new MatTableDataSource(this.misSlips);
      }
    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
