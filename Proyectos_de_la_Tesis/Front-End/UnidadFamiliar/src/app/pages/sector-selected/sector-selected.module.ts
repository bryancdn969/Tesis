import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SectorSelectedPage } from './sector-selected.page';

const routes: Routes = [
  {
    path: '',
    component: SectorSelectedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SectorSelectedPage],
  exports: [
    SectorSelectedPage
  ],
})
export class SectorSelectedPageModule {}
