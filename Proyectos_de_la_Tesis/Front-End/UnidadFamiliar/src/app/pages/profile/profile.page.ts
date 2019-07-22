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

userData = { name : '', email : '', telefono : '' , password : '', status : 'Active', ciudad : 'Quito', sector : '', respuesta: '',
              pregunta : '' };
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
  takePersona = {correo_persona : '', estado_persona : 'A', email : '', status : 'Active' };
  persona: any;
  buttonActivePassword = true;
  personData = { correo_persona : '', telefono_persona : '', estado_persona : 'A' };
  tipoPregunta = 0;
  getPreguntaData = { tipo_preguntas: 0, status_preguntas : 'A' };
  pregunta: any;
  selectedPregunta: any;

  constructor(
      private authService: UserService,
      private router: Router,
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
    this.personData.correo_persona = this.persona.correo_persona;
    this.personData.telefono_persona = this.persona.telefono_persona;
    this.userData.respuesta = this.persona.respuesta_pregunta_persona;
    this.userData.pregunta = this.persona.tipo_pregunta;
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
    this.authService.presentToast('Falla de servicio.');
    });
  }

  preguntaChange() {
    // console.log(this.selectedSingleZone);
    this.pregunta.tipo_preguntas = this.selectedPregunta.tipo_preguntas;
    this.pregunta.descripcion_preguntas = this.selectedPregunta.descripcion_preguntas;
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
  }

  // Compara la zona seleccionada y la cambia
  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.nombre_sector === e2.nombre_sector : e1 === e2;
  }

  compareFnP(e1, e2): boolean {
    return e1 && e2 ? e1.pregunta === e2.pregunta : e1 === e2;
  }

  // sientre el cambio de zona y lo almacena en una variable
  singleChange() {
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

  }

}
