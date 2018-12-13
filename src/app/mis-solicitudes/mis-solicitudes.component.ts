import { Component, OnInit } from '@angular/core';
import { Usuario } from '../dominio/usuario';
import { SPServicio } from '../servicios/sp.servicio';
import { Slip } from '../dominio/slip';
import { MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})

export class MisSolicitudesComponent implements OnInit {

  constructor(private servicio: SPServicio, private router: Router) {

   }

  displayedColumns: string[] = ['nombreCliente', 'fechaCreacion', 'fechaRenovacion', 'diasTranscurridos', 'tipoNegocio', 'estado', 'menu'];
  dataSource;
  usuarioActual: Usuario;
  misSlips: Slip[] = [];

  ngOnInit() {
    this.ObtenerUsuarioActual();
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.usuarioActual = new Usuario(Response.Id, Response.Title, Response.email);
        this.ObtenerMisSolicitudes();
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    )
  }

  ObtenerMisSolicitudes(){
    let idUsuario = this.usuarioActual.id;
    this.servicio.obtenerMisSlips(idUsuario).subscribe(
      (Response) => {
        this.misSlips = Slip.fromJsonList(Response);
        this.dataSource = new MatTableDataSource(this.misSlips);
      }
    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editarPropiedadesSlip(slip){
    sessionStorage.setItem('slip',JSON.stringify(slip));
    this.router.navigate(["/editar-solicitud"]);
  }

}
