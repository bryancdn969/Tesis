import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SafeSitePage } from './safe-site.page';

const routes: Routes = [
  {
    path: '',
    component: SafeSitePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SafeSitePage],
  exports: [
    SafeSitePage
  ],
})
export class SafeSitePageModule {}
