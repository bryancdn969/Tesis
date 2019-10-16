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
    sectorUser = { sector_zona : 0, status_zona : 'A', sector_persona : 0, estado_persona : 'A'};

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
          this.responseData = result;
          if (this.responseData.api_status === 1 && this.responseData.status === 'Active' ) {
              localStorage.setItem('userDataLogin', JSON.stringify(this.responseData));
              this.authService.isLoggedIn();
              this.takeSectorPersona();
            } else {
              this.authService.presentToast('Credenciales incorrectas. Revisa tu correo y contraseña.');
              }
          }, (err) => {
              this.authService.presentToast('Falla del servicio.');
          });
      } else {
        this.authService.presentToast('Toda la información es requerida.');
      }
  }

  takeSectorPersona() {
    this.authService.postData(JSON.stringify(this.takeSector), 'takesectorxuser').then((res) => {
      this.sector = res;
      localStorage.setItem('getIdPersona', JSON.stringify(this.sector));
      this.valuSector = this.sector.sector_persona;
      this.sectorXZona(this.valuSector);
    }, (err) => {
      this.authService.presentToast('Falla del servicio.');
    });

  }

  /*sectorXZona(sector) {
    this.sectorUser.sector_persona = sector;
    this.sectorUser.sector_zona = sector;
    let zonaUser: any;
    console.log(this.sectorUser);
    this.authService.postData(JSON.stringify(this.sectorUser), 'sectorxzona').then((res) => {
      zonaUser = JSON.stringify(res);
      this.authService.presentToast('Login exitoso.');
      localStorage.setItem('zonaUser', zonaUser);
      this.router.navigate([ '/menu/shareLocation']);
    }, (err) => {
      this.authService.presentToast('Falla del servicio.');
  });

  }*/
  sectorXZona(sector) {
    console.log(this.sectorUser);
    this.router.navigate([ '/menu/shareLocation']);
    this.authService.presentToast('Login exitoso.');
  }

  signup() {
    this.router.navigate([ '/menu/signup' ]);
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  buildForm() {
    this.formularioUsuario = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]]
    });
  }

  goToResetPassword() {
    const inLogin = 'login';
   // this.authService.presentToast('Revise su correo porfavor.');
    this.router.navigate([ '/menu/recoverPassword', {inLogin} ]);
 }
}
