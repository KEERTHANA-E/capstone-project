import { Component } from '@angular/core';
import { FileDetails } from 'src/shared/model/user';
import { UserService } from 'src/shared/service/user/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {
  file!: File;
  fileDetails!: FileDetails;
  fileUris: Array<string> = [];

  constructor(private fileUploadService: UserService) {
    
   }

  ngOnInit(): void {
  }

  selectFile(event: any) {
    this.file = event.target.files.item(0);
  }

  uploadFile() {
    this.fileUploadService.upload(this.file,this.fileUploadService.userInfo).subscribe({
      next: (data) => {
        this.fileDetails = data;
        this.fileUris.push(this.fileDetails.fileUrl);
        alert("File Uploaded Successfully")
      },
      error: (e) => {
        console.log(e);
      }
    });
  }
}
