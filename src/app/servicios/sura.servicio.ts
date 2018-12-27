import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuraServicio {

  private loginUrl: string = '/services/oauth2/token';
  private suraUrlService: string = 'https://sura.my.salesforce.com';

  constructor(private http: HttpClient) { }

  obtenerToken(): Observable<any> {
    const formData = new FormData();
    formData.append('grant_type', 'password');
    formData.append('client_id', '3MVG9aFryxgomHTZBf2tPqyBm7VSTFet3mSuvinUkgcPwKDDdU_bOeh5hbAocy660IGyMrmSONc.DPEoL1rtR');
    formData.append('client_secret', '3916059708823542084');
    formData.append('username', 'integrasurasfdcdemo@sura.com.co');
    formData.append('password', 'Sura2012');
    return this.http.post<any>(this.loginUrl, formData);
  }

  obtenerClientePorDNI(token: string, dni: string){
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    let qsParam = `'${dni}'`;
    let params = new HttpParams().set('q', 'SELECT+Name,Nombre_completo__c,Id_Integracion__c+FROM+Account+WHERE+Id_Integracion__c=' + qsParam);
    let completeUrlService = this.suraUrlService + '/services/data/v36.0/query?';
    return this.http.get<any>(completeUrlService, { headers: headers, params: params })
  }

}
