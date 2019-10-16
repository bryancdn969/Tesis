import { Component, OnInit } from '@angular/core';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-tab',
  templateUrl: './update-tab.page.html',
  styleUrls: ['./update-tab.page.scss'],
})
export class UpdateTabPage implements OnInit {

  responseData: any;
  responseDataid: any;
  responseDataFriend: any;
  count = 0;
  aux: any;
  nombre: any;
  telefono: any;
  correo: any;
  auxNombre = true;
  getIdFriend: any;
  userData = { id: '', id_user : '', telefono_friend : '', nombre_friend : '', email_friend : '' };
  selectFriend = { id_user : 0 , status_friend : 'A' };
  dataVerification = { id_user : 0};

  comboFriend: any;
  friends: any[] = [ ];

  selectedSingleEmployee: any;
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
    // tomo el id del usaurio logeuado
    this.dataVerification.id_user = JSON.parse(this.responseDataid).id;
    this.selectFriend.id_user = this.dataVerification.id_user;

    this.authService.postData(JSON.stringify(this.selectFriend), 'selectfriend').then((res) => {
      this.comboFriend = res;
      // console.log(this.comboFriend);
      for (let i = 0; i <= this.comboFriend.data.length - 1; i++) {
        this.friends = this.comboFriend.data;
      }
    });
   }

  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.nombre_friend === e2.nombre_friend : e1 === e2;
  }

  singleChange() {
    // console.log(this.selectedSingleEmployee);
    this.userData.nombre_friend = this.selectedSingleEmployee.nombre_friend;
    this.userData.email_friend = this.selectedSingleEmployee.email_friend;
    this.userData.telefono_friend = this.selectedSingleEmployee.telefono_friend;
    this.userData.id = this.selectedSingleEmployee.id;
  }

  ngOnInit() {
    this.buildForm();
  }

  updateFriend() {
    if (this.userData.nombre_friend && this.userData.telefono_friend) {
          this.authService.postData(JSON.stringify(this.userData), 'updatefriend').then((result) => {
          this.responseDataFriend = result;
          if (this.responseDataFriend.api_status === 1 ) {
            localStorage.setItem('userDataFriendUpdte', this.responseDataFriend);
            this.authService.presentToast('Amigo actualizado correctamente.');
            this.router.navigate([ '/menu/shareLocation' ]);
          } else {
            this.authService.presentToast('Error al actualizar.');
          }
        }, (err) => {
          this.authService.presentToast('El servicio falló.');
        });
      } else {
        this.authService.presentToast('La información es requerida.');
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
    });
  }

  cancelar() {
    this.formularioUsuario = this.fb.group({
      nombre: '',
      correo: '',
      numero_contacto: '',
    });
  }

}
