import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewPositionFriendsMapPage } from './view-position-friends-map.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPositionFriendsMapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewPositionFriendsMapPage]
})
export class ViewPositionFriendsMapPageModule {}
