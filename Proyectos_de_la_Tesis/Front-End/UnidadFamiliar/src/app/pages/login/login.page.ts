import { Component, OnInit } from '@angular/core';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    userData = { email : '', password : '' };
    responseData: any;

  constructor(
      private authService: UserService,
      private router: Router,
      private toastController: ToastController) { }

      async presentToast( message: string ) {
      const toast = await this.toastController.create({
          message,
          duration: 2000
      });
      toast.present();
    }

  ngOnInit() {
  }

  login() {
      if (this.userData.email && this.userData.password) {
          this.authService.postFormData
          (this.userData, 'login?email=' + this.userData.email + '&password=' + this.userData.password).then((result) => {
              this.responseData = result;
              console.log(this.responseData);
              if (this.responseData.api_status === 1 && this.responseData.api_http === 200) {
                  localStorage.setItem('userDataLogin', JSON.stringify(this.responseData));
                  this.presentToast('Login successful.');
                  this.router.navigate([ '/menu/shareLocation' ]);
              } else  if (this.responseData.api_status === 0 && this.responseData.api_http === 200) {
                  this.presentToast('Invalid credentials. Check your username and password.');
              } else  if (this.responseData.api_status === 0 && this.responseData.api_http === 401) {
                  this.presentToast('Invalid credentials. Check your username and password.');
              }
          }, (err) => {
              console.log(err);
              this.presentToast('The service is failed.');
          });
      } else {
          this.presentToast('The email field is required., The password field is required.');
      }
  }
}
