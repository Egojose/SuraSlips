import { Component, TemplateRef, OnInit } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../dominio/usuario';
import { TipoNegocio } from '../dominio/tipoNegocio';
import { SPServicio } from '../servicios/sp.servicio';
import { Estado } from '../dominio/estado';
import { TipoGestion } from '../dominio/tipoGestion';
import { TipoResponsable } from '../dominio/tipoResponsable';
import { SuraServicio } from '../servicios/sura.servicio';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Categoria } from '../dominio/categoria';
import { Slip } from '../dominio/slip';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {

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
  tiposResponsable: TipoResponsable[] = [];
  categorias: Categoria[] = [];
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
    private servicioModal: BsModalService) {
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
      cliente: ['', Validators.required],
      ddltipoNegocio: ['', Validators.required],
      tipoGestion: ['', Validators.required],
      responsable: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      correo2: ['', Validators.email],
      tipoResponsable: ['', Validators.required],
      tipoSlip: ['', Validators.required],
      solucion: ['', Validators.required],
      adjunto: [null, Validators.required]
    });
  }

  validarSeleccionEstado() {
    let valido = false;
    this.estados.forEach(estado => {
      if (estado.seleccionado) {
        valido = true;
      }
    });
    return valido;
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
        this.ObtenerTiposResponsable();
      }
    )
  }

  ObtenerTiposResponsable() {
    this.servicio.ObtenerTipoResponsables().subscribe(
      (Response) => {
        this.tiposResponsable = TipoResponsable.fromJsonList(Response);
        this.ObtenerCategorias();
      }
    )
  }

  ObtenerCategorias() {
    this.servicio.ObtenerCategorias().subscribe(
      (Response) => {
        this.categorias = Categoria.fromJsonList(Response);
        this.EstablecerValoresFormularios();
      }
    )
  }

  mostrarEstados(evento) {
    this.loading = true;
    let opciones = event.target['options'];
    let indiceseleccionado = opciones.selectedIndex;
    this.tipoNegocio = opciones[indiceseleccionado].text;
    let idTipoNegocio = evento.target.value;
    this.mostrarDivEstado = true;
    this.servicio.ObtenerEstadosPorTipoNegocio(idTipoNegocio).subscribe(
      (Response) => {
        this.estados = Estado.fromJsonList(Response);
        this.loading = false;
      }
    )
  }

  seleccionarEstado(estado: Estado) {
    this.limpiarEstadosSeleccionados();
    estado.seleccionado = !estado.seleccionado;
  }

  limpiarEstadosSeleccionados() {
    this.estados.forEach(estado => {
      estado.seleccionado = false;
    });
  }

  EstablecerValoresFormularios() {
    this.registerForm.setValue({
      fechaSolicitud: new Date(),
      fechaRenovacion: '',
      cliente: '',
      ddltipoNegocio: '',
      tipoGestion: '',
      responsable: '',
      correo: '',
      correo2: '',
      tipoResponsable: '',
      tipoSlip: '',
      solucion: '',
      adjunto: ''
    });
    this.loading = false;
  }

  HabilitarMultiplesSlips(objeto) {

  }

  buscarCliente(template: TemplateRef<any>) {
    let dniCliente = this.registerForm.controls["cliente"].value;
    if (dniCliente != "") {
      this.obtenerDatosCliente(dniCliente, template);
    } else {
      this.mostrarAlerta("DNI está vacío", "Debes escribir el DNI del cliente a buscar", template);
    }
  }

  obtenerDatosCliente(dni: string, template: TemplateRef<any>) {
    this.servicioClientes.obtenerToken().subscribe(respuesta => {
      this.obtenerClientesPorDNI(respuesta.access_token, dni, template);
    },
      error => {
        console.log(error);
      }
    );
  }

  obtenerClientesPorDNI(token: string, dni: string, template: TemplateRef<any>) {
    this.loading = true;
    this.servicioClientes.obtenerClientePorDNI(token, dni).subscribe(respuesta => {
      if (respuesta.totalSize > 0) {
        this.nombreCliente = respuesta.records[0].Name;
        this.dniCliente = respuesta.records[0].Id_Integracion__c;
      }
      else {
        this.LimpiarDatosCliente();
        this.mostrarAlerta("DNI inválido", "No se encuentra un cliente con el DNI específicado", template);
      }
      this.loading = false;
    },
      error => {
        console.log(error);
      }
    );
  }

  LimpiarDatosCliente() {
    this.nombreCliente = "";
    this.dniCliente = "";
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

  ValidacionArchivo(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'docx') {
      return true;
    }
    else {
      return false;
    }
  }

  validarExtensionArchivo(evento, template: TemplateRef<any>) {
    if (evento.target.files && evento.target.files[0]) {
      let files = evento.target.files;
      if (!this.ValidacionArchivo(files[0].name)) {
        this.mostrarAlerta("Formato no válido", "Este formato no es válido, por favor adjunte un formato .docx", template);
        evento.srcElement.value = null;
      }
      this.documento = files[0];
    } else {
      evento.srcElement.value = null;
    }
  }

  onSubmit(template: TemplateRef<any>) {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.guardarSlip(template);
  }

  guardarSlip(template: TemplateRef<any>) {
    let valorFechaRenovacion = this.registerForm.controls["fechaRenovacion"].value;
    let valorCliente = this.registerForm.controls["cliente"].value;
    let valorLabelCliente = this.nombreCliente;
    let valorDniCliente = this.dniCliente;
    let valorTipoSlip = this.registerForm.controls["tipoSlip"].value;
    let valorTipoNegocio = this.tipoNegocio;
    let valorEstado = this.obtenerEstadoSeleccionado();
    let valorTipoGestion = this.registerForm.controls["tipoGestion"].value;
    let valorResponsable = this.registerForm.controls["responsable"].value;
    let valorCorreo = this.registerForm.controls["correo"].value;
    let valorCorreo2 = this.registerForm.controls["correo2"].value;
    let valorConCopiaA = this.registerForm.controls["tipoResponsable"].value;
    let valorSolucion = this.registerForm.controls["solucion"].value;
    let sufijoArchivo = this.generarllaveDocumento();
    this.slipGuardar = new Slip(valorFechaRenovacion, valorDniCliente, valorLabelCliente, valorTipoNegocio, valorEstado, valorTipoGestion, valorResponsable, valorCorreo, valorCorreo2, valorConCopiaA, valorSolucion);

    this.loading = true;
    this.servicio.agregarSlipDocumento(sufijoArchivo, this.documento).then(
      (respuesta) => {
        this.obtenerItemBiblioteca(respuesta, template);
      }, error => {
        console.log(error);
      }
    );
  }

  obtenerItemBiblioteca(respuesta, template: TemplateRef<any>) {
    respuesta.file.getItem("ID").then(
      (item) => {
        this.actualizarPropiedadesDocumento(item, template);
      }, error => {
        console.log(error);
      }
    );
  }

  actualizarPropiedadesDocumento(item, template: TemplateRef<any>) {
    this.servicio.actualizarSlipDocumento(this.slipGuardar, item["ID"]).then(
      (respuesta) => {
        this.mostrarAlertaGuardado(template);
        this.limpiarFormulario();
        this.loading = false;
      }, error => {
        console.log(error);
      }
    );
  }

  mostrarAlertaGuardado(template: TemplateRef<any>): any {
    this.mostrarAlerta("Slip Guardado", "El slip fue guardado correctamente, lo puedes observar en mis solicitudes", template);
  }

  limpiarFormulario(): any {
    this.EstablecerValoresFormularios();
  }

  generarllaveDocumento(): string {
    var fecha = new Date();
    var valorprimitivo = fecha.valueOf().toString();
    return valorprimitivo;
  }

  obtenerEstadoSeleccionado(): string {
    let valorEstadoSeleccionado;
    this.estados.forEach(estado => {
      if (estado.seleccionado) {
        valorEstadoSeleccionado = estado.title;
      }
    });
    return valorEstadoSeleccionado;
  }

}
