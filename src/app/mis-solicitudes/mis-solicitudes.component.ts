import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../dominio/usuario';
import { SPServicio } from '../servicios/sp.servicio';
import { Slip } from '../dominio/slip';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { empty } from 'rxjs';

@Component({
  selector: 'app-mis-solicitudes',
  templateUrl: './mis-solicitudes.component.html',
  styleUrls: ['./mis-solicitudes.component.css']
})

export class MisSolicitudesComponent implements OnInit {

  constructor(private servicio: SPServicio, private router: Router, public dialog: MatDialog) {

  }

  displayedColumns: string[] = ['nombreCliente', 'fechaCreacion', 'fechaRenovacion', 'diasTranscurridos', 'tipoNegocio', 'estado', 'menu'];
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  usuarioActual: Usuario;
  misSlips: Slip[] = [];
  empty;

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

  ObtenerMisSolicitudes() {
    let idUsuario = this.usuarioActual.id;
    this.servicio.obtenerMisSlips(idUsuario).subscribe(
      (Response) => {
        this.misSlips = Slip.fromJsonList(Response);
        if (this.misSlips.length > 0) {
          this.empty = false;
          this.dataSource = new MatTableDataSource(this.misSlips);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
        else{
          this.empty = true;
        }

      }, err => {
        console.log('Error obteniendo mis slips: ' + err);
      }
    )
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editarPropiedadesSlip(slip) {
    sessionStorage.setItem('slip', JSON.stringify(slip));
    this.router.navigate(["/editar-solicitud"]);
  }

  abrirDocumentoSlip(slip) {
    window.open(slip.urlcompartir, "_blank");
  }

  obtenerVersiones(slip) {
    this.servicio.obtenerVersiones(slip.id).subscribe(
      (Response) => {
        console.log(Response);
      }, err => {
        console.log('Error obteniendo versiones: ' + err);
      }
    )
  }

  ReasignarSlip(slip) {

    this.dialog.open(modalReasignar, {
      height: '300px',
      width: '600px',
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(modalReasignar, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}

@Component({
  selector: 'modalReasignar',
  templateUrl: 'modalReasignar.html',
  styleUrls: ['./mis-solicitudes.component.css']
})
export class modalReasignar {
  ObjUsuariosSlip: any;
  hiddenAlerta: boolean;
  constructor(private servicio: SPServicio) {
    this.hiddenAlerta = true;
  }

  ngOnInit(): void {
    this.obtenerUsuariosSlip();
  }

  obtenerUsuariosSlip() {
    this.servicio.obtenerIntegrantesSlip().subscribe(
      (respuesta) => {
        this.ObjUsuariosSlip = respuesta;
      }
    );
  }

  Reasignar() {
    this.hiddenAlerta = false;
  }
}




