import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { HistoryComponent } from './components/history/history.component';
import { loginGuard } from './guard/login/login.guard';
import { logoutGuard } from './guard/logout/logout.guard';

const routes: Routes = [
  {
    path:'',
    component:LandingPageComponent
  },
  {
    path:'history',
    component:HistoryComponent,
    canActivate:[loginGuard]
  },
  {
    path:'home',
    component:HomeComponent,
    canActivate:[loginGuard]
  },
  {
    path:'login',
    component:LoginComponent,
    canActivate:[logoutGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
