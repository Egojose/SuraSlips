import { Component, OnInit } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../dominio/usuario';
import { TipoNegocio } from '../dominio/tipoNegocio';
import { SPServicio } from '../servicios/sp.servicio';
import { Estado } from '../dominio/estado';
import { TipoGestion } from '../dominio/tipoGestion';
import { TipoResponsable } from '../dominio/tipoResponsable';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {

  usuarioActual: Usuario;
  nombreUsuario: string;
  registerForm: FormGroup;
  tiposNegocio: TipoNegocio[] = [];
  tiposGestion: TipoGestion[] = [];
  tiposResponsable: TipoResponsable[] = [];
  mostrarDivEstado = false;
  estados: Estado[] = [];
  submitted = false;

  constructor(private formBuilder: FormBuilder, private servicio: SPServicio) {
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
      tipoResponsable:['', Validators.required]
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
      tipoResponsable: ''
    });
  }

  RecuperarUsuario() {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.nombreUsuario = this.usuarioActual.nombre;
  }

  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    alert('SUCCESS!! :-)')
  }

}
