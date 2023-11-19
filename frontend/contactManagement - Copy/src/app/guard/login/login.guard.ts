import { CanActivateFn, Router } from '@angular/router';
import { LoginValidator } from './login-validator.model';
import { inject } from '@angular/core';

export const loginGuard: CanActivateFn = (route, state) => {
  console.log("route",route);
  console.log("state",state);
  const ans = inject(LoginValidator).isLogin();
  const router = inject(Router);
  if(ans){
    console.log("access granted");
    return true;
  }
  console.log("not found");
    router.navigate(['']);
    inject(LoginValidator).loginError();
    return false;
};
