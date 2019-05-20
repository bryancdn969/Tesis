import { Component, OnInit } from '@angular/core';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

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

  userData = { telefono_friend : '', nombre_friend : '', email_friend : '', status_friend : 'A' };
  selectFriend = { id_user : 0 , status_friend : 'A' };

  dataVerification = { id_user : 0};

  comboFriend: any;
  friends: any[] = [ ];

  constructor(
    private authService: UserService,
    private router: Router,
    private toastController: ToastController
  ) {
    // primero consultamos si el usaurio tiene contactos agregados
    this.responseDataid = localStorage.getItem('userDataLogin');
    this.aux = JSON.parse(this.responseDataid);

    // tomo el id del usaurio logeuado
    this.dataVerification.id_user = JSON.parse(this.responseDataid).id;
    this.selectFriend.id_user = this.dataVerification.id_user;

    this.authService.postData(JSON.stringify(this.selectFriend), 'selectfriend').then((res) => {
      this.comboFriend = res;
      for (let i = 0; i <= this.comboFriend.data.length - 1; i++) {
        this.friends = this.comboFriend.data;
      }

    });
   }

  ngOnInit() {
  }

  async presentToast( message: string ) {
    const toast = await this.toastController.create({
      message,
      duration: 2000
    });
    toast.present();
  }

  updateFriend() {

      if (this.userData.nombre_friend && this.userData.telefono_friend) {
          this.authService.postData(JSON.stringify(this.userData), 'updatefriend').then((result) => {
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
