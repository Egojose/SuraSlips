export class Slip {
    constructor(
        public titulo: string,
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
        public id?: number) { }

    public static fromJson(element: any) {
        return new Slip(
            element.Title,
            element.FechaRenovacion,
            element.TipoIdentificacionCliente,
            element.DNICliente,
            element.Cliente,
            element.TipoNegocio,
            element.Estado,
            element.TipoGestion,
            element.Responsable,
            element.Correo,
            element.Correo2,
            element.Correo3,
            element.FormatoSLIP,
            element.ID);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}