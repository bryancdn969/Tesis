import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ToastController } from '@ionic/angular';

// const apiUrl = 'http://localhost/Tesis/Proyectos_de_la_Tesis/Back-End/UnidadFamiliar/public/api/';
const apiUrl = 'https://arieseffect.com/bryan/UnidadFamiliar/public/api/';
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

  HAS_LOGGED_IN = 'hasLoggedIn';

  constructor(
    public http: Http,
    private toastController: ToastController,
  ) {
    this.http = http;
  }

  postFormData(formData, type) {
    const DataForm = new FormData();
    for ( const key of formData ) {
      DataForm.append(key, formData[key]);
    }
    return new Promise((resolve, reject) => {
      this.http.post( apiUrl + type, FormData).
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

  isLoggedIn() {
    console.log((this.HAS_LOGGED_IN));
    localStorage.setItem('HAS_LOGGED_IN', (this.HAS_LOGGED_IN));
    /* return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    }); */
  }

  async presentToast( message: string ) {
    const toast = await this.toastController.create({
        message,
        duration: 2000
    });
    toast.present();
  }

}
