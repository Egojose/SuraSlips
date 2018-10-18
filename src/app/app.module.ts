import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CrearSolicitudComponent } from './crear-solicitud/crear-solicitud.component';
import { EditarSolicitudComponent } from './editar-solicitud/editar-solicitud.component';
import { DescargarPlantillasComponent } from './descargar-plantillas/descargar-plantillas.component';
import { MisSolicitudesComponent } from './mis-solicitudes/mis-solicitudes.component';

@NgModule({
  declarations: [
    AppComponent,
    CrearSolicitudComponent,
    EditarSolicitudComponent,
    DescargarPlantillasComponent,
    MisSolicitudesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
