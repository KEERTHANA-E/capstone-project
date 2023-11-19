import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LogoutValidator } from './logout-validator.model';

export const logoutGuard: CanActivateFn = (route, state) => {
  console.log("route",route);
  console.log("state",state);
  const ans = inject(LogoutValidator).isLogin();
  const router = inject(Router);
  if(ans){
    console.log("access granted");
    return true;
  }
  console.log("access denied to login page");
    router.navigate(['/home']);
    inject(LogoutValidator).loginError();
    return false;
};
