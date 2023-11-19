import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, Inject, NgZone, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';

import { User, Num,FileDetails } from 'src/shared/model/user';
import { UserService } from 'src/shared/service/user/user.service';

@Component({
  selector: 'app-update-dialog',
  templateUrl: './update-dialog.component.html',
  styleUrls: ['./update-dialog.component.css']
})

export class UpdateDialogComponent {
  updateForm: FormGroup = null;
  file!: File;
  fileDetails!: FileDetails;
  fileUris: Array<string> = [];
  constructor(private _ngZone: NgZone,public userService : UserService, private fb: FormBuilder, public dialog: MatDialogRef<UpdateDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: User) {
  }
  selectFile(event: any) {
    this.file = event.target.files.item(0);
  }
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }
  ngOnInit(): void {
    this.updateForm = this.fb.group({
      name: this.fb.control(this.data.name, [Validators.required]),
      email: this.fb.control(this.data.email, [Validators.required]),
      phonenumber: this.fb.array([],Validators.required),
      company: this.fb.control(this.data.company, [Validators.required]),
      role: this.fb.control(this.data.role, [Validators.required]),
      notes : this.fb.control(this.data.notes, [Validators.required]),
      gender:this.fb.control(this.data.gender, [Validators.required]),
    });

    

    this.data.phonenumber.forEach((num: Num) => {
      const numGroup = this.fb.group({
        number: [num.number, Validators.required],
        type: [num.type, Validators.required]
      });
      (this.updateForm.get('phonenumber') as FormArray).push(numGroup);

    });
  }
  isValid() : String{
    const loggedIn = this.userService.userInfo;
    if(loggedIn?._id == this.data._id){
      return "admin";
    }
    return "user";
  }
  deletePhoneNumber(lessonIndex: number) {
    const phoneArray = this.updateForm.get('phonenumber') as FormArray;
    phoneArray.removeAt(lessonIndex);
  }
  addPhoneNumber() {
    const phoneArray = this.updateForm.get('phonenumber') as FormArray;
    const newPhone = this.fb.group({
      'number': ['', Validators.required],
      'type': ['mobile', Validators.required]
    });
    phoneArray.push(newPhone);
  }
  updateContact() {
    console.log(this.userService.userInfo.isAdmin);
    if (this.updateForm.valid) {
      console.log("before sending ", this.updateForm.value);
      const tmp = this.updateForm.value;
      this.dialog.close({ data: [tmp,this.file] });
    }
    else {
      alert("fill all fields");
    }
  }
  closeDialog() {
    this.dialog.close();
  }
}
