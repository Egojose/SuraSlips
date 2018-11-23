export class Slip {
    constructor(
        public fechaRenovacion: Date,
        public dniCliente: string,
        public nombreCliente: string,
        public tipoNegocio: string,
        public estado: string,
        public tipoGestion: string,
        public responsable: string,
        public correo1: string,
        public correo2: string,
        public copiaA: string,
        public solucion: string,
        public id?: number) { }

    public static fromJson(element: any) {
        return new Slip(
            element.FechaRenovacion,
            element.DNICliente,
            element.Cliente,
            element.TipoNegocio,
            element.Estado,
            element.TipoGestion,
            element.Responsable,
            element.Correo,
            element.Correo2,
            element.ConCopiaA,
            element.Solucion,
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