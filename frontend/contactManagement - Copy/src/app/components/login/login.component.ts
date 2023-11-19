import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Org } from 'src/shared/model/org';
import { OrgService } from 'src/shared/service/org/org.service';
import { UserService } from 'src/shared/service/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | any;
  orgList: Org[] | any;
  constructor(private toastr: ToastrService, private fb: FormBuilder, private router: Router, private orgService: OrgService, private userService: UserService) {

  }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required,Validators.email]),
      password: this.fb.control('', [Validators.required]),
      org: this.fb.control('none', [Validators.required])
    });
    this.getOrg();
  }
  getOrg() {
    this.orgService.getOrg().subscribe((data: any) => {
      this.orgList = data.response;
      this.orgService.orgInfo = data.response;
      console.log(this.orgList);
    })
  }
  submitLoginForm() {
    if (this.loginForm.valid) {
      if (this.loginForm.value.org == 'none') {
        this.toastr.error('select the organisation');
      }
      else {
        const formData = this.loginForm.value;
        console.log(formData['email'])
        let obj = {
          email: formData['email'],
          password: formData['password'],
          createdBy: formData['org']
        };
        console.log(formData);
        this.userService.validateUser(obj).subscribe((response: any) => {
          console.log("response", response);
          this.userService.userInfo = response;
          localStorage.setItem('user', JSON.stringify(response));
          console.log(this.userService.userInfo);
          console.log("is admin", this.userService.userInfo.isAdmin);

          this.router.navigate(['/home']);
        }, error => {
          console.log("error", error);
          // Handle error message using a toastr or display it on the page
        });
      }
    }
    else {
      alert("login form is not valid");
    }
  }
}
