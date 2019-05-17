import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewPositionFriendsPage } from './view-position-friends.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPositionFriendsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewPositionFriendsPage]
})
export class ViewPositionFriendsPageModule {}
