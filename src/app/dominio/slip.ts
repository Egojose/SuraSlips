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
        public versions?: any,
        public id?: number) { }

    public static fromJson(element: any) {
        return new Slip(
            (element.Title != null) ? element.Title : "",
            (element.Created != null) ? element.Created : null,
            (element.Slip.FechaRenovacion != null) ? element.Slip.FechaRenovacion: null,
            (element.Slip.TipoIdentificacionCliente != null) ? element.Slip.TipoIdentificacionCliente : "",
            (element.Slip.DNICliente != null) ? element.Slip.DNICliente: "",
            (element.Slip.Cliente != null) ? element.Slip.Cliente: "",
            (element.Slip.TipoNegocio != null) ? element.Slip.TipoNegocio: "",
            (element.Slip.EstadoSlip != null) ? element.Slip.EstadoSlip: "",
            (element.Slip.TipoGestion != null) ? element.Slip.TipoGestion : "",
            (element.Slip.Responsable != null) ? element.Slip.Responsable : "",
            (element.Slip.Correo1 != null) ? element.Slip.Correo1: "",
            (element.Slip.Correo2 != null) ? element.Slip.Correo2: "",
            (element.Slip.Correo3 != null) ? element.Slip.Correo3: "",
            (element.Slip.FormatoSLIP != null) ? element.Slip.FormatoSLIP: "",
            (element.CreadorSlip != null) ? element.CreadorSlip : null,
            (element.Editor != null) ? element.Editor : null,
            (element.Created != null && element.Slip.FechaRenovacion != null) ? this.obtenerDiasTranscurridos(this.parseDate(element.Created), this.parseDate(element.Slip.FechaRenovacion)) : 0,
            (element.Slip.UrlCompartir != null) ? element.Slip.UrlCompartir: "",
            (element.Versions != null) ? element.Versions: null,
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