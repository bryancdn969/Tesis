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
      title: 'Compartir tú Posición Actual',
      url: '/menu/shareLocation'
    },
    {
      title: 'Buscar Sitios Seguros',
      url: '/menu/safeSite'
    },
    {
      title: 'Ver Amigos',
      url: '/menu/addFriends'
    },
    {
      title: 'Ver la ubicación de mis Amigos',
      url: '/menu/viewPositionFriends'
    },
    {
      title: 'Mi Perfil',
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
