import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../api/user.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
})
export class RecoverPasswordPage implements OnInit {

  responseData: any;
  personDataSave: any;
  getTPRes: any;
  setDescripcionPregunta: any;
  updateDataSave: any;
  formularioUsuario: FormGroup;
  formularioRespuesta: FormGroup;
  formularioPassword: FormGroup;
  userData = { email : '', telefono : '', status : 'Active' };
  personData = { correo_persona : '', telefono_persona : '', estado_persona : 'A' };
  getPreguntaData = { tipo_preguntas: 0, status_preguntas : 'A' };
  comprobar = { respuesta_pregunta_persona : '', password : '' };
  updatePassword = { id : 0, email : '', telefono : '',  password : '', status : 'Active' };
  activePassword = true;
  emailAction = false;
  celularAction = false;
  respuestaAction = false;
  activeRespuesta = true;
  tipoPregunta = 0;
  pregunta: any;
  nameButton: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: UserService,
    public menu: MenuController,
  ) { }

  ngOnInit() {
    this.nameButton = 'Verificar';
    this.buildFormValidacion();
    this.buildFormRespuesta();
    this.buildFormPassword();
    this.responseData = (this.activatedRoute.snapshot.params.inLogin);
    console.log(JSON.parse(localStorage.getItem('userDataLogin')).id);
    this.updatePassword.id = JSON.parse(localStorage.getItem('userDataLogin')).id;
  }

  regresar() {
    if (this.responseData === 'login') {
      this.router.navigate([ '/menu/login']);
    } else {
      this.router.navigate([ '/menu/profile']);
    }
  }

  buildFormValidacion() {
      this.formularioUsuario = this.fb.group({
        correo: ['', [Validators.required, Validators.email]],
        numero_contacto: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10),
          Validators.pattern(/^[0-9]{5,10}$/)]],
      });
  }

  buildFormRespuesta() {
    this.formularioRespuesta = this.fb.group({
      respuesta: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]]
    });
  }

  buildFormPassword() {
    this.formularioPassword = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
    });
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }

  verificar() {
    if (this.userData.email && this.userData.telefono && this.comprobar.respuesta_pregunta_persona &&
    this.comprobar.password) {
      this.updatePassword.email  = this.userData.email;
      this.updatePassword.telefono = this.userData.telefono;
      this.updatePassword.password = this.comprobar.password;
      this.actualizarPassword();
    } else if (this.userData.email && this.userData.telefono && this.comprobar.respuesta_pregunta_persona.toUpperCase()) {
      this.verificarRespuesta();
    } else if (this.userData.email && this.userData.telefono) {
      this.authService.postData(JSON.stringify(this.userData), 'recoverpasswordlogin').then((result) => {
              this.personDataSave = result;
              if (this.personDataSave.api_status === 1 ) {
                  localStorage.setItem('recoverPasswordLogin', JSON.stringify(this.personDataSave));
                  this.getTipoPreguntaRespuesta();
                  this.activeRespuesta = false;
                  this.emailAction = true;
                  this.celularAction = true;
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

  actualizarPassword() {
    this.authService.postData(JSON.stringify(this.updatePassword), 'updatpasswordlogin').then((result) => {
      this.updateDataSave = result;
      // if (this.updateDataSave.api_status === 1 && this.updateDataSave.api_http === 200 ) {
      if (this.updateDataSave.api_status === 1 ) {
          localStorage.setItem('udSave', JSON.stringify(this.updateDataSave));
          this.cancelar();
          this.authService.presentToast('Contraseña actualizada correctamente.');
          this.router.navigate([ '/menu/login' ]);
       // } else  if (this.responseData.api_status === 0 && this.responseData.api_http === 200) {
      } else  if (this.responseData.api_status === 0 ) {
        this.authService.presentToast('Credenciales incorrectas. Revisa tu correo y contraseña.');
      // } else  if (this.responseData.api_status === 0 && this.responseData.api_http === 401) {
      } else  if (this.responseData.api_status === 0 ) {
        this.authService.presentToast('Credenciales incorrectas. Revisa tu correo y contraseña.');
      } else  if (this.responseData.password === '123456' && this.responseData.status === 'Inactive') {
        this.router.navigate([ '/menu/login' ]);
      }
  }, (err) => {
      this.authService.presentToast('Falla del servicio.');
  });
  }

  verificarRespuesta() {
    if (this.getTPRes.respuesta_pregunta_persona === this.comprobar.respuesta_pregunta_persona.toUpperCase()) {
      this.activePassword = false;
      this.respuestaAction = true;
      this.nameButton = 'Actualizar Contaseña';
    } else {
      this.authService.presentToast('La respuesta es incorrecta.');
    }
  }

  getTipoPreguntaRespuesta() {
    this.personData.correo_persona = this.userData.email;
    this.personData.telefono_persona  = this.userData.telefono;
    this.authService.postData(JSON.stringify(this.personData), 'gettipopreguntarespuesta').then((result) => {
      this.getTPRes = result;
      // if (this.getTPRes.api_status === 1 && this.getTPRes.api_http === 200 ) {
      if (this.getTPRes.api_status === 1  ) {
          localStorage.setItem('getTPR', JSON.stringify(this.getTPRes));
          this.tipoPregunta = this.getTPRes.tipo_pregunta;
          this.getPregunta(this.tipoPregunta);
        // } else  if (this.responseData.api_status === 0 && this.responseData.api_http === 200) {
      } else  if (this.responseData.api_status === 0 ) {
        this.authService.presentToast('Credenciales incorrectas. Revisa tu correo y contraseña.');
      // } else  if (this.responseData.api_status === 0 && this.responseData.api_http === 401) {
      } else  if (this.responseData.api_status === 0 ) {
        this.authService.presentToast('Credenciales incorrectas. Revisa tu correo y contraseña.');
      } else  if (this.responseData.password === '123456' && this.responseData.status === 'Inactive') {
        this.router.navigate([ '/menu/login' ]);
      }
    }, (err) => {
        this.authService.presentToast('Falla del servicio.');
    });
  }

  getPregunta(tp) {
    this.getPreguntaData.tipo_preguntas = tp;
    this.authService.postData(JSON.stringify(this.getPreguntaData), 'getpregunta').then((result) => {
      this.setDescripcionPregunta = result;
      // if (this.setDescripcionPregunta.api_status === 1 && this.setDescripcionPregunta.api_http === 200 ) {
      if (this.setDescripcionPregunta.api_status === 1  ) {
          localStorage.setItem('setDP', JSON.stringify(this.setDescripcionPregunta));
          this.pregunta = this.setDescripcionPregunta.descripcion_preguntas;
        // } else  if (this.responseData.api_status === 0 && this.responseData.api_http === 200) {
      } else  if (this.responseData.api_status === 0 ) {
        this.authService.presentToast('Credenciales incorrectas. Revisa tu correo y contraseña.');
      // } else  if (this.responseData.api_status === 0 && this.responseData.api_http === 401) {
      } else  if (this.responseData.api_status === 0 ) {
        this.authService.presentToast('Credenciales incorrectas. Revisa tu correo y contraseña.');
      } else  if (this.responseData.password === '123456' && this.responseData.status === 'Inactive') {
        this.router.navigate([ '/menu/login' ]);
      }
    }, (err) => {
        this.authService.presentToast('Falla del servicio.');
    });
  }

  cancelar() {
    this.formularioUsuario = this.fb.group({
      password: '',
      correo: '',
      numero_contacto: '',
      respuesta: ''
    });
    this.activePassword = true;
    this.activeRespuesta = true;
    this.emailAction = false;
    this.celularAction = false;
  }
}
