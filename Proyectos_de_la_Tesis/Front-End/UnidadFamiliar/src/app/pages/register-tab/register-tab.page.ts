import { Component, OnInit } from '@angular/core';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-tab',
  templateUrl: './register-tab.page.html',
  styleUrls: ['./register-tab.page.scss'],
})
export class RegisterTabPage implements OnInit {

  responseData: any;
  responseDataid: any;
  responseDataFriend: any;
  count = 0;
  aux: any;
  userData = { id_user : '' , name_user : '' ,  telefono_user : '' , telefono_friend : '', nombre_friend : '',
  email_friend : '' , count_friend : this.count, status_friend : 'A' };
  selectFriend = { id_user : 0 , status_friend : 'A' };
  dataVerification = { id_user : 0};
  friends: any[] = [ ];
  formularioUsuario: FormGroup;

  constructor(
    private authService: UserService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    // primero consultamos si el usaurio tiene contactos agregados
    this.responseDataid = localStorage.getItem('userDataLogin');
    this.aux = JSON.parse(this.responseDataid);
    this.userData.id_user = this.aux.id;
    this.userData.name_user = this.aux.name;
    this.userData.telefono_user = this.aux.telefono;

    // tomo el id del usaurio logeuado
    this.dataVerification.id_user = JSON.parse(this.responseDataid).id;
    this.selectFriend.id_user = this.dataVerification.id_user;
    // servicio para ver desde cuadno agregar
    this.authService.postData(JSON.stringify(this.dataVerification), 'testing').then((result) => {
      this.responseData = result;
      if (this.responseData.api_status === 1 && this.responseData.api_http === 200 &&
          this.responseData.data.length <= 0) {
          this.count = 0;
      } else {
        this.count = this.responseData.data[0].count_friend;
        console.log(this.count);
      }
    });
  }

  ngOnInit() {
    this.buildForm();
  }

  addFriend() {
    if (this.count > 3) {
      this.authService.presentToast('Solo puede agregar 3 amigos.');
    } else {

      if (this.userData.nombre_friend && this.userData.telefono_friend) {
        this.userData.count_friend = this.count + 1;
        this.authService.postData(JSON.stringify(this.userData), 'addfriend').then((result) => {
          this.responseDataFriend = result;
          console.log(this.responseDataFriend);
          if (this.responseData.api_status === 1 && this.responseData.api_http === 200) {
            localStorage.setItem('userDataFriend', JSON.stringify(this.responseData));
            this.authService.presentToast('Friend saved successful.');
          } else {
            this.authService.presentToast('Error saving.');
          }
        }, (err) => {
          console.log(err);
          this.authService.presentToast('The service is failed.');
        });
      } else {
        this.authService.presentToast('The data is required.');
      }
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
      sector: ['', [Validators.required]]
    });
  }

  cancelar() {
    this.formularioUsuario = this.fb.group({
      nombre: '',
      correo: '',
      numero_contacto: ''
    });
  }
}
