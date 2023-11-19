import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent {
  constructor(public dialog : MatDialogRef<DeleteDialogComponent>){
    
  }
  confirm(){
    this.dialog.close({data:true});
  }
  closeDialog(){
    this.dialog.close({data:false});
  }
}
