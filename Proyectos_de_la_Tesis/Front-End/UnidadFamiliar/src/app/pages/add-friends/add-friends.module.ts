import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddFriendsPage } from './add-friends.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: AddFriendsPage,
    children: [
      {
        path: 'register',
        loadChildren: '../register-tab/register-tab.module#RegisterTabPageModule'
      },
      {
        path: 'update',
        loadChildren: '../update-tab/update-tab.module#UpdateTabPageModule'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/register',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddFriendsPage]
})
export class AddFriendsPageModule {}
