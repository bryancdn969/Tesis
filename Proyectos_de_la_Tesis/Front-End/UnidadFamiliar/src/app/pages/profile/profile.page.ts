import { Component, OnInit } from '@angular/core';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

userData = { name : '', email : '', telefono : '' , password : '', status : 'Active', ciudad : 'Quito', sector : '', respuesta: ''};
  responseData: any;
  boolean: any;
  titleSignup: any;
  titleUpdate: any;
  formularioUsuario: FormGroup;
  formularioPassword: FormGroup;
  existeUsuario: any;
  selectZone =  {};
  comboZones: any;
  zones: any[] = [ ];
  selectedSingleZone: any;
  sectorZone = { sector_zona : 0 , status_zona : 'A' };
  sectorEspecificas: any;
  sector: any[] = [ ];
  preguntas: any[] = [ ];
  takePersona = {correo_persona : '', estado_persona : 'A', email : '', status : 'Active' };
  persona: any;
  buttonActivePassword = true;
  personData = { correo_persona : '', telefono_persona : '', estado_persona : 'A' };
  tipoPregunta = 0;
  getPreguntaData = { tipo_preguntas: 0, status_preguntas : 'A' };
  preguntaShow: any;
  selectedPreguntas = {};
  comboPreguntas: any;
  desactivarPregunta: any;
  getTPRes: any;
  updatePersona = {id : '', nombre_persona : '', correo_persona : '', telefono_persona : '',
  sector_persona: '', tipo_pregunta : 0, respuesta_pregunta_persona : ''};
  getIdPersona: any;
  saveDataPersona: any;
  dataUserUpdate = { id : '', name : '', email : '', telefono : ''};
  resUser: any;
  pregunta = { tipo_preguntas : 0 , descripcion_preguntas : '' , status_preguntas : 'A' };
  selectedPregunta: any;
  responseDataFriend: any;
  updateUserFriend = {id : '', id_user : '', name_user : '', telefono_user : ''};
  comprobarUserFriend = {telefono_user : '', status_friend : 'A'};
  getIds: any;
  constructor(
      private authService: UserService,
      private router: Router,
      private fb: FormBuilder,
      public menu: MenuController,
  ) {
  }

  takeDataPersona() {
    this.responseData = JSON.parse(localStorage.getItem('userDataLogin'));
    this.takePersona.email = this.responseData.email;
    this.takePersona.correo_persona = this.responseData.email;
    this.authService.postData(JSON.stringify(this.takePersona), 'takepersona').then((res) => {
    this.persona = res;
    console.log(this.persona);
    this.userData.name = this.persona.nombre_persona;
    this.userData.email = this.persona.correo_persona;
    this.userData.telefono = this.persona.telefono_persona;
    this.comprobarUserFriend.telefono_user = this.userData.telefono;
    this.personData.correo_persona = this.persona.correo_persona;
    this.personData.telefono_persona = this.persona.telefono_persona;
    this.getTP(this.personData);
    this.userData.respuesta = this.persona.respuesta_pregunta_persona;

    if (this.persona.sector_persona === '1') {
      this.userData.sector = 'Sur';
    } else if (this.persona.sector_persona === '2') {
      this.userData.sector = 'Centro';
    } else if (this.persona.sector_persona === '3') {
      this.userData.sector = 'Norte';
    }
  }, (err) => {
    console.log(err);
    this.authService.presentToast('Falla de servicio.');
    });
  }

  takeUserFriend() {
    this.authService.postData(JSON.stringify(this.comprobarUserFriend), 'getids').then(res => {
      this.getIds = res;
      // Se quito la comprobación del http
      // if (this.getIds.api_status === 1 && this.getIds.api_http === 200 ) {
      if (this.getIds.api_status === 1 ) {
        for (let i = 0; i <= this.getIds.data.length - 1; i++) {
          this.updateUserFriend.id = this.getIds.data[i].id;
        }
        console.log(this.updateUserFriend.id);
        this.updateUserFriend.id_user = this.getIds.data.id_user;
      } else {
        this.authService.presentToast('Error al traer la información.');
      }
    }, (err) => {
    console.log(err);
    this.authService.presentToast('Falla de servicio.');
    });
  }
  preguntaChange() {
    this.updatePersona.tipo_pregunta = this.selectedPregunta.tipo_preguntas;
    this.desactivarPregunta = true;
    this.preguntaShow = '';
  }

  selectPreguntas(tp) {
    this.authService.postData(JSON.stringify(this.selectedPreguntas), 'selectpreguntas').then((res) => {
      this.comboPreguntas = res;
      for (let i = 0; i <= this.comboPreguntas.data.length - 1; i++) {
        this.preguntas = this.comboPreguntas.data;
        console.log(this.comboPreguntas.data[i].id_preguntas + '===' + tp);
        if (this.comboPreguntas.data[i].id_preguntas == tp) {
          this.preguntaShow = this.comboPreguntas.data[i].descripcion_preguntas;
          console.log(this.comboPreguntas.data[i].descripcion_preguntas);
        }
      }
    });
  }

  getTP(data) {
    console.log(data);
    this.authService.postData(JSON.stringify(this.personData), 'gettipopreguntarespuesta').then((result) => {
      this.getTPRes = result;
      // if (this.getTPRes.api_status === 1 && this.getTPRes.api_http === 200 ) {
      if (this.getTPRes.api_status === 1 ) {
          localStorage.setItem('getTPR', JSON.stringify(this.getTPRes));
          this.tipoPregunta = this.getTPRes.tipo_pregunta;
          this.updatePersona.tipo_pregunta = this.tipoPregunta;
          this.selectPreguntas(this.tipoPregunta);
      // } else  if (this.getTPRes.api_status === 0 && this.getTPRes.api_http === 200) {
      } else  if (this.getTPRes.api_status === 0 ) {
        this.authService.presentToast('Credenciales incorrectas. Revisa tu correo y contraseña.');
      // } else  if (this.getTPRes.api_status === 0 && this.getTPRes.api_http === 401) {
      } else  if (this.getTPRes.api_status === 0 ) {
        this.authService.presentToast('Credenciales incorrectas. Revisa tu correo y contraseña.');
      } else  if (this.getTPRes.password === '123456' && this.getTPRes.status === 'Inactive') {
        this.router.navigate([ '/menu/login' ]);
      }
    }, (err) => {
        this.authService.presentToast('Falla del servicio.');
    });
  }

  ngOnInit() {
    this.buildForm();
    this.validatPassword();
    this.authService.postData(JSON.stringify(this.selectZone), 'selectzones').then((res) => {
      this.comboZones = res;
      // console.log(this.comboZones);
      for (let i = 0; i <= this.comboZones.data.length - 1; i++) {
        this.zones = this.comboZones.data;
      }
    });
    this.takeDataPersona();
  }

  // Compara la zona seleccionada y la cambia
  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.nombre_sector === e2.nombre_sector : e1 === e2;
  }

  compareFnP(e1, e2): boolean {
    return e1 && e2 ? e1.descripcion_preguntas === e2.descripcion_preguntas : e1 === e2;
  }

  // sientre el cambio de zona y lo almacena en una variable
  singleChange() {
      this.updatePersona.sector_persona = this.selectedSingleZone.id_sector;
      console.log(this.selectedSingleZone);
      this.userData.sector = '';
  }

  buildForm() {
      this.formularioUsuario = this.fb.group({
        nombre: ['', [Validators.required, Validators.maxLength(30)]],
        correo: ['', [Validators.required, Validators.email]],
        ciudad: [''],
        sectorI: [''],
        sectorS: [''],
        numero_contacto: ['',
        [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^[0-9]{5,10}$/)]],
        password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
        respuesta: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
        pregunta: ['', [Validators.required]],
      });
  }

  validatPassword() {
    this.formularioPassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
    });
  }

  cambiarPassword() {
    this.router.navigate([ '/menu/recoverPassword']);
  }

  actualizarDatos() {
    this.updatePersona.nombre_persona = this.userData.name;
    this.updatePersona.correo_persona = this.userData.email;
    this.updatePersona.telefono_persona = this.userData.telefono;
    this.updatePersona.respuesta_pregunta_persona = this.userData.respuesta;
    this.getIdPersona = JSON.parse(localStorage.getItem('getIdPersona'));
    this.updatePersona.id = this.getIdPersona.id;
    if (this.userData.name && this.userData.email && this.userData.telefono &&
      this.updatePersona.sector_persona && this.tipoPregunta > 0 && this.userData.respuesta) {
      console.log(this.updatePersona);
      this.authService.postData(JSON.stringify(this.updatePersona), 'updatdatauser').then((res) => {
        this.saveDataPersona = res;
        console.log(this.saveDataPersona);
        // if (this.saveDataPersona.api_status === 1 && this.saveDataPersona.api_http === 200 ) {
        if (this.saveDataPersona.api_status === 1 ) {
          localStorage.setItem('persona', JSON.stringify(this.saveDataPersona));
          this.updateDataUser();
      } else  {
        this.authService.presentToast('Datos necesarios.');
      }
      }, (err) => {
        this.authService.presentToast('Falla del servicio.');
    });
    } else {
      this.authService.presentToast('Toda la información es requerida');
    }
  }

  updateDataUser() {
    this.dataUserUpdate.id = this.responseData.id;
    this.dataUserUpdate.name = this.updatePersona.nombre_persona;
    this.dataUserUpdate.email = this.updatePersona.correo_persona;
    this.dataUserUpdate.telefono = this.updatePersona.telefono_persona;
    this.authService.postData(JSON.stringify(this.dataUserUpdate), 'updateuser').then((res) => {
      this.resUser = res;
      // if (this.resUser.api_status === 1 && this.resUser.api_http === 200 ) {
      if (this.resUser.api_status === 1 ) {
        localStorage.setItem('resUser', JSON.stringify(this.resUser));
        this.updtaFrienUser();
    } else  {
      this.authService.presentToast('Datos necesarios.');
    }
    }, (err) => {
      this.authService.presentToast('Falla del servicio.');
  });
  }

  updtaFrienUser() {
    this.updateUserFriend.name_user = this.updatePersona.nombre_persona;
    this.updateUserFriend.telefono_user = this.updatePersona.telefono_persona;

    this.authService.postData(JSON.stringify(this.comprobarUserFriend), 'getids').then(res => {
      this.getIds = res;
      // if (this.getIds.api_status === 1 && this.getIds.api_http === 200 ) {
      if (this.getIds.api_status === 1 ) {
        for (let i = 0; i <= this.getIds.data.length - 1; i++) {
          this.updateUserFriend.id = this.getIds.data[i].id;
          this.updateUserFriend.id_user = this.getIds.data[i].id_user;
          console.log(this.updateUserFriend);
          this.authService.postData(JSON.stringify(this.updateUserFriend), 'updateuserfriend').then((result) => {
            this.responseDataFriend = result;
            // if (this.responseDataFriend.api_status === 1 && this.responseDataFriend.api_http === 200) {
            if (this.responseDataFriend.api_status === 1 ) {
                  localStorage.setItem('userDataFriendUpdte', this.responseDataFriend);
                  this.authService.presentToast('Datos actualizados correctamente.');
                  this.router.navigate([ '/menu/login' ]);
                } else {
                  this.authService.presentToast('Error al actualizar.');
                }
              }, (err) => {
                this.authService.presentToast('El servicio falló.');
              });
        }
      } else {
        this.authService.presentToast('Error al traer la información.');
      }
    }, (err) => {
    console.log(err);
    this.authService.presentToast('Falla de servicio.');
    });
  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

}
