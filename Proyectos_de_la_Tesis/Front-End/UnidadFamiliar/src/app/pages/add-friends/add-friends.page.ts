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

  userData = { "name" : '', "telefono" : '',  "email" : '' };
  responseData: any;
  count: number;

  constructor(
      private authService: UserService,
      private router: Router,
      private toastController: ToastController
  ) { }

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
    if (this.userData.name && this.userData.telefono && this.userData.email) {
      this.authService.postData(JSON.stringify(this.userData), 'addFriend').then((result) => {
        this.responseData = result;
        console.log(this.responseData);
        if (this.responseData.api_status === 1 && this.responseData.api_http === 200) {
          localStorage.setItem('userData', JSON.stringify(this.responseData));
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
