export class Plantilla{

    constructor(public nombre: string, 
        public urlPlantilla: any, 
        public descripcion : string,
        public ordenPlantilla: number,
        public id?: number) { }

    public static fromJson(element: any) {
        return new Plantilla(element.Title, 
            element.UrlPlantilla, 
            element.Descripcion,
            element.OrdenPlantilla,
            element.Id);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}