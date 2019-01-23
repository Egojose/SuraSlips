import { environment } from '../../environments/environment';

export class historialVersiones {

    static versionSthc:
    number = 0;

    constructor(public numero: string, public fechaModificacion: string, public modificadorPor: string, public urlDocumento) {
    }

    public static fromJson(element: any) {
        if (this.versionSthc == 0) {
            let numero = element.VersionLabel;
            let FechaModificacion = element.Modified;
            let modificadoPor = element.Editor.LookupValue;
            let UrlDoc = environment.urlWeb + "/GestionSLIPS/" + element.FileLeafRef;
            this.versionSthc = 1;
            return new historialVersiones(numero, FechaModificacion, modificadoPor, UrlDoc);
        }
        else {
            let numero = element.VersionLabel;
            let FechaModificacion = element.Modified;
            let modificadoPor = element.Author.LookupValue;
            let UrlDoc = environment.urlWeb + "/_vti_history/" + element.VersionId + "/GestionSLIPS/" + element.FileLeafRef;
            return new historialVersiones(numero, FechaModificacion, modificadoPor, UrlDoc);
        }
    }

    public static fromJsonList(elements: any) {
        var list = [];
        this.versionSthc = 0;
        for (var i = 0; i < elements.length; i++) {
            list.push(this.fromJson(elements[i]));
        }
        return list;
    }
}

