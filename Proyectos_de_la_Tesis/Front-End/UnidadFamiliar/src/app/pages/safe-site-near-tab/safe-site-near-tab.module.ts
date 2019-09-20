import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SafeSiteNearTabPage } from './safe-site-near-tab.page';

const routes: Routes = [
  {
    path: '',
    component: SafeSiteNearTabPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SafeSiteNearTabPage],
  exports: [
    SafeSiteNearTabPage
  ],
})
export class SafeSiteNearTabPageModule {}
