import { Component, OnInit } from '@angular/core';
import { Slip } from '../dominio/slip';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Usuario } from '../dominio/usuario';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoNegocio } from '../dominio/tipoNegocio';
import { TipoGestion } from '../dominio/tipoGestion';
import { Formato } from '../dominio/formato';
import { Estado } from '../dominio/estado';
import { SPServicio } from '../servicios/sp.servicio';
import { SuraServicio } from '../servicios/sura.servicio';
import { Router } from '@angular/router';
import { setTheme } from 'ngx-bootstrap/utils';

@Component({
  selector: 'app-editar-solicitud',
  templateUrl: './editar-solicitud.component.html',
  styleUrls: ['./editar-solicitud.component.css']
})
export class EditarSolicitudComponent implements OnInit {

  slip: Slip;
  //Calendarios
  colorTheme = 'theme-blue';
  bsConfig: Partial<BsDatepickerConfig>;
  minDate: Date;
  maxDate: Date;
  loading: boolean;

  public modalRef: BsModalRef;
  usuarioActual: Usuario;
  nombreUsuario: string;
  registerForm: FormGroup;
  tiposNegocio: TipoNegocio[] = [];
  tiposGestion: TipoGestion[] = [];
  formatos: Formato[] = [];
  mostrarDivEstado = false;
  estados: Estado[] = [];
  nombreCliente: string;
  dniCliente: string;
  tipoNegocio: string;
  tituloModal: string;
  mensajeModal: string;
  documento: File;
  slipGuardar: Slip;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    private servicio: SPServicio,
    private servicioClientes: SuraServicio,
    private servicioModal: BsModalService, 
    private router: Router) {
    setTheme('bs4');
    this.minDate = new Date();
    this.maxDate = new Date();
    this.minDate.setDate(this.minDate.getDate());
    this.maxDate.setDate(this.maxDate.getDate() + 365000);
    this.loading = true;
  }

  aplicarTema() {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  recuperarSlip(){
    this.slip = JSON.parse(sessionStorage.getItem('slip'));
  }

  RecuperarUsuario() {
    this.nombreUsuario = this.slip.CreadoPor.Title;
  }

  RegistrarFormulario() {
    this.registerForm = this.formBuilder.group({
      fechaSolicitud: [''],
      fechaRenovacion: ['', Validators.required],
      tipoIdentificacionCliente: ['', Validators.required],
      cliente: ['', Validators.required],
      ddltipoNegocio: ['', Validators.required],
      tipoGestion: ['', Validators.required],
      responsable: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      correo2: ['', Validators.email],
      correo3: ['', Validators.email],
      tipoFormato: ['', Validators.required]
    });
  }

  ObtenerTipoNegocio() {
    this.servicio.ObtenerTipoNegocio().subscribe(
      (Response) => {
        this.tiposNegocio = TipoNegocio.fromJsonList(Response);
        this.ObtenerTiposGestion();
      }
    )
  }

  ObtenerTiposGestion() {
    this.servicio.ObtenerTiposGestion().subscribe(
      (Response) => {
        this.tiposGestion = TipoGestion.fromJsonList(Response);
        this.ObtenerFormatosSlips();
      }
    )
  }

  ObtenerFormatosSlips(){
    this.servicio.ObtenerFormatosSlips().subscribe(
      (Response) => {
        this.formatos = Formato.fromJsonList(Response);
        this.EstablecerValoresFormularios();
        this.loading = false;
      }
    )
  }

  EstablecerValoresFormularios() {
    this.registerForm.setValue({
      fechaSolicitud: this.parseDate(this.slip.fechaCreacion),
      fechaRenovacion: this.parseDate(this.slip.fechaRenovacion),
      tipoIdentificacionCliente: this.slip.tipoIdentificacionCliente,
      cliente: this.slip.dniCliente,
      ddltipoNegocio: this.slip.tipoNegocio,
      tipoGestion: this.slip.tipoGestion,
      responsable: this.slip.responsable,
      correo: this.slip.correo1,
      correo2: this.slip.correo2,
      correo3: this.slip.correo3,
      tipoFormato: this.slip.formatoSLIP
    });
    this.cargarNombreCliente();
  }

  cargarNombreCliente(): any {
    this.nombreCliente = this.slip.nombreCliente;
  }

  parseDate(input) {
    var parts = input.match(/(\d+)/g);
    return new Date(parts[0], parts[1] - 1, parts[2]); 
}

  ngOnInit() {
    this.aplicarTema();
    this.recuperarSlip();
    this.RecuperarUsuario();
    this.RegistrarFormulario();
    this.ObtenerTipoNegocio();
  }
}
