import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'menu', loadChildren: './pages/menu/menu.module#MenuPageModule' },
  { path: 'safe-site', loadChildren: './pages/safe-site/safe-site.module#SafeSitePageModule' },
  { path: 'share-location', loadChildren: './pages/share-location/share-location.module#ShareLocationPageModule' },
  { path: 'signup', loadChildren: './pages/signup/signup.module#SignupPageModule' },
  { path: 'add-friends', loadChildren: './pages/add-friends/add-friends.module#AddFriendsPageModule' },
  { path:
    'view-position-friends', loadChildren: './pages/view-position-friends/view-position-friends.module#ViewPositionFriendsPageModule' },
  { path: 'friends-detail', loadChildren: './pages/friends-detail/friends-detail.module#FriendsDetailPageModule' },
  { path: 'all-friends', loadChildren: './pages/all-friends/all-friends.module#AllFriendsPageModule' },
  { path: 'update-tab', loadChildren: './pages/update-tab/update-tab.module#UpdateTabPageModule' },
  { path: 'register-tab', loadChildren: './pages/register-tab/register-tab.module#RegisterTabPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
