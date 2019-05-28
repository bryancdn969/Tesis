import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SafeSitePage } from './safe-site.page';

const routes: Routes = [
  {
    path: 'tabsSite',
    component: SafeSitePage,
    children: [
      {
        path: 'nearSite',
        loadChildren: '../safe-site-near-tab/safe-site-near-tab.module#SafeSiteNearTabPageModule'
      },
      {
        path: 'searchSite',
        loadChildren: '../safe-site-search-tab/safe-site-search-tab.module#SafeSiteSearchTabPageModule'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabsSite/nearSite',
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
  declarations: [SafeSitePage],
  exports: [
    SafeSitePage
  ],
})
export class SafeSitePageModule {}
