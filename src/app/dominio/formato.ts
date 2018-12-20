export class Formato {
    constructor(public title: string, 
        public FieldValuesAsText: any, 
        public id: number, 
        public name?: string) {

    }

    public static fromJson(element: any) {
        return new Formato(element.Title, 
            element.FieldValuesAsText, 
            element.ID, 
            this.obtenerNombreDocumento(element));
    }

    static obtenerNombreDocumento(element: any): string {
        let urldoc = element.FieldValuesAsText.FileRef;
        let partesDoc = urldoc.split('/');
        return partesDoc[partesDoc.length - 1];
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}