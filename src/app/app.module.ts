import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { AlertModule } from 'ngx-bootstrap/alert';

import { AppComponent } from './app.component';
import { CrearSolicitudComponent } from './crear-solicitud/crear-solicitud.component';
import { EditarSolicitudComponent } from './editar-solicitud/editar-solicitud.component';
import { DescargarPlantillasComponent } from './descargar-plantillas/descargar-plantillas.component';
import { MisSolicitudesComponent } from './mis-solicitudes/mis-solicitudes.component';
import { MenuComponent } from './menu/menu.component';
import { SPServicio } from './servicios/sp.servicio';
import { ModalModule } from 'ngx-bootstrap/modal';

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
    HttpClientModule,
    ReactiveFormsModule,
    DataTablesModule,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    RouterModule.forRoot([
      {path:'',redirectTo:'/mis-solicitudes',pathMatch:'full'},
      {path:'mis-solicitudes',component:MisSolicitudesComponent},
      {path:'crear-solicitud', component:CrearSolicitudComponent},
      {path:'editar-solicitud', component:EditarSolicitudComponent},
      {path:'descargar-plantillas', component:DescargarPlantillasComponent}
    ])
  ],
  providers: [SPServicio],
  bootstrap: [AppComponent]
})
export class AppModule { }
