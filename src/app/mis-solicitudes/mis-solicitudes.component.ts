import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from '../dominio/usuario';
import { SPServicio } from '../servicios/sp.servicio';
import { Slip } from '../dominio/slip';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { historialVersiones } from '../dominio/historialVersiones';

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
        else {
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
    console.log(slip);
    sessionStorage.setItem('slip', JSON.stringify(slip));
    this.dialog.open(modalHistorialVersiones, {
      height: '400px',
      width: '700px',
    });
  }

  ReasignarSlip(slip) {
    sessionStorage.setItem('slip', JSON.stringify(slip));
    this.dialog.open(modalReasignar, {
      height: '300px',
      width: '600px',
    });
  }

  EnvioCliente(slip) {
    sessionStorage.setItem('slip', JSON.stringify(slip));
    const dialogRef = this.dialog.open(modalEnvioCliente, {
      height: '380px',
      width: '600px',
    });
  }
}

@Component({
  selector: 'modalReasignar',
  templateUrl: 'modalReasignar.html',
  styleUrls: ['./mis-solicitudes.component.css']
})
export class modalReasignar {
  slip: Slip;
  ObjUsuariosSlip: any;
  hiddenSuccess: boolean;
  hiddenError: boolean;
  reasignarForm: FormGroup;
  submitted: boolean;
  UsuarioReasignar: any;
  IdSlip: any;
  ReasignarControl: FormControl;
  ReasignarId: any;

  constructor(private servicio: SPServicio, private formBuilder: FormBuilder, private routerReasignar: Router) {
    this.hiddenSuccess = true;
    this.hiddenError = true;
  }

  recuperarSlip() {
    this.slip = JSON.parse(sessionStorage.getItem('slip'));
  }

  registrarControles() {
    this.ReasignarControl = new FormControl('', [
      Validators.required
    ]);
  }

  ngOnInit(): void {
    this.recuperarSlip();
    this.registrarControles();
    this.obtenerUsuariosSlip();
  }

  Reasignar() {
    this.ReasignarControl.markAsTouched();
    if (this.ReasignarControl.status == "INVALID") {
      return;
    }

    this.servicio.actualizarColumnaReasignar(this.slip, this.ReasignarId).then(
      (respuesta) => {
        this.hiddenSuccess = false;
        setTimeout(function () { window.location.href = "/"; }, 2000);
      }, error => {
        console.log(error);
        this.hiddenError = false;
      }
    );
  }

  obtenerUsuariosSlip() {
    this.servicio.obtenerIntegrantesSlip().subscribe(
      (respuesta) => {
        this.ObjUsuariosSlip = respuesta;
      }
    );
  }
}

@Component({
  selector: 'modalHistorialVersiones',
  templateUrl: 'modalHistorialVersiones.html',
  styleUrls: ['./mis-solicitudes.component.css']
})
export class modalHistorialVersiones {
  slip: Slip;
  dsHistorialVersiones: any;
  ObjHistorialVersiones: historialVersiones[] = [];
  constructor(private servicio: SPServicio) {

  }

  displayedColumns: string[] = ['numero', 'Modificado', 'ModificadoPor', "VerDocumento"];
  dataSource;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  recuperarSlip() {
    this.slip = JSON.parse(sessionStorage.getItem('slip'));
  }

  ObtenerVersionesDocumento() {
    this.servicio.obtenerVersiones(this.slip).subscribe(
      (Response) => {
        console.log(Response);
        this.ObjHistorialVersiones = historialVersiones.fromJsonList(Response);
        this.dsHistorialVersiones = new MatTableDataSource(this.ObjHistorialVersiones);
        this.dsHistorialVersiones.paginator = this.paginator;
      }, err => {
        console.log('Error obteniendo versiones: ' + err);
      }
    )
  }

  ngOnInit(): void {
    this.recuperarSlip();
    this.ObtenerVersionesDocumento();
  }
}

@Component({
  selector: 'modalEnvioCliente',
  templateUrl: 'modalEnvioCliente.html',
  styleUrls: ['./mis-solicitudes.component.css']
})

export class modalEnvioCliente {
  ObjSlip: Slip;
  hiddenSuccess: boolean;
  hiddenError: boolean;

  constructor(private servicio: SPServicio, public dialogRef: MatDialogRef<modalEnvioCliente>) {
    this.hiddenSuccess = true;
    this.hiddenError = true;
  }

  ngOnInit(): void {
    this.ObjSlip = JSON.parse(sessionStorage.getItem('slip'));
  }

  EnviarSLIP() {
    this.servicio.actualizarColumnaEnvioCliente(this.ObjSlip).then(
      (respuesta) => {
        this.hiddenSuccess = false;
      }, error => {
        console.log(error);
        this.hiddenError = false;
      }
    );
  }

  onNoClick() {
    this.dialogRef.close();
  }
}