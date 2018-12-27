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
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSIsImtpZCI6Im5iQ3dXMTF3M1hrQi14VWFYd0tSU0xqTUhHUSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvc3VyYW1lcmljYW5hLnNoYXJlcG9pbnQuY29tQDNjMGJkNGZlLTExMTEtNGQxMy04ZTBjLTdjMzNiOWViNzU4MSIsImlzcyI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEAzYzBiZDRmZS0xMTExLTRkMTMtOGUwYy03YzMzYjllYjc1ODEiLCJpYXQiOjE1NDU5MjMxNDEsIm5iZiI6MTU0NTkyMzE0MSwiZXhwIjoxNTQ1OTUyMjQxLCJpZGVudGl0eXByb3ZpZGVyIjoiMDAwMDAwMDEtMDAwMC0wMDAwLWMwMDAtMDAwMDAwMDAwMDAwQDNjMGJkNGZlLTExMTEtNGQxMy04ZTBjLTdjMzNiOWViNzU4MSIsIm5hbWVpZCI6IjRmNjQ0ODkyLWFkN2ItNDZjMC1hMGU0LTAzNjVhMzk2NWFmZUAzYzBiZDRmZS0xMTExLTRkMTMtOGUwYy03YzMzYjllYjc1ODEiLCJvaWQiOiIyNmIwOTQxNC1hNDRlLTQ5NjMtYmY5MC04ZTlkMTI4ZjA4ZDQiLCJzdWIiOiIyNmIwOTQxNC1hNDRlLTQ5NjMtYmY5MC04ZTlkMTI4ZjA4ZDQiLCJ0cnVzdGVkZm9yZGVsZWdhdGlvbiI6ImZhbHNlIn0.DlgZSXUtdeH-WVOdxQlWxckdIpMeKayqTGwSc2Mz3dgsucs982FFfarv15juGnpBF1e2s1s0X4Iif5hdyz_IIzXxlg9356dX088Gl2vcQrc6H9_UaG-yKRv6XqqseoSYFaUrjUSxTAcB9r-Hp6bHDPXyr_8oANTJszE1iku2I8vOtTN0vDeDNmc1Puzsyn7UjKBdHEenfFz5iKOcU6jKtQgKbT-S7yA_lZZR_oAEumcsA7hrhJKdsCvI2T2Rv0T5VJxygz4tBO-zuqgCbwMp873-zl5Gll3q4mCNlmY24AQKy806H0-l9SlCc9JOiAsY2D_HQXchGygB2JgmTzX7DA'
            }
        }, environment.urlWeb);

        return configuracionSharepoint;
    }

    ObtenerInformacionSitio() {
        let respuesta = from(this.obtenerConfiguracion().web.get());
        return respuesta;
    }

    ObtenerUsuarioActual() {
        let respuesta = from(this.ObtenerConfiguracionConPost().web.currentUser.get());
        return respuesta;
    }

    ObtenerTipoNegocio() {
        let respuesta = from(this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaTipoNegocio).items.getAll());
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
        let respuesta = from(this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaTipoGestion).items.getAll());
        return respuesta;
    }

    ObtenerTipoResponsables() {
        let respuesta = from(this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaTipoResponsables).items.getAll());
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
        let respuesta = from(this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.bibliotecaPlantillas).items.select("FieldValuesAsText/FileRef", "Title", "ID").expand("FieldValuesAsText").get());
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
        let respuesta = from(this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaSlips).items.select("ID", "Title", "Cliente", "DNICliente", "FechaRenovacion", "TipoNegocio", "EstadoSlip", "TipoGestion", "Responsable", "Correo1", "Correo2", "Correo3", "FormatoSLIP", "TipoIdentificacionCliente", "UrlCompartir", "Created", "Modified", "CreadorSlip/Title", "Editor/Title", "EnvioCliente", "IDSlipDocumento", "EstadoFlujo").expand("CreadorSlip", "Editor").filter("CreadorSlip eq " + usuarioId + " ").get());
        return respuesta;
    }

    obtenerVersiones(slip: Slip) {
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.bibliotecaSlips).items.getById(slip.documentoId).versions.get());
        return respuesta;
    }

    obtenerIntegrantesSlip() {
        let respuesta = from(this.obtenerConfiguracion().web.siteGroups.getByName("Integrantes de la Gestión de Slips").users.get());
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
            EstadoFlujo: "Reasignado"
        });
    }

    actualizarColumnaEnvioCliente(slip: Slip){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSlips).items.getById(slip.id).update({
            EnvioCliente: true,
            EstadoFlujo: "Enviado al cliente"
        })
    }

    actualizarEstadoSlip(slip: Slip, EstadoSlip){
        return this.obtenerConfiguracion().web.lists.getByTitle(environment.listaSlips).items.getById(slip.id).update({
            EstadoSlip: EstadoSlip,
            EstadoFlujo: "Cerrado"
        })
    }
}