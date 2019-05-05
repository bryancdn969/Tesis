import { Component, OnInit } from '@angular/core';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  userData = { "name" : '', "email" : '', "password" : '' };
  responseData: any;

  constructor(
      private authService: UserService,
      private router: Router,
      private toastController: ToastController
  ) { }

  async presentToast( message: string ) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
  }

  signup() {
    if (this.userData.name && this.userData.email && this.userData.password) {
      this.authService.postData(JSON.stringify(this.userData), 'signup').then((result) => {
        this.responseData = result;
        console.log(this.responseData);
        if (this.responseData.api_status === 1 && this.responseData.api_http === 200) {
          localStorage.setItem('userData', JSON.stringify(this.responseData));
          this.presentToast('User saved successful.');
          this.router.navigate([ '/menu/login' ]);
        }
      }, (err) => {
        console.log(err);
        this.presentToast('The service is failed.');
      });
    } else {
      this.presentToast('The data is required.');
    }
  }
}
