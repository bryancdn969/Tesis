import { Component, OnInit } from '@angular/core';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  userData = { name : '', email : '', telefono : '' , password : '', status : 'Active' };
  userExiste = {telefono : '' , status : 'Active'};
  responseData: any;

  boolean: any;
  activePassword: any;
  buttonRegister: any;
  buttonUpdate: any;
  titleSignup: any;
  titleUpdate: any;
  formularioUsuario: FormGroup;
  existeUsuario: any;

  constructor(
      private authService: UserService,
      private router: Router,
      private toastController: ToastController,
      private fb: FormBuilder,
      public menu: MenuController,
  ) {
    localStorage.getItem('update');
    console.log('update', localStorage.getItem('update') + '==' + null);
    if (localStorage.getItem('update') == null) {
      this.boolean        = true;
      this.activePassword = false;
      this.buttonRegister = false;
      this.buttonUpdate   = true;
    } else if (localStorage.getItem('update') === 'false') {
      this.boolean        = false;
      this.activePassword = true;
      this.buttonRegister = true;
      this.buttonUpdate   = false;
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
    this.buildForm();
  }

  signup() {
    if (this.userData.name && this.userData.email && this.userData.password && this.userData.telefono) {
      this.userExiste.telefono = this.userData.telefono;
      this.userData.telefono = this.userData.telefono;
      this.authService.postData(JSON.stringify(this.userExiste), 'controlarusuariosrepetidos').then((res) => {
        this.existeUsuario = res;
        if (this.existeUsuario.api_status === 1 && this.existeUsuario.api_http === 200) {
          this.presentToast('El número de teléfono ingresado ya existe.');
        } else {
          this.authService.postData(JSON.stringify(this.userData), 'signup').then((result) => {
            this.responseData = result;
            console.log(this.responseData);
            if (this.responseData.api_status === 1 && this.responseData.api_http === 200) {
              localStorage.setItem('userData', JSON.stringify(this.responseData));
              this.presentToast('Usuario guardado correctamente.');
              // this.buildForm();
              this.router.navigate([ '/menu/login' ]);
            }
          }, (err) => {
            console.log(err);
            this.presentToast('Falla del servicio.');
          });
        }
       });
    } else {
      this.presentToast('Todos campos son necesarios.');
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

  buildForm() {
    /**
     * @description Asignamos a la propiedad "formularioUsuario" los campos que se van a controlar de la vista
     */
    this.formularioUsuario = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(30)]],
      correo: ['', [Validators.required, Validators.email]],
      numero_contacto: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]{5,10}$/)]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]]
    });
  }

  ionViewWillEnter() {
    /* this.storage.get('ion_did_tutorial').then(res => {
      if (res === true) {
        this.router.navigateByUrl('/app/tabs/schedule');
      }
    }); */

    this.menu.enable(false);
  }
}
