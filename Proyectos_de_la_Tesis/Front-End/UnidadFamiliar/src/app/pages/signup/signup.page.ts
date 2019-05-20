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

  userData = { name : '', email : '', telefono : '' , password : '', status : 'Active' };
  responseData: any;

  boolean: any;
  activePassword: any;
  buttonRegister: any;
  buttonUpdate: any;
  titleSignup: any;
  titleUpdate: any;

  constructor(
      private authService: UserService,
      private router: Router,
      private toastController: ToastController
  ) {
    localStorage.getItem('update');
    console.log('update', localStorage.getItem('update') + '==' + null);
    if (localStorage.getItem('update') == null) {
      this.boolean        = true;
      this.activePassword = false;
      this.buttonRegister = false;
      this.buttonUpdate   = true;
      this.titleSignup    = false;
      this.titleUpdate    = true;
    } else if (localStorage.getItem('update') === 'false') {
      this.boolean        = false;
      this.activePassword = true;
      this.buttonRegister = true;
      this.buttonUpdate   = false;
      this.titleSignup    = true;
      this.titleUpdate    = false;
    }
  }

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
    if (this.userData.name && this.userData.email && this.userData.password && this.userData.telefono) {
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

  regresar() {
    console.log(localStorage.getItem('changePage') + ' == ' + 'Profile');
    if (localStorage.getItem('changePage') === 'Profile') {
      this.router.navigate([ '/menu/profile' ]); // remember to put this to add the back button behavior
    } else {
      this.router.navigate([ '/menu/login' ]);
    }
  }

  cancelar() {
    if (localStorage.getItem('changePage') === 'Profile') {
      this.router.navigate([ '/menu/profile' ]);
    } else {
      this.router.navigate([ '/menu/login' ]);
    }
  }

  /*async presentAlert() {
    const alertController = document.querySelector('ion-alert-controller');
    await alertController.componentOnReady();

    const alert = await alertController.create({
      header: 'Alert',
      subHeader: 'Subtitle',
      message: 'This is an alert message.',
      buttons: ['OK']
    });
    return await alert.present();
  }*/

  async presentAlert() {
    const alertController = document.querySelector('ion-alert-controller');
    await alertController.componentOnReady();

    console.log(this.buttonUpdate)  ;
    if (this.buttonUpdate === false) {
      const alert = await alertController.create({
        header: 'Alert',
        message: 'You are sure the update the information?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              // this.navCtrl.setRoot(SignupPage);
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.router.navigate([ '/menu/profile' ]);
            }
          }
        ]
      });
      alert.present();
    } else {
      const alert = await alertController.create({
        header: 'Alert',
        message: 'You are sure the create this account?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              // this.navCtrl.setRoot(SignupPage);
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.router.navigate([ '/menu/login' ]);
            }
          }
        ]
      });
      alert.present();
    }
  }
}
