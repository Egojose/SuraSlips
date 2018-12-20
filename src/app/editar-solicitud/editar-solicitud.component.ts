import { Component, OnInit, TemplateRef } from '@angular/core';
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
  loading: boolean;

  public modalRef: BsModalRef;
  usuarioActual: Usuario;
  nombreUsuario: string;
  registerForm: FormGroup;
  tiposNegocio: TipoNegocio[] = [];
  tipoNegocioConsulta: TipoNegocio;
  tiposGestion: TipoGestion[] = [];
  formatos: Formato[] = [];
  mostrarDivEstado = false;
  estados: Estado[] = [];
  estadoSeleccionado: string;
  nombreCliente: string;
  dniCliente: string;
  tipoNegocio: string;
  tituloModal: string;
  mensajeModal: string;
  slipActualizar: Slip;
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

  recuperarSlip() {
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

  ObtenerFormatosSlips() {
    this.servicio.ObtenerFormatosSlips().subscribe(
      (Response) => {
        this.formatos = Formato.fromJsonList(Response);
        this.cargarEstadosPorTipoNegocio();
      }
    )
  }


  EstablecerValoresFormularios() {
    this.registerForm.setValue({
      fechaSolicitud: this.parseDate(this.slip.fechaCreacion),
      fechaRenovacion: this.parseDate(this.slip.fechaRenovacion),
      tipoIdentificacionCliente: this.slip.tipoIdentificacionCliente,
      cliente: this.slip.dniCliente.substring(1),
      ddltipoNegocio: this.slip.tipoNegocio,
      rdbEstado: this.slip.estado,
      tipoGestion: this.slip.tipoGestion,
      responsable: this.slip.responsable,
      correo: this.slip.correo1,
      correo2: this.slip.correo2,
      correo3: this.slip.correo3,
      tipoFormato: this.slip.formatoSLIP
    });
    this.cargarNombreCliente();

  }

  cargarEstadosPorTipoNegocio() {
    let tipoNegocio = this.slip.tipoNegocio;
    this.servicio.ObtenerTipoNegocioPorNombre(tipoNegocio).subscribe(
      (Response) => {
        this.tipoNegocioConsulta = TipoNegocio.fromJsonList(Response)[0];
        this.servicio.ObtenerEstadosPorTipoNegocio(this.tipoNegocioConsulta.id).subscribe(
          (Response) => {
            this.mostrarDivEstado = true;
            this.estados = Estado.fromJsonList(Response);
            this.EstablecerValoresFormularios();
            this.loading = false;
          }
        )
      }
    )
  }

  get f() { return this.registerForm.controls; }

  mostrarEstados(evento) {
    this.loading = true;
    let opciones = event.target['options'];
    let indiceseleccionado = opciones.selectedIndex;
    this.tipoNegocio = opciones[indiceseleccionado].text;
    let tipoNegocio = evento.target.value;
    this.mostrarDivEstado = true;

    this.servicio.ObtenerTipoNegocioPorNombre(tipoNegocio).subscribe(
      (Response) => {
        this.tipoNegocioConsulta = TipoNegocio.fromJsonList(Response)[0];
        this.servicio.ObtenerEstadosPorTipoNegocio(this.tipoNegocioConsulta.id).subscribe(
          (Response) => {
            this.estados = Estado.fromJsonList(Response);
            this.loading = false;
          }
        )
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

  cargarNombreCliente(): any {
    this.nombreCliente = this.slip.nombreCliente;
  }

  parseDate(input) {
    var parts = input.match(/(\d+)/g);
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  onSubmit(template: TemplateRef<any>) {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    this.actualizarSlip(template);
  }

  actualizarSlip(template: TemplateRef<any>) {
    
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
    this.slipActualizar = new Slip("", null, valorFechaRenovacion, valorTipoIdentificacionCliente, valorDniCliente, valorLabelCliente, valorTipoNegocio, valorEstado, valorTipoGestion, valorResponsable, valorCorreo, valorCorreo2, valorCorreo3, null);
    this.slipActualizar.id = this.slip.id;
    if (valorLabelCliente == "") {
      this.mostrarAlerta("Verifique el cliente", "Por favor verifique el nombre del cliente", template);
    } else {
      this.servicio.actualizarPropiedadesSlip(this.slipActualizar).then(
        (respuesta) => {
          this.mostrarAlerta("Slip fue actualizado", "El slip fue actualizado con éxito", template);
          this.loading = false;
          this.router.navigate(['/mis-solicitudes']);
        }, error => {
          console.log(error);
          alert('Ha ocurrido un error al actualizar la actividad');
        }
      );
    }
  }

  buscarCliente(template: TemplateRef<any>) {
    let tipoIdentificacionCliente = this.registerForm.controls["tipoIdentificacionCliente"].value;
    let dniCliente = this.registerForm.controls["cliente"].value;
    if (tipoIdentificacionCliente != "" && dniCliente != "") {
      let dniBuscar;
      if (tipoIdentificacionCliente == "Cédula de ciudadanía") {
        dniBuscar = "C" + dniCliente;
      }
      if (tipoIdentificacionCliente == "Nit") {
        dniBuscar = "A" + dniCliente;
      }
      this.obtenerDatosCliente(dniBuscar, template);
    } else {
      if (tipoIdentificacionCliente == "") {
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
      }
    );
  }

  mostrarAlerta(titulo: string, mensaje: string, template: TemplateRef<any>) {
    this.tituloModal = titulo;
    this.mensajeModal = mensaje;
    this.modalRef = this.servicioModal.show(template);
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

  ngOnInit() {
    this.aplicarTema();
    this.recuperarSlip();
    this.RecuperarUsuario();
    this.RegistrarFormulario();
    this.ObtenerTipoNegocio();
  }
}
