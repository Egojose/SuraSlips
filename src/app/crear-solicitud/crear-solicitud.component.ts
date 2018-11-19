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

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {

  public modalRef: BsModalRef;
  usuarioActual: Usuario;
  nombreUsuario: string;
  registerForm: FormGroup;
  tiposNegocio: TipoNegocio[] = [];
  tiposGestion: TipoGestion[] = [];
  tiposResponsable: TipoResponsable[] = [];
  mostrarDivEstado = false;
  estados: Estado[] = [];
  nombreCliente: string;
  dniCliente: string;
  tituloModal : string;
  mensajeModal : string;
  submitted = false;

  constructor(private formBuilder: FormBuilder, 
    private servicio: SPServicio, 
    private servicioClientes: SuraServicio, 
    private servicioModal: BsModalService) {
    setTheme('bs4');
  }

  ngOnInit() {
    this.RecuperarUsuario();
    this.RegistrarFormulario();
    this.ObtenerTipoNegocio();
  }

  RegistrarFormulario() {
    this.registerForm = this.formBuilder.group({
      fechaSolicitud: ['', Validators.required],
      fechaRenovacion: ['', Validators.required],
      cliente: ['', Validators.required],
      ddltipoNegocio: ['', Validators.required],
      tipoGestion: ['', Validators.required],
      responsable: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      tipoResponsable:['', Validators.required],
      tipoSlip:['', Validators.required]
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

  ObtenerTiposGestion(){
    this.servicio.ObtenerTiposGestion().subscribe(
      (Response) => {
        this.tiposGestion = TipoGestion.fromJsonList(Response);
        this.ObtenerTiposResponsable();
      }
    )
  }

  ObtenerTiposResponsable(){
    this.servicio.ObtenerTipoResponsables().subscribe(
      (Response) => {
        this.tiposResponsable = TipoResponsable.fromJsonList(Response);
        this.EstablecerValoresFormularios();
      }
    )
  }

  mostrarEstados(tipoNegocioId){
    this.mostrarDivEstado = true;
    this.servicio.ObtenerEstadosPorTipoNegocio(tipoNegocioId).subscribe(
      (Response) => {
        this.estados = Estado.fromJsonList(Response);
      }
    )
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
      tipoResponsable: '',
      tipoSlip: ''
    });
  }

  HabilitarMultiplesSlips(objeto){

  }

  buscarCliente(template: TemplateRef<any>){
    let dniCliente = this.registerForm.controls["cliente"].value;
    if(dniCliente != ""){
      this.obtenerDatosCliente(dniCliente, template);
    }else{
      this.mostrarAlerta("DNI está vacío", "Debes escribir el DNI del cliente a buscar",template);
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

  obtenerClientesPorDNI(token: string, dni: string, template: TemplateRef<any>){
    this.servicioClientes.obtenerClientePorDNI(token, dni).subscribe(respuesta => {  
      if(respuesta.totalSize > 0){
        this.nombreCliente = respuesta.records[0].Name;
        this.dniCliente = respuesta.records[0].Id_Integracion__c;
      }
      else{
        this.mostrarAlerta("DNI inválido", "No se encuentra un cliente con el DNI específicado",template);
      }
    },
      error => {
        console.log(error);
      }
    );
  }

  RecuperarUsuario() {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.nombreUsuario = this.usuarioActual.nombre;
  }

  get f() { return this.registerForm.controls; }

  mostrarAlerta(titulo: string, mensaje : string, template: TemplateRef<any>){
        this.tituloModal = titulo;
        this.mensajeModal = mensaje;
        this.modalRef = this.servicioModal.show(template);
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    alert('SUCCESS!! :-)')
  }

}
