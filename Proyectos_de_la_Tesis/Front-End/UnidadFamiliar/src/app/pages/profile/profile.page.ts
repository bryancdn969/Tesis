import { Component, OnInit } from '@angular/core';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

userData = { name : '', email : '', telefono : '' , password : '', status : 'Active', ciudad : 'Quito', sector : '' };
  responseData: any;

  boolean: any;
  titleSignup: any;
  titleUpdate: any;
  formularioUsuario: FormGroup;
  existeUsuario: any;
  selectZone =  {};
  comboZones: any;
  zones: any[] = [ ];
  selectedSingleZone: any;
  sectorZone = { sector_zona : 0 , status_zona : 'A' };
  sectorEspecificas: any;
  sector: any[] = [ ];
  activePassword = true; buttonUpdate = false; activeName = false; activeEmail = false;
  activePhone = false; activeCity = false; activeSector = false; buttonUpdatePassword = true;
  buuttonActivePassword = false;
  takePersona = {correo_persona : '', estado_persona : 'A', email : '', status : 'Active' };
  persona: any;

  constructor(
      private authService: UserService,
      private router: Router,
      private toastController: ToastController,
      private fb: FormBuilder,
      public menu: MenuController,
  ) {
    this.responseData = JSON.parse(localStorage.getItem('userDataLogin'));
    this.takePersona.email = this.responseData.email;
    this.takePersona.correo_persona = this.responseData.email;
    this.authService.postData(JSON.stringify(this.takePersona), 'takepersona').then((res) => {
    this.persona = res;
    console.log(this.persona);
    this.userData.name = this.persona.nombre_persona;
    this.userData.email = this.persona.correo_persona;
    this.userData.telefono = this.persona.telefono_persona;
    // this.userData.password = this.responseData.password;
    if (this.persona.sector_persona === '1') {
      this.userData.sector = 'Sur';
    } else if (this.persona.sector_persona === '2') {
      this.userData.sector = 'Centro';
    } else if (this.persona.sector_persona === '3') {
      this.userData.sector = 'Norte';
    }
  }, (err) => {
    console.log(err);
    this.presentToast('Falla de servicio.');
    });
  }

// Toast information
  async presentToast( message: string ) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
    this.buildForm();
    this.authService.postData(JSON.stringify(this.selectZone), 'selectzones').then((res) => {
      this.comboZones = res;
      // console.log(this.comboZones);
      for (let i = 0; i <= this.comboZones.data.length - 1; i++) {
        this.zones = this.comboZones.data;
      }
    });
  }

  // Compara la zona seleccionada y la cambia
  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.nombre_sector === e2.nombre_sector : e1 === e2;
  }

  // sientre el cambio de zona y lo almacena en una variable
  singleChange() {
      console.log(this.selectedSingleZone);
      this.userData.sector = '';
  }

  // valida el registro tanto de la persona como la del usuario
/*   update() {
    if (this.userData.name && this.userData.email && this.userData.password && this.userData.telefono
        && this.personaData.sector_persona.valueOf() !== '') {
      this.userData.telefono = this.userData.telefono;
      this.personaData.nombre_persona = this.userData.name;
      this.personaData.correo_persona = this.userData.email;
      this.personaData.telefono_persona = this.userData.telefono;

        // Aqui registraremos el usuario
            this.authService.postData(JSON.stringify(this.userData), 'signup').then((result) => {
              this.responseData = result;
              console.log(this.responseData);
              if (this.responseData.api_status === 1 && this.responseData.api_http === 200) {
                localStorage.setItem('userData', JSON.stringify(this.responseData));
                // Crearemos primero persona
                this.authService.postData(JSON.stringify(this.personaData), 'createperson').then((resPerson) => {
                  this.persona = resPerson;
                  console.log(this.persona);
                  this.presentToast('Usuario guardado correctamente.');
                 // this.buildForm();
                  this.router.navigate([ '/menu/login' ]);
                }, (err) => {
                  console.log(err);
                  this.presentToast('Falla del servicio.');
                });
              }
            }, (err) => {
              console.log(err);
              this.presentToast('Falla del servicio.');
            });
    } else {
      this.presentToast('Todos campos son necesarios.');
    }
  } */

  buildForm() {
      this.formularioUsuario = this.fb.group({
        nombre: ['', [Validators.required, Validators.maxLength(30)]],
        correo: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
        ciudad: [''],
        sectorI: ['', [Validators.required]],
        sectorS: ['', [Validators.required]],
        numero_contacto: ['',
        [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]{5,10}$/)]],
      });
  }

  changePassword() {
    this.activeName = true; this.activeEmail = true;
    this.activePhone = true; this.activeCity = true;
    this.activeSector = true; this.activePassword = false;
    this.buttonUpdate = true; this.buttonUpdatePassword = false;
  }

}
