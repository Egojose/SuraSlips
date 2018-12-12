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
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IndVTG1ZZnNxZFF1V3RWXy1oeFZ0REpKWk00USIsImtpZCI6IndVTG1ZZnNxZFF1V3RWXy1oeFZ0REpKWk00USJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTBmZjEtY2UwMC0wMDAwMDAwMDAwMDAvc3VyYW1lcmljYW5hLnNoYXJlcG9pbnQuY29tQDNjMGJkNGZlLTExMTEtNGQxMy04ZTBjLTdjMzNiOWViNzU4MSIsImlzcyI6IjAwMDAwMDAxLTAwMDAtMDAwMC1jMDAwLTAwMDAwMDAwMDAwMEAzYzBiZDRmZS0xMTExLTRkMTMtOGUwYy03YzMzYjllYjc1ODEiLCJpYXQiOjE1NDQ2MzA2NjgsIm5iZiI6MTU0NDYzMDY2OCwiZXhwIjoxNTQ0NjU5NzY4LCJpZGVudGl0eXByb3ZpZGVyIjoiMDAwMDAwMDEtMDAwMC0wMDAwLWMwMDAtMDAwMDAwMDAwMDAwQDNjMGJkNGZlLTExMTEtNGQxMy04ZTBjLTdjMzNiOWViNzU4MSIsIm5hbWVpZCI6IjRmNjQ0ODkyLWFkN2ItNDZjMC1hMGU0LTAzNjVhMzk2NWFmZUAzYzBiZDRmZS0xMTExLTRkMTMtOGUwYy03YzMzYjllYjc1ODEiLCJvaWQiOiIyNmIwOTQxNC1hNDRlLTQ5NjMtYmY5MC04ZTlkMTI4ZjA4ZDQiLCJzdWIiOiIyNmIwOTQxNC1hNDRlLTQ5NjMtYmY5MC04ZTlkMTI4ZjA4ZDQiLCJ0cnVzdGVkZm9yZGVsZWdhdGlvbiI6ImZhbHNlIn0.mJeFu-NIgFW8sqsoM6ZO0FBgTb-ynd1qS_sLIV_4gAPnHc99vDqZ3PXJHYDWoCpyekJJ8t4RDzI7ekheVdYv6yl6Fz_dmdJzjp5MITAzjy1GgMoX9a1b700fqpFTm40lY8u401lx8ch1rErGP61t3ZEc4OQfG7G1Cb1RmQbuAJjlNmQJIaIx0j-5T9tDhsaVgHm_19cwNTQvZcXI7Ovc84lyTCzEVPUiQl1NhCgcV32c1EyojT4p1twLrYx-00JN26ZraqYXEqeZ1ujXQR2Smp9s5aAHJ5Ugs-AcZbr0JNp2q_VQAgfKYWlX3N7hCPmuTV1jBrHBMuC8Nrv_jRLXMQ'
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

    agregarSlipDocumento(sufijo: string, documento: File){
        return this.obtenerConfiguracion().web.getFolderByServerRelativeUrl(environment.urlReltativa + environment.bibliotecaSlips).files.add(sufijo + "-" + documento.name, documento, true);
    }

    agregarSLIPinformacion(slip: Slip){
        return this.ObtenerConfiguracionConPost().web.lists.getByTitle(environment.listaSlipsAuxiliar).items.add({
            Title:slip.titulo,
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
            FormatoSLIP: slip.formatoSLIP
        });
    }

    ObtenerTiposGestion(){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaTipoGestion).items.getAll());
        return respuesta;
    }

    ObtenerTipoResponsables(){
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

    ObtenerCategorias(){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.listaCategorias).items.orderBy("Title", true).getAll());
        return respuesta;
    }

    ObtenerFormatosSlips(){
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

    obtenerMisSlips(usuarioId: number){
        let respuesta = from(this.obtenerConfiguracion().web.lists.getByTitle(environment.bibliotecaSlips).items.select("ID", "Title", "Slip/ID", "Slip/Title", "Slip/Cliente", "Slip/DNICliente", "Slip/FechaRenovacion", "Slip/TipoNegocio", "Slip/EstadoSlip", "Slip/TipoGestion", "Slip/Responsable", "Slip/Correo1", "Slip/Correo2", "Slip/Correo3", "Slip/FormatoSLIP", "Slip/TipoIdentificacionCliente", "Created", "Modified", "Author/Title", "Editor/Title").expand("Slip", "Author", "Editor").filter("AuthorId eq " + usuarioId + " ").get());
        return respuesta;
    }
}