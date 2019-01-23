import { Component } from '@angular/core';
import { Usuario } from './dominio/usuario';
import { SPServicio } from '../app/servicios/sp.servicio';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private servicio: SPServicio) { }

  title = 'Sura-Slips-Proyecto';
  idUsuario: number;
  nombreUsuario: string;
  emailUsuario: string;
  cerrarSesion: string;

  usuarioActual: Usuario;

  public ngOnInit() {
    this.ObtenerUsuarioActual();
  }

  ObtenerUsuarioActual() {
    this.servicio.ObtenerUsuarioActual().subscribe(
      (Response) => {
        this.idUsuario = Response.Id;
        this.nombreUsuario = Response.Title;
        this.emailUsuario = Response.Email;
        this.cerrarSesion = '/sites/intranet/negocio/seguros/slips/';
        this.usuarioActual = new Usuario(this.idUsuario, this.nombreUsuario, this.emailUsuario);
        sessionStorage.setItem('usuario', JSON.stringify(this.usuarioActual));
      }, err => {
        console.log('Error obteniendo usuario: ' + err);
      }
    );
  }

}
