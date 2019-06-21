import { Component, OnInit } from '@angular/core';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    userData = { email : '', password : '', status : 'Active' };
    responseData: any;
    formularioUsuario: FormGroup;
    takeSector = { correo_persona : '', estado_persona : 'A', email : '', status : 'Active' };
    sector: any;
    valuSector: any;
    sectorUser = { sector_zona : '', status_zona : 'A', sector_persona : '', estado_persona : 'A'};
    zonaUser: any;

    constructor(
      private authService: UserService,
      private router: Router,
      public menu: MenuController,
      private fb: FormBuilder,
    ) {
    }

  ngOnInit() {
    this.buildForm();
  }

  login() {
      if (this.userData.email && this.userData.password) {
        this.takeSector.correo_persona = this.userData.email;
        this.takeSector.email = this.userData.email;
        this.authService.postData(JSON.stringify(this.userData), 'login').then((result) => {
        /* this.authService.postFormData
          (this.userData, 'login?email=' + this.userData.email + '&password=' + this.userData.password
                                         + '&status=' + this.userData.status).then((result) => { */
              this.responseData = result;
              // console.log(this.responseData.password);
              if (this.responseData.api_status === 1 && this.responseData.api_http === 200 && this.responseData.status === 'Active' &&
                  this.userData.password !== '123456') {
                  localStorage.setItem('userDataLogin', JSON.stringify(this.responseData));
                  this.takeSectorPersona();
                  this.authService.isLoggedIn();
                  this.authService.presentToast('Login successful.');
                  this.router.navigate([ '/menu/shareLocation' ]);
              } else  if (this.responseData.api_status === 0 && this.responseData.api_http === 200) {
                this.authService.presentToast('Credenciales incorrectas. Revisa tu correo y contraseña.');
              } else  if (this.responseData.api_status === 0 && this.responseData.api_http === 401) {
                this.authService.presentToast('Credenciales incorrectas. Revisa tu correo y contraseña.');
              } else  if (this.responseData.password === '123456' && this.responseData.status === 'Inactive') {
                this.router.navigate([ '/menu/login' ]);
              }
          }, (err) => {
              // console.log(err);
              this.authService.presentToast('Falla del servicio.');
          });
      } else {
        this.authService.presentToast('Toda la información es requerida.');
      }
  }

  takeSectorPersona() {
    this.authService.postData(JSON.stringify(this.takeSector), 'takesectorxuser').then((res) => {
      this.sector = res;
      this.valuSector = this.sector.sector_persona;
      this.sectorXZona(this.valuSector);
    }, (err) => {
      // console.log(err);
      this.authService.presentToast('Falla del servicio.');
    });

  }

  sectorXZona(sector) {
    this.sectorUser.sector_persona = sector;
    this.sectorUser.sector_zona = sector;

    this.authService.postData(JSON.stringify(this.sectorUser), 'sectorxzona').then((res) => {
      this.zonaUser = res;
      // console.log(this.zonaUser);
      localStorage.setItem('zonaUser', JSON.stringify(this.zonaUser));
    }, (err) => {
      // console.log(err);
      this.authService.presentToast('Falla del servicio.');
  });

  }

  signup() {
    this.router.navigate([ '/menu/signup' ]);
  }

  ionViewWillEnter() {
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
    this.authService.presentToast('Revise su correo porfavor.');
 }

}