import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { default as pnp, ItemAddResult, CamlQuery } from 'sp-pnp-js';
import { environment } from '../../environments/environment';
import { Slip } from '../dominio/slip';

@Injectable()
export class SPServicio {
    constructor() { }

    public obtenerConfiguracion() {
        const configuracionSharepoint = pnp.sp.configure({
            headers: {
                "Accept": "application/json; odata=verbose"
            }
        }, environment.urlWeb);

        return configuracionSharepoint;
    }

    public ObtenerConfiguracionConPost() {
        const configuracionSharepoint = pnp.sp.configure({
            headers: {
                "Accept": "application/json; odata=verbose",
                'Content-Type': 'application/json;odata=verbose',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSIsImtpZCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvc3VyYW1lcmljYW5hLnNoYXJlcG9pbnQuY29tQDNjMGJkNGZlLTExMTEtNGQxMy04ZTBjLTdjMzNiOWViNzU4MSIsImlzcyI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEAzYzBiZDRmZS0xMTExLTRkMTMtOGUwYy03YzMzYjllYjc1ODEiLCJpYXQiOjE1NDUxNDM5OTUsIm5iZiI6MTU0NTE0Mzk5NSwiZXhwIjoxNTQ1MTczMDk1LCJpZGVudGl0eXByb3ZpZGVyIjoiMDAwMDAwMDEtMDAwMC0wMDAwLWMwMDAtMDAwMDAwMDAwMDAwQDNjMGJkNGZlLTExMTEtNGQxMy04ZTBjLTdjMzNiOWViNzU4MSIsIm5hbWVpZCI6IjRmNjQ0ODkyLWFkN2ItNDZjMC1hMGU0LTAzNjVhMzk2NWFmZUAzYzBiZDRmZS0xMTExLTRkMTMtOGUwYy03YzMzYjllYjc1ODEiLCJvaWQiOiIyNmIwOTQxNC1hNDRlLTQ5NjMtYmY5MC04ZTlkMTI4ZjA4ZDQiLCJzdWIiOiIyNmIwOTQxNC1hNDRlLTQ5NjMtYmY5MC04ZTlkMTI4ZjA4ZDQiLCJ0cnVzdGVkZm9yZGVsZWdhdGlvbiI6ImZhbHNlIn0.Yd1-95LYuf8RCgL3VKSc5s-Ea6yuDrwA9KHIAY26kmi3-xVxTUpqAQCdO2yL0cPgo2SkwbqvOetxYFqX8WXG3t03bTqE285bswnQMVSG5Jep8dGEc2SpYREkzWI5xKm2CLzm9Ui7spjYX9_MmKAEIzrAqGEzYxYbSmDvtMINvzxZAdRuZex3zex4xRUaOnx33cqwD40ao9nrWqNXpHQWaI9U6GIzewz6Zvntlf85B57M2y6LxLCJFvcc1m49IQ_aBa4E5vuRQC5dkA0HXrrUCiZsWU6E6eZ_Q0kLVPZP3tXdh18fJpJ-zkSqjXgcJBZe_lAgfz1Ozk7ZUdNMHd3LeQ'
            }
        }, environment.urlWeb);

        return configuracionSharepoint;
    }

    ObtenerInformacionSitio() {
        let respuesta = from(this.obtenerConfiguracion().web.get());
        return respuesta;
    }

    ObtenerUsuarioActual() {
        let respuesta = from(this.obtenerConfiguracion().web.currentUser.get());
        return respuesta;
    }

    ObtenerTipoNegocio() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaTipoNegocio).items.getAll());
        return respuesta;
    }

    ObtenerEstadosPorTipoNegocio(tipoNegocioId: number) {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaEstadosPorTipoNegocio).items.filter("TipoNegocioId eq " + tipoNegocioId).get());
        return respuesta;
    }

    ObtenerTipoNegocioPorNombre(tipoNegocio: string){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaTipoNegocio).items.filter(`Title eq '${tipoNegocio}'`).get());
        return respuesta;
    }

    agregarSlipDocumento(sufijo: string, documento: File) {
        return this.obtenerConfiguracion().web.getFolderByServerRelativeUrl(environment.urlReltativa + environment.bibliotecaSlips).files.add(sufijo + "-" + documento.name, documento, true);
    }

    agregarSLIPinformacion(slip: Slip) {
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaSlipsAuxiliar).items.add({
            Title: slip.titulo,
            TipoIdentificacionCliente: slip.tipoIdentificacionCliente,
            Cliente: slip.nombreCliente,
            DNICliente: slip.dniCliente,
            FechaRenovacion: slip.fechaRenovacion,
            TipoNegocio: slip.tipoNegocio,
            EstadoSlip: slip.estado,
            TipoGestion: slip.tipoGestion,
            Responsable: slip.responsable,
            Correo1: slip.correo1,
            Correo2: slip.correo2,
            Correo3: slip.correo3,
            FormatoSLIP: slip.formatoSLIP,
            CreadorSlipId: slip.CreadoPor
        });
    }

    ObtenerTiposGestion() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaTipoGestion).items.getAll());
        return respuesta;
    }

    ObtenerTipoResponsables() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaTipoResponsables).items.getAll());
        return respuesta;
    }

    ObtenerPlantillasDescargas() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaDescargaPlantillas).items.orderBy("OrdenPlantilla", true).getAll());
        return respuesta;
    }

    ObtenerGruposUsuario(idUSuario: number) {
        let respuesta = from(this.obtenerConfiguracion().web.siteUsers.getById(idUSuario).groups.get());
        return respuesta;
    }

    ObtenerCategorias() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCategorias).items.orderBy("Title", true).getAll());
        return respuesta;
    }

    ObtenerFormatosSlips() {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.bibliotecaPlantillas).items.select("FieldValuesAsText/FileRef", "Title", "ID").expand("FieldValuesAsText").get());
        return respuesta;
    }

    ObtenerElementosPorCaml(nombreLista: string, consulta: string) {
        const xml = consulta;
        const q: CamlQuery = {
            ViewXml: xml,
        };
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(nombreLista).getItemsByCAMLQuery(q));
        return respuesta;
    }

    obtenerMisSlips(usuarioId: number) {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.bibliotecaSlips).items.select("ID", "Title", "Slip/ID", "Slip/Title", "Slip/Cliente", "Slip/DNICliente", "Slip/FechaRenovacion", "Slip/TipoNegocio", "Slip/EstadoSlip", "Slip/TipoGestion", "Slip/Responsable", "Slip/Correo1", "Slip/Correo2", "Slip/Correo3", "Slip/FormatoSLIP", "Slip/TipoIdentificacionCliente", "Slip/UrlCompartir", "Created", "Modified", "CreadorSlip/Title", "Editor/Title").expand("Slip", "CreadorSlip", "Editor").filter("CreadorSlip eq " + usuarioId + " ").get());
        return respuesta;
    }

    obtenerVersiones(documentoId: number) {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.bibliotecaSlips).items.getById(documentoId).versions.get());
        return respuesta;
    }

    obtenerIntegrantesSlip() {
        let respuesta = from(this.obtenerConfiguracion().web.siteGroups.getByName("Integrantes de la Gestión de Slips").users.get());
        return respuesta;
    }

    actualizarPropiedadesSlip(slip: Slip){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaSlipsAuxiliar).items.getById(slip.id).update({
            FechaRenovacion:slip.fechaRenovacion, 
            TipoIdentificacionCliente:slip.tipoIdentificacionCliente, 
            Cliente:slip.nombreCliente, 
            DNICliente:slip.dniCliente, 
            TipoNegocio:slip.tipoNegocio, 
            EstadoSlip:slip.estado,
            TipoGestion: slip.tipoGestion,
            Responsable: slip.responsable,
            Correo1:slip.correo1,
            Correo2:slip.correo2,
            Correo3:slip.correo3 
          }); 
    }
}