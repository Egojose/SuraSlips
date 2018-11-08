import { Component, OnInit } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../dominio/usuario';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {

  usuarioActual: Usuario;
  nombreUsuario: string;

  private fieldArray: Array<any> = [];
  private newAttribute: any = {};

  registerForm: FormGroup;
  multipleSlips = false;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {
    setTheme('bs4');
  }

  addFieldValue() {
    this.fieldArray.push(this.newAttribute)
    this.newAttribute = {};
}

deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
}

  ngOnInit() {
    
    this.RecuperarUsuario();

    this.registerForm = this.formBuilder.group({
      fechaSolicitud: ['', Validators.required],
      fechaRenovacion: ['', Validators.required],
      cliente: ['', Validators.required],
      tipoSlip: ['', Validators.required],
    });
  }

  RecuperarUsuario() {
    this.usuarioActual = JSON.parse(sessionStorage.getItem('usuario'));
    this.nombreUsuario = this.usuarioActual.nombre;
  }

  generarSlips(objeto){
    console.log(objeto);

    if(objeto == "Simple"){
      this.multipleSlips = false;
    }
    if(objeto == "Múltiple"){
      this.multipleSlips = true;
    }
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
