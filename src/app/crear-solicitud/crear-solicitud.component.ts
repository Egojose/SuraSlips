import { Component, OnInit } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {

  NombreAsesor;
  registerForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {
    setTheme('bs4');
  }

  ngOnInit() {
    this.NombreAsesor = "Pepito Perez";
    this.registerForm = this.formBuilder.group({
      fechaSolicitud: ['', Validators.required],
      cliente: ['', Validators.required],
      correoElectronico: ['', [Validators.required, Validators.email]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    alert('SUCCESS!! :-)')
  }

}
