import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppComponent } from './app.component';
import { CrearSolicitudComponent } from './crear-solicitud/crear-solicitud.component';
import { EditarSolicitudComponent } from './editar-solicitud/editar-solicitud.component';
import { DescargarPlantillasComponent } from './descargar-plantillas/descargar-plantillas.component';
import { MisSolicitudesComponent } from './mis-solicitudes/mis-solicitudes.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    CrearSolicitudComponent,
    EditarSolicitudComponent,
    DescargarPlantillasComponent,
    MisSolicitudesComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    RouterModule.forRoot([
      {path:'',redirectTo:'/mis-solicitudes',pathMatch:'full'},
      {path:'mis-solicitudes',component:MisSolicitudesComponent},
      {path:'crear-solicitud', component:CrearSolicitudComponent},
      {path:'editar-solicitud', component:EditarSolicitudComponent},
      {path:'descargar-plantillas', component:DescargarPlantillasComponent}
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
