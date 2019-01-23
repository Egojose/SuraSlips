import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { default as pnp, CamlQuery } from 'sp-pnp-js';
import { environment } from '../../environments/environment';
import { Slip } from '../dominio/slip';

@Injectable()
export class SPServicio {
    constructor() { }

    public obtenerConfiguracion() {
        const configuracionSharepoint = pnp.sp.configure({
            headers: {
                'Accept': 'application/json; odata=verbose'
            }
        }, environment.urlWeb);

        return configuracionSharepoint;
    }

    public obtenerConfiguracionConPost() {
        const configuracionSharepoint = pnp.sp.configure({
            headers: {
                'Accept': 'application/json; odata=verbose',
                'Content-Type': 'application/json;odata=verbose',
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSIsImtpZCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvc3VyYW1lcmljYW5hLnNoYXJlcG9pbnQuY29tQDNjMGJkNGZlLTExMTEtNGQxMy04ZTBjLTdjMzNiOWViNzU4MSIsImlzcyI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEAzYzBiZDRmZS0xMTExLTRkMTMtOGUwYy03YzMzYjllYjc1ODEiLCJpYXQiOjE1NDcwNTkzMDQsIm5iZiI6MTU0NzA1OTMwNCwiZXhwIjoxNTQ3MDg4NDA0LCJpZGVudGl0eXByb3ZpZGVyIjoiMDAwMDAwMDEtMDAwMC0wMDAwLWMwMDAtMDAwMDAwMDAwMDAwQDNjMGJkNGZlLTExMTEtNGQxMy04ZTBjLTdjMzNiOWViNzU4MSIsIm5hbWVpZCI6IjRmNjQ0ODkyLWFkN2ItNDZjMC1hMGU0LTAzNjVhMzk2NWFmZUAzYzBiZDRmZS0xMTExLTRkMTMtOGUwYy03YzMzYjllYjc1ODEiLCJvaWQiOiIyNmIwOTQxNC1hNDRlLTQ5NjMtYmY5MC04ZTlkMTI4ZjA4ZDQiLCJzdWIiOiIyNmIwOTQxNC1hNDRlLTQ5NjMtYmY5MC04ZTlkMTI4ZjA4ZDQiLCJ0cnVzdGVkZm9yZGVsZWdhdGlvbiI6ImZhbHNlIn0.cB-mMiQAT8vHblkOOwxph2mGdyyNlMPxiWT7qAdkhNC5Sd89lLE6SpbT7t5pSqKLCPDPR7ueTTJBazkZofV5jzNkL1eiiGj3dgR8yFq0m14CRiN5c9NOoi6HDak9YUo0fpvzL4QMH_m-97kV1-cn0P14Aa5jZwYQmzw9eXZl_QlGGwfNe4lYzdvqFZ00i8OeLBqlbuhgN7Jq92g1dMQ3Lid_YQgH4vy4V9ouEpmAeGe87SEfJ4Qrp4nBMDpxwTmoJkQWS6ChmNpWSbcLN1hGVxaYEbG54TniVmJlhINpiHhpL1a_5KiDZAbSiGiw4YX2OJgJleRRhgfU3gvW1-cM6A'
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

    ObtenerTipoNegocioPorNombre(tipoNegocio: string) {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaTipoNegocio).items.filter(`Title eq '${tipoNegocio}'`).get());
        return respuesta;
    }

    agregarSlipDocumento(sufijo: string, documento: File) {
        return this.obtenerConfiguracion().web.getFolderByServerRelativeUrl(environment.urlReltativa + environment.bibliotecaSlips).files.add(sufijo + "-" + documento.name, documento, true);
    }

    agregarSLIPinformacion(slip: Slip) {
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSlips).items.add({
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
        const respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSlips)
                            .items.select("ID", "Title", "Cliente", "DNICliente", "FechaRenovacion", "TipoNegocio", "EstadoSlip", "TipoGestion", "Responsable", "Correo1", "Correo2", "Correo3", "FormatoSLIP", "TipoIdentificacionCliente", "UrlCompartir", "Created", "Modified", "CreadorSlip/Title", "Editor/Title", "EnvioCliente", "IDSlipDocumento", "EstadoFlujo")
                            .expand('CreadorSlip', 'Editor').filter('CreadorSlip eq ' + usuarioId + ' ').get());
        return respuesta;
    }

    obtenerVersiones(slip: Slip) {
        const respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.bibliotecaSlips)
                            .items.getById(slip.documentoId).versions.get());
        return respuesta;
    }

    obtenerIntegrantesSlip() {
        const respuesta = from(this.obtenerConfiguracion().web.siteGroups.getByName('Integrantes de la Gestión de Slips').users.get());
        return respuesta;
    }

    actualizarPropiedadesSlip(slip: Slip) {
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSlips).items.getById(slip.id).update({
            FechaRenovacion: slip.fechaRenovacion,
            TipoIdentificacionCliente: slip.tipoIdentificacionCliente,
            Cliente: slip.nombreCliente,
            DNICliente: slip.dniCliente,
            TipoNegocio: slip.tipoNegocio,
            EstadoSlip: slip.estado,
            TipoGestion: slip.tipoGestion,
            Responsable: slip.responsable,
            Correo1: slip.correo1,
            Correo2: slip.correo2,
            Correo3: slip.correo3
        });
    }

    actualizarColumnaReasignar(slip: Slip, usuarioId: number) {
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSlips).items.getById(slip.id).update({
            CreadorSlipId: usuarioId,
            EstadoFlujo: 'Reasignado'
        });
    }

    actualizarColumnaEnvioCliente(slip: Slip) {
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSlips).items.getById(slip.id).update({
            EnvioCliente: true,
            EstadoFlujo: 'Enviado al cliente'
        });
    }

    actualizarEstadoSlip(slip: Slip, EstadoSlip) {
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSlips).items.getById(slip.id).update({
            EstadoSlip: EstadoSlip,
            EstadoFlujo: 'Cerrado'
        });
    }

    obtenerClienteDesdeListaLocal(dni: string) {
        const id = dni.substring(1);
        const respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaTemporal)
                            .items.filter(`substringof('${id}', Identificacion)`).get());
        return respuesta;
    }
}
