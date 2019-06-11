import { Component, OnInit } from '@angular/core';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    userData = { email : '', password : '' };
    responseData: any;
    formularioUsuario: FormGroup;

  constructor(
      private authService: UserService,
      private router: Router,
      private toastController: ToastController,
      public menu: MenuController,
      private fb: FormBuilder,
    ) {
    }

      async presentToast( message: string ) {
      const toast = await this.toastController.create({
          message,
          duration: 2000
      });
      toast.present();
    }

  ngOnInit() {
    this.buildForm();
  }

  login() {
      if (this.userData.password === '123456') {
        this.presentToast('Cambie su contraseña por favor.');
      } else if (this.userData.email && this.userData.password) {
          this.authService.postFormData
          (this.userData, 'login?email=' + this.userData.email + '&password=' + this.userData.password).then((result) => {
              this.responseData = result;
              console.log(this.responseData.password);
              if (this.responseData.api_status === 1 && this.responseData.api_http === 200) {
                  localStorage.setItem('userDataLogin', JSON.stringify(this.responseData));
                  this.presentToast('Login successful.');
                  this.router.navigate([ '/menu/shareLocation' ]);
              } else  if (this.responseData.api_status === 0 && this.responseData.api_http === 200) {
                  this.presentToast('Credenciales incorrectas. Revisa tu correo y contraseña.');
              } else  if (this.responseData.api_status === 0 && this.responseData.api_http === 401) {
                this.presentToast('Credenciales incorrectas. Revisa tu correo y contraseña.');
              } 
          }, (err) => {
              console.log(err);
              this.presentToast('Falla de servicio.');
          });
      } else {
          this.presentToast('El correo es requerido, La contraseña es requerida.');
      }
  }

  signup() {
    this.router.navigate([ '/menu/signup' ]);
  }

  ionViewWillEnter() {
    /* this.storage.get('ion_did_tutorial').then(res => {
      if (res === true) {
        this.router.navigateByUrl('/app/tabs/schedule');
      }
    }); */

    this.menu.enable(false);
  }

  buildForm() {
    /**
     * @description Asignamos a la propiedad "formularioUsuario" los campos que se van a controlar de la vista
     */
    this.formularioUsuario = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]]
    });
  }

  goToResetPassword() {
    /* this.authService.send(this.dataMail, 'sendemail/send').then((result) => {
      this.responseData = result;
      console.log(this.responseData); */
      this.presentToast('Revise su correo porfavor.');
  /* }, (err) => {
      console.log(err);
      this.presentToast('Falla de servicio.');
  });
 */
 }

}
