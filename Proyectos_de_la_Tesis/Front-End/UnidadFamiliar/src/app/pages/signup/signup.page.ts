import { Component, OnInit } from '@angular/core';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
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
  titleSignup: any;
  titleUpdate: any;
  formularioUsuario: FormGroup;
  existeUsuario: any;
  selectZone =  {};
  selectedPreguntas = {};
  comboZones: any;
  comboPreguntas: any;
  zones: any[] = [ ];
  preguntas: any [] = [ ];
  selectedSingleZone: any;
  selectedPregunta: any;
  sectorZone = { sector_zona : 0 , status_zona : 'A' };
  pregunta = { tipo_preguntas : 0 , descripcion_preguntas : '' , status_preguntas : 'A' };
  sectorEspecificas: any;
  sector: any[] = [ ];
  personaData = {nombre_persona : '' , correo_persona : '', telefono_persona : '',
                 ciudad_persona : 'Quito', sector_persona : '' , tipo_pregunta : 0, 	respuesta_pregunta_persona : '',
                 estado_persona : 'A'};
  persona: any;

  constructor(
      private authService: UserService,
      private router: Router,
      private fb: FormBuilder,
      public menu: MenuController,
  ) {
    localStorage.getItem('update');
    // console.log('update', localStorage.getItem('update') + '==' + null);
    if (localStorage.getItem('update') == null) {
      this.boolean        = true;
      this.activePassword = false;
      this.buttonRegister = false;
    } else if (localStorage.getItem('update') === 'false') {
      this.boolean        = false;
      this.activePassword = true;
      this.buttonRegister = true;
    }
  }

  // Se llama al servicio de zonas y se valida el build form
  ngOnInit() {
    this.buildForm();
    this.selectSector();
    this.selectPreguntas();
  }

  selectSector() {
    this.authService.postData(JSON.stringify(this.selectZone), 'selectzones').then((res) => {
      this.comboZones = res;
      // console.log(this.comboZones);
      for (let i = 0; i <= this.comboZones.data.length - 1; i++) {
        this.zones = this.comboZones.data;
      }
    });
  }

  selectPreguntas() {
    this.authService.postData(JSON.stringify(this.selectedPreguntas), 'selectpreguntas').then((res) => {
      this.comboPreguntas = res;
      // console.log(this.comboZones);
      for (let i = 0; i <= this.comboPreguntas.data.length - 1; i++) {
        this.preguntas = this.comboPreguntas.data;
      }
    });
  }

  // Compara la zona seleccionada y la cambia
  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.nombre_sector === e2.nombre_sector : e1 === e2;
  }

  // Compara la pregunta seleccionada y la cambia
  compareFnP(e1, e2): boolean {
    return e1 && e2 ? e1.descripcion_preguntas === e2.descripcion_preguntas : e1 === e2;
  }

  // sientre el cambio de zona y lo almacena en una variable
  singleChange() {
    // console.log(this.selectedSingleZone);
    this.sectorZone.sector_zona = this.selectedSingleZone.id_sector;
    this.personaData.sector_persona = this.sectorZone.sector_zona.toString();
    // console.log(this.personaData.sector_persona);
  }

  // sientre el cambio de la pregunta y lo almacena en una variable
  preguntaChange() {
    // console.log(this.selectedSingleZone);
    this.pregunta.tipo_preguntas = this.selectedPregunta.tipo_preguntas;
    this.pregunta.descripcion_preguntas = this.selectedPregunta.descripcion_preguntas;
  }

  // valida el registro tanto de la persona como la del usuario
  signup() {
    if (this.userData.name && this.userData.email && this.userData.password && this.userData.telefono
        && this.personaData.sector_persona.valueOf() !== '') {
      this.userExiste.telefono = this.userData.telefono;
      this.userData.telefono = this.userData.telefono;
      this.personaData.nombre_persona = this.userData.name;
      this.personaData.correo_persona = this.userData.email;
      this.personaData.telefono_persona = this.userData.telefono;
      this.personaData.tipo_pregunta = this.pregunta.tipo_preguntas;
      this.personaData.respuesta_pregunta_persona = this.personaData.respuesta_pregunta_persona.toLocaleUpperCase();

        // Aqui registraremos el usuario
      this.authService.postData(JSON.stringify(this.userExiste), 'controlarusuariosrepetidos').then((res) => {
          this.existeUsuario = res;
          if (this.existeUsuario.api_status === 1 && this.existeUsuario.api_http === 200) {
            this.authService.presentToast('El número de teléfono ingresado ya existe.');
          } else {
            this.authService.postData(JSON.stringify(this.userData), 'signup').then((result) => {
              this.responseData = result;
              // console.log(this.responseData);
              if (this.responseData.api_status === 1 && this.responseData.api_http === 200) {
                localStorage.setItem('userData', JSON.stringify(this.responseData));
                // Crearemos primero persona
                this.authService.postData(JSON.stringify(this.personaData), 'createperson').then((resPerson) => {
                  this.persona = resPerson;
                  // console.log(this.persona);
                  this.authService.presentToast('Usuario guardado correctamente.');
                 // this.buildForm();
                  this.router.navigate([ '/menu/login' ]);
                }, (err) => {
                  // console.log(err);
                  this.authService.presentToast('Falla del servicio.');
                });
              }
            }, (err) => {
              // console.log(err);
              this.authService.presentToast('Falla del servicio.');
            });
          }
         }, (err) => {
          // console.log(err);
          this.authService.presentToast('Falla del servicio.');
        });
    } else {
      this.authService.presentToast('Todos los campos son necesarios.');
    }
  }

  regresar() {
    // console.log(localStorage.getItem('changePage') + ' == ' + 'Profile');
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
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(10)]],
      ciudad: [''],
      sector: ['', [Validators.required]],
      pregunta: ['', [Validators.required]],
      respuesta: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]]
    });
  }

  ionViewWillEnter() {
    this.menu.enable(false);
  }
}
