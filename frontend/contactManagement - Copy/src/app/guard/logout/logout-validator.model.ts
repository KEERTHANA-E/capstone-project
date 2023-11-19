import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { UserService } from "src/shared/service/user/user.service";
@Injectable()
export class LogoutValidator {
    constructor(private userService : UserService, private toastr: ToastrService){

    }
    isLogin():boolean{
        return this.userService.userInfo == null ? true : false;
    }
    loginError(){
        this.toastr.error('You have already logged in','Login');
    }
}
