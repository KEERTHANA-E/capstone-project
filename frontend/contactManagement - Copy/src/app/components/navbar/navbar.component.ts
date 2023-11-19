import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/shared/service/user/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private router : Router, public userService : UserService){

  }
  routeNavigate(){
    this.router.navigate(['/history']);
  }
  logout(){
    this.userService.userInfo=null;
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
