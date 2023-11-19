import { Injectable } from "@angular/core";
import { UserService } from "../../../shared/service/user/user.service";
import { ToastrService } from "ngx-toastr";
@Injectable()
export class LoginValidator {
    constructor(private userService : UserService, private toastr: ToastrService){

    }
    isLogin():boolean{
        return this.userService.userInfo != null ? true : false;
    }
    loginError(){
        this.toastr.error('access denied','Not authenticated');
    }
}
