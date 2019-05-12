import { Component, OnInit } from '@angular/core';
import { UserService } from '../../api/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-friends',
  templateUrl: './add-friends.page.html',
  styleUrls: ['./add-friends.page.scss'],
})
export class AddFriendsPage implements OnInit {

  responseData: any;
  responseDataid: any;
  count = 0;

  userData = { "id_user" : this.responseDataid.id , "name_user" : this.responseDataid.name ,
  "telefono_user" : this.responseDataid.telefono ,
  "telefono_friend" : '', "nombre_friend" : '', "email_friend" : '' ,
  "count_friend" : this.count, "status_friend" : 'Active' };

  constructor(
      private authService: UserService,
      private router: Router,
      private toastController: ToastController
  ) {
    this.responseDataid = localStorage.getItem('userDataLogin');
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
    this.count = this.count + 1;
    if (this.count > 3) {
      this.presentToast('You can only add 3 friends.');
    } else {
      if (this.userData.nombre_friend && this.userData.telefono_friend) {
        this.authService.postData(JSON.stringify(this.userData), 'addFriend').then((result) => {
          this.responseData = result;
          console.log(this.responseData);
          if (this.responseData.api_status === 1 && this.responseData.api_http === 200) {
            localStorage.setItem('userDataFriend', JSON.stringify(this.responseData));
            this.presentToast('Friend saved successful.');
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
