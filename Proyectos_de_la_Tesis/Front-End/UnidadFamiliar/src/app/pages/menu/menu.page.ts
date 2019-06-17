import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  selectedPath = '';

  pages = [
    {
      title: 'Compartir Posiciòn Actual',
      url: '/menu/shareLocation'
    },
    {
      title: 'Buscar Sitios Seguros',
      url: '/menu/safeSite'
    },
    {
      title: 'Amigos',
      url: '/menu/addFriends'
    },
    {
      title: 'Ver la ubicaciòn de mis Amigos',
      url: '/menu/viewPositionFriends'
    },
    {
      title: 'Perfil',
      url: '/menu/profile'
    }
  ];

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
      }
    });
  }

  ngOnInit() {
  }

}
