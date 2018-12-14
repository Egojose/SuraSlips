import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';
import { AlertModule } from 'ngx-bootstrap/alert';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CrearSolicitudComponent } from './crear-solicitud/crear-solicitud.component';
import { EditarSolicitudComponent } from './editar-solicitud/editar-solicitud.component';
import { DescargarPlantillasComponent } from './descargar-plantillas/descargar-plantillas.component';
import { MisSolicitudesComponent, modalReasignar } from './mis-solicitudes/mis-solicitudes.component';
import { MenuComponent } from './menu/menu.component';

import { SPServicio } from './servicios/sp.servicio';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NumberDirective } from './directivas/numbers-only.directive';
import { MatTableModule, MatFormFieldModule, MatInputModule, MatMenuModule, MatDialogModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatButtonModule } from '@angular/material';
import { SuraServicio } from './servicios/sura.servicio';

@NgModule({
  declarations: [
    AppComponent,
    CrearSolicitudComponent,
    EditarSolicitudComponent,
    DescargarPlantillasComponent,
    MisSolicitudesComponent,
    MenuComponent,
    NumberDirective,
    modalReasignar
  ],
  entryComponents: [modalReasignar],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DataTablesModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
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
  providers: [SPServicio, SuraServicio],
  bootstrap: [AppComponent]
})
export class AppModule { }
