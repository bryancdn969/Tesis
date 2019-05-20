import { Component, OnInit } from '@angular/core';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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

  constructor(
    private authService: UserService,
    private router: Router,
    private toastController: ToastController
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
      }
    });
  }

  async presentToast( message: string ) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
  }

  addFriend() {
    if (this.count > 3) {
      this.presentToast('You can only add 3 friends.');
    } else {

      if (this.userData.nombre_friend && this.userData.telefono_friend) {
        this.userData.count_friend = this.count + 1;
        this.authService.postData(JSON.stringify(this.userData), 'addfriend').then((result) => {
          this.responseDataFriend = result;
          console.log(this.responseDataFriend);
          if (this.responseData.api_status === 1 && this.responseData.api_http === 200) {
            localStorage.setItem('userDataFriend', JSON.stringify(this.responseData));
            this.presentToast('Friend saved successful.');
          } else {
            this.presentToast('Error saving.');
          }
        }, (err) => {
          console.log(err);
          this.presentToast('The service is failed.');
        });
      } else {
        this.presentToast('The data is required.');
      }
    }
  }

}
