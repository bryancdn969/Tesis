import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { ToastController } from '@ionic/angular';

import { UserService } from './api/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  loggedIn = false;
  responseData: any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private toastController: ToastController,
    private authService: UserService,
    private router: Router,
  ) {
    // this.initializeApp();
  }

  async presentToast( message: string ) {
    const toast = await this.toastController.create({
        message,
        duration: 2000
    });
    toast.present();
  }

  async ngOnInit() {
    this.checkLoginStatus();
    // his.listenForLoginEvents();
  }

  checkLoginStatus() {
    this.responseData = (localStorage.getItem('HAS_LOGGED_IN'));
    if (this.responseData === 'hasLoggedIn') {
       this.router.navigate([ '/menu/shareLocation' ]);
    } else {
      this.initializeApp();
    }
    /* return this.authService.isLoggedIn().then(loggedIn => {
      return this.updateLoggedInStatus(loggedIn);
    }); */
  }

  /* listenForLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    this.events.subscribe('user:signup', () => {
      this.updateLoggedInStatus(true);
    });

    this.events.subscribe('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  } */

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
