export class Estado {
    constructor(public title: string, public tiponegocioId: number, public id: number) {

    }

    public static fromJson(element: any) {
        return new Estado(element.Title, element.TipoNegocioId, element.ID);
    }

    public static fromJsonList(elements: any) {
        var list = [];
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }

}