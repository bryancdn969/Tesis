import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children: [
      {
        path: 'safeSite',
        loadChildren: '../safe-site/safe-site.module#SafeSitePageModule'
      },
      {
        path: 'shareLocation',
        loadChildren: '../share-location/share-location.module#ShareLocationPageModule'
      },
      {
        path: 'login',
        loadChildren: '../login/login.module#LoginPageModule'
      },
      {
        path: 'signup',
        loadChildren: '../signup/signup.module#SignupPageModule'
      },
      {
        path: 'addFriends',
        loadChildren: '../add-friends/add-friends.module#AddFriendsPageModule'
      },
      {
        path: 'viewPositionFreinds',
        loadChildren: '../view-position-friends/view-position-friends.module#ViewPositionFriendsPageModule'
      },
      {
        path: 'allFriends',
        loadChildren: '../all-friends/all-friends.module#AllFriendsPageModule'
      },
      {
        path: 'friendsDetail',
        loadChildren: '../friends-detail/friends-detail.module#FriendsDetailPageModule'
      },
      {
        path: 'sectorSelected',
        loadChildren: '../sector-selected/sector-selected.module#SectorSelectedPageModule'
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
