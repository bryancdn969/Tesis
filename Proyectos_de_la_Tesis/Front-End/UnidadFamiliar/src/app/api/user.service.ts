import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

const apiUrl = 'http://localhost/Tesis/Proyectos_de_la_Tesis/Back-End/UnidadFamiliar/public/api/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public http: Http) {
    this.http = http;
  }

  postFormData(formData, type) {
    const DataForm = new FormData();
    for ( const key in formData ) {
      DataForm.append(key, formData[key]);
    }
    return new Promise((resolve, reject) => {
      const headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Headers',  'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        headers.append('Access-Control-Allow-Credentials',  'true');

      this.http.post( apiUrl + type, FormData, { headers: headers}).
      subscribe(res => {
        resolve(res.json());
      }, (err) => {
        reject(err);
      });
    });

  }

  postData(credentials, type) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Access-Control-Allow-Headers',  'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
        headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        headers.append('Access-Control-Allow-Credentials',  'true');

      this.http.post(apiUrl + type, JSON.parse(credentials), {headers: headers})
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });

  }
}
