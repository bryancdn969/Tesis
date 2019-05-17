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
      title: 'Search for safe sites',
      url: '/menu/safeSite'
    },
    {
      title: 'Share current location',
      url: '/menu/shareLocation'
    },
    {
      title: 'Add Friends',
      url: '/menu/addFriends'
    },
    {
      title: 'View Position Freinds',
      url: '/menu/viewPositionFreinds'
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
