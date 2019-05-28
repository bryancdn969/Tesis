import {Component} from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private router: Router,
    public menu: MenuController,
  ) {
  }

  login() {
    this.router.navigate([ '/login' ]);
  }

  signup() {
    this.router.navigate([ '/signup' ]);
  }

  ionViewWillEnter() {
    /* this.storage.get('ion_did_tutorial').then(res => {
      if (res === true) {
        this.router.navigateByUrl('/app/tabs/schedule');
      }
    }); */

    this.menu.enable(false);
  }

}
