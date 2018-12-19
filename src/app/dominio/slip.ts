export class Slip {
    constructor(
        public titulo: string,
        public fechaCreacion: Date,
        public fechaRenovacion: Date,
        public tipoIdentificacionCliente: string,
        public dniCliente: string,
        public nombreCliente: string,
        public tipoNegocio: string,
        public estado: string,
        public tipoGestion: string,
        public responsable: string,
        public correo1: string,
        public correo2: string,
        public correo3: string,
        public formatoSLIP: string,
        public CreadoPor?: any,
        public ModificadoPor?: any,
        public diasTranscurridos?: number,
        public urlcompartir?: string,
        public documentoId?: number,
        public id?: number) { }

    public static fromJson(element: any) {
        return new Slip(
            (element.Title != null) ? element.Title : "",
            (element.Created != null) ? element.Created : null,
            (element.FechaRenovacion != null) ? element.FechaRenovacion: null,
            (element.TipoIdentificacionCliente != null) ? element.TipoIdentificacionCliente : "",
            (element.DNICliente != null) ? element.DNICliente: "",
            (element.Cliente != null) ? element.Cliente: "",
            (element.TipoNegocio != null) ? element.TipoNegocio: "",
            (element.EstadoSlip != null) ? element.EstadoSlip: "",
            (element.TipoGestion != null) ? element.TipoGestion : "",
            (element.Responsable != null) ? element.Responsable : "",
            (element.Correo1 != null) ? element.Correo1: "",
            (element.Correo2 != null) ? element.Correo2: "",
            (element.Correo3 != null) ? element.Correo3: "",
            (element.FormatoSLIP != null) ? element.FormatoSLIP: "",
            (element.CreadorSlip != null) ? element.CreadorSlip : null,
            (element.Editor != null) ? element.Editor : null,
            (element.Created != null && element.FechaRenovacion != null) ? this.obtenerDiasTranscurridos(this.parseDate(element.Created), this.parseDate(element.FechaRenovacion)) : 0,
            (element.UrlCompartir != null) ? element.UrlCompartir: "",
            (element.IDSlipDocumento != null) ? element.IDSlipDocumento: null,
            element.ID);
    }

    static formatDate(value) {
        return value.getDate() + value.getMonth() + 1 + "/"  + "/" + value.getYear();
    }

    static obtenerDiasTranscurridos(FechaCreacion: Date, FechaRenovacion: Date): number {
        let diasTranscurridos = 0;
        let FechaActual = new Date();
        if (FechaActual < FechaRenovacion) {
            diasTranscurridos = FechaActual.getDate() - FechaCreacion.getDate();
        } else {
            diasTranscurridos = FechaRenovacion.getDate() - FechaCreacion.getDate();
        }
        return diasTranscurridos;
    }

    static parseDate(input) {
        var parts = input.match(/(\d+)/g);
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}