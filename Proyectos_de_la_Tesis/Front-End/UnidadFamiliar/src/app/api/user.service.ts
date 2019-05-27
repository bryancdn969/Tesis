import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

const apiUrl = 'http://localhost/Tesis/Proyectos_de_la_Tesis/Back-End/UnidadFamiliar/public/api/';
const httpOptions = {  headers: new Headers({'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Headers':  'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With',
                            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                            'Access-Control-Allow-Credentials':  'true'})
};

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public http: Http
  ) {
    this.http = http;
  }

  postFormData(formData, type) {
    const DataForm = new FormData();
    for ( const key of formData ) {
      DataForm.append(key, formData[key]);
    }
    return new Promise((resolve, reject) => {
      this.http.post( apiUrl + type, FormData, httpOptions).
      subscribe(res => {
        resolve(res.json());
      }, (err) => {
        reject(err);
      });
    });

  }

  postData(credentials, type) {
    return new Promise((resolve, reject) => {
      this.http.post(apiUrl + type, JSON.parse(credentials), httpOptions)
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });

  }

}
