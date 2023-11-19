import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component,NgZone,OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { UserService } from 'src/shared/service/user/user.service';
@Component({
  selector: 'app-add-dialog',
  templateUrl: './add-dialog.component.html',
  styleUrls: ['./add-dialog.component.css']
})
export class AddDialogComponent implements OnInit{
  addForm: FormGroup | any;
  selected='female';
  constructor(private _ngZone: NgZone,private userService:UserService, private fb: FormBuilder, public dialog: MatDialogRef<AddDialogComponent>) {
  }
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }
  ngOnInit(): void {
    this.addForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required]),
      phonenumber: this.fb.array([],Validators.required),
      company: this.fb.control(this.userService.userInfo.company, [Validators.required]),
      role: this.fb.control('', [Validators.required]),
      notes:this.fb.control('', [Validators.required]),
      gender:this.fb.control('', [Validators.required]),
    });
    this.addPhoneNumber();
  }
  addPhoneNumber() {
    const phoneArray = this.addForm.get('phonenumber') as FormArray;
    const newPhone = this.fb.group({
      'number': ['', Validators.required],
      'type': ['', Validators.required]
    });
    phoneArray.push(newPhone);
  }
  deletePhoneNumber(lessonIndex: number) {
    const phoneArray = this.addForm.get('phonenumber') as FormArray;
    phoneArray.removeAt(lessonIndex);
  }
  createContact() {
    if (this.addForm.valid) {
      console.log("before sending ",this.addForm.value);
      const tmp = this.addForm.value;
      this.dialog.close({data : tmp});
      }
      else{
        alert("fill all fields");
      }
  }
  closeDialog() {
    this.dialog.close();
  }
}
