import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../api/user.service';
import { ToastController } from '@ionic/angular';
import { IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';
import { Router } from '@angular/router';

// declare var google;

@Component({
  selector: 'app-view-position-friends',
  templateUrl: './view-position-friends.page.html',
  styleUrls: ['./view-position-friends.page.scss'],
})
export class ViewPositionFriendsPage implements OnInit {

  amigo: any[] = [ ];
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;
  sectorFriendEspecificas: any;
  sectorFriend = { id_user_position : '' , status_position : 'A' };
  responseData: any;
  aux = '';

  constructor(
    private authService: UserService,
    private toastController: ToastController,
    private router: Router,
  ) {
    this.responseData = JSON.parse(localStorage.getItem('userDataLogin'));
    this.sectorFriend.id_user_position = this.responseData.id;
    this.authService.postData(JSON.stringify(this.sectorFriend), 'viewpositionfriendmap').then((res) => {
      this.sectorFriendEspecificas = res;
      for (let i = 0; i <= this.sectorFriendEspecificas.data.length - 1; i++) {
        this.amigo = this.sectorFriendEspecificas.data;
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

  optionsFn(auxFriend) {
    this.aux = auxFriend;
    console.log(this.aux);
    localStorage.setItem('friendSelected', JSON.stringify(this.aux));
    this.router.navigate([ '/menu/viewFriendPositionMap' ]);
  }

  ngOnInit() {

  }

  loadData(event) {
    setTimeout(() => {
      // Hide Infinite List Loader on Complete
      event.target.complete();
      // Rerender Virtual Scroll List After Adding New Data
      this.virtualScroll.checkEnd();
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.amigo.length <= this.sectorFriendEspecificas.data.length) {
        event.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

}
