import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AddDialogComponent } from './container/add-dialog/add-dialog.component';
import { DeleteDialogComponent } from './container/delete-dialog/delete-dialog.component';
import { UpdateDialogComponent } from './container/update-dialog/update-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/material/material.module';
import { UploadFileComponent } from './container/upload-file/upload-file.component';
import { ToastrModule } from 'ngx-toastr';



@NgModule({
  declarations: [
    AddDialogComponent,
    DeleteDialogComponent,
    UpdateDialogComponent,
    UploadFileComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule,
    ToastrModule.forRoot()
  ],
  exports:[
    AddDialogComponent,
    DeleteDialogComponent,
    UpdateDialogComponent
  ]
})
export class SharedModule { }
