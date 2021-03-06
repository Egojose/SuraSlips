import { Component, TemplateRef, OnInit } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../dominio/usuario';
import { TipoNegocio } from '../dominio/tipoNegocio';
import { SPServicio } from '../servicios/sp.servicio';
import { Estado } from '../dominio/estado';
import { TipoGestion } from '../dominio/tipoGestion';
import { SuraServicio } from '../servicios/sura.servicio';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Slip } from '../dominio/slip';
import { Formato } from '../dominio/formato';
import { ItemAddResult } from 'sp-pnp-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {

  // Calendarios
  colorTheme = 'theme-blue';
  bsConfig: Partial<BsDatepickerConfig>;
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
  slipGuardar: Slip;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
    private servicio: SPServicio,
    private servicioClientes: SuraServicio,
    private servicioModal: BsModalService,
    private router: Router) {
    setTheme('bs4');
    this.loading = true;
  }

  aplicarTema() {
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
  }

  ngOnInit() {
    this.aplicarTema();
    this.RecuperarUsuario();
    this.RegistrarFormulario();
    this.ObtenerTipoNegocio();
  }

  RegistrarFormulario() {
    this.registerForm = this.formBuilder.group({
      fechaSolicitud: [''],
      fechaRenovacion: ['', Validators.required],
      tipoIdentificacionCliente: ['', Validators.required],
      cliente: ['', Validators.required],
      ddltipoNegocio: ['', Validators.required],
      rdbEstado: ['', Validators.required],
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
    );
  }

  ObtenerTiposGestion() {
    this.servicio.ObtenerTiposGestion().subscribe(
      (Response) => {
        this.tiposGestion = TipoGestion.fromJsonList(Response);
        this.ObtenerFormatosSlips();
      }
    );
  }

  ObtenerFormatosSlips() {
    this.servicio.ObtenerFormatosSlips().subscribe(
      (Response) => {
        this.formatos = Formato.fromJsonList(Response);
        this.EstablecerValoresFormularios();
        this.loading = false;
      }
    );
  }

  mostrarEstados(evento) {
    this.loading = true;
    let opciones = evento.target['options'];
    let indiceseleccionado = opciones.selectedIndex;
    this.tipoNegocio = opciones[indiceseleccionado].text;
    let idTipoNegocio = evento.target.value;
    this.mostrarDivEstado = true;
    this.servicio.ObtenerEstadosPorTipoNegocio(idTipoNegocio).subscribe(
      (Response) => {
        this.estados = Estado.fromJsonList(Response);
        this.loading = false;
      }
    );
  }

  EstablecerValoresFormularios() {
    this.registerForm.setValue({
      fechaSolicitud: new Date(),
      fechaRenovacion: '',
      tipoIdentificacionCliente: '',
      cliente: '',
      ddltipoNegocio: '',
      rdbEstado: '',
      tipoGestion: '',
      responsable: '',
      correo: '',
      correo2: '',
      correo3: '',
      tipoFormato: ''
    });
    this.loading = false;
  }

  buscarCliente(template: TemplateRef<any>) {
    let tipoIdentificacionCliente = this.registerForm.controls["tipoIdentificacionCliente"].value;
    let dniCliente = this.registerForm.controls["cliente"].value;
    if (tipoIdentificacionCliente != "" && dniCliente != "") {
      let dniBuscar;
      if (tipoIdentificacionCliente == "Cédula de ciudadanía") {
        dniBuscar = "C" + dniCliente;
      }
      if (tipoIdentificacionCliente === 'Nit') {
        dniBuscar = 'A' + dniCliente;
      }
      this.obtenerDatosCliente(dniBuscar, template);
    } else {
      if (tipoIdentificacionCliente == '') {
        this.mostrarAlerta("Tipo de identificación del cliente está vacío", "Debes de seleccionar un tipo de identificación para poder buscar el cliente", template);
      } else {
        this.mostrarAlerta("DNI está vacío", "Debes escribir el DNI del cliente a buscar", template);
      }
    }
  }

  obtenerDatosCliente(dni: string, template: TemplateRef<any>) {
    this.servicioClientes.obtenerToken().subscribe(respuesta => {
      this.obtenerClientesPorDNI(respuesta.access_token, dni, template);
    },
      error => {
        console.log(error);
        console.log('Consulta en la lista local');

        this.servicio.obtenerClienteDesdeListaLocal(dni).subscribe(respuesta => {
          if (respuesta.length > 0) {
            this.nombreCliente = respuesta[0].Title;
            this.dniCliente = dni;
          } else {
            this.LimpiarDatosCliente();
            this.mostrarAlerta('DNI inválido', 'No se encuentra un cliente con el DNI específicado', template);
          }
        });

      }
    );
  }

  obtenerClientesPorDNI(token: string, dni: string, template: TemplateRef<any>) {
    this.loading = true;
    this.servicioClientes.obtenerClientePorDNI(token, dni).subscribe(respuesta => {
      if (respuesta.totalSize > 0) {
        this.nombreCliente = respuesta.records[0].Name;
        this.dniCliente = respuesta.records[0].Id_Integracion__c;
      } else {
        this.LimpiarDatosCliente();
        this.mostrarAlerta('DNI inválido', 'No se encuentra un cliente con el DNI específicado', template);
      }
      this.loading = false;
    },
      error => {
        console.log(error);
      }
    );
  }

  LimpiarDatosCliente() {
    this.nombreCliente = '';
    this.dniCliente = '';
  }

  RecuperarUsuario() {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.nombreUsuario = this.usuarioActual.nombre;
  }

  get f() { return this.registerForm.controls; }

  mostrarAlerta(titulo: string, mensaje: string, template: TemplateRef<any>) {
    this.tituloModal = titulo;
    this.mensajeModal = mensaje;
    this.modalRef = this.servicioModal.show(template);
  }

  onSubmit(template: TemplateRef<any>) {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.guardarSlip(template);
  }

  guardarSlip(template: TemplateRef<any>) {
    this.loading = true;
    let valorFechaRenovacion = this.registerForm.controls["fechaRenovacion"].value;
    let valorTipoIdentificacionCliente = this.registerForm.controls["tipoIdentificacionCliente"].value;
    let valorLabelCliente = this.nombreCliente;
    let valorDniCliente = this.dniCliente;
    let valorTipoNegocio = this.tipoNegocio;
    let valorEstado = this.registerForm.controls["rdbEstado"].value;
    let valorTipoGestion = this.registerForm.controls["tipoGestion"].value;
    let valorResponsable = this.registerForm.controls["responsable"].value;
    let valorCorreo = this.registerForm.controls["correo"].value;
    let valorCorreo2 = this.registerForm.controls["correo2"].value;
    let valorCorreo3 = this.registerForm.controls["correo3"].value;
    let valorFormatoSlip = this.registerForm.controls["tipoFormato"].value;
    let identificadorSlip = "SLIP-" + this.generarllaveDocumento();
    this.slipGuardar = new Slip(
                        identificadorSlip,
                        new Date(),
                        valorFechaRenovacion,
                        valorTipoIdentificacionCliente,
                        valorDniCliente,
                        valorLabelCliente,
                        valorTipoNegocio,
                        valorEstado,
                        valorTipoGestion,
                        valorResponsable,
                        valorCorreo,
                        valorCorreo2,
                        valorCorreo3,
                        valorFormatoSlip,
                        this.usuarioActual.id);

    if (valorLabelCliente === '') {
      this.mostrarAlerta('Verifique el cliente', 'Por favor verifique el nombre del cliente', template);
    } else {
      this.servicio.agregarSLIPinformacion(this.slipGuardar).then(
        (iar: ItemAddResult) => {
          this.mostrarAlerta('Slip fue guardado', 'El slip fue guardado con éxito, en breve le llegará una notificación', template);
          this.loading = false;
          this.router.navigate(['/mis-solicitudes']);
        }, err => {
          alert('Error en la creación del SLIP!!');
        }
      );
    }
  }

  mostrarAlertaGuardado(template: TemplateRef<any>): any {
    this.mostrarAlerta('Slip Guardado', 'El slip fue guardado correctamente, lo puedes observar en mis solicitudes', template);
  }

  generarllaveDocumento(): string {
    const fecha = new Date();
    const valorprimitivo = fecha.valueOf().toString();
    return valorprimitivo;
  }

}
