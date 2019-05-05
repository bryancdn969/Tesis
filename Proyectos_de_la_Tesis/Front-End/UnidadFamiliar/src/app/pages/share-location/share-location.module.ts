import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ShareLocationPage } from './share-location.page';

const routes: Routes = [
  {
    path: '',
    component: ShareLocationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ShareLocationPage],
  exports: [
    ShareLocationPage
  ],
})
export class ShareLocationPageModule {}
