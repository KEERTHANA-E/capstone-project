import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { UserService } from 'src/shared/service/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from '../../../shared/container/add-dialog/add-dialog.component';
import { DeleteDialogComponent } from '../../../shared/container/delete-dialog/delete-dialog.component';
import { User, FileDetails, Num } from 'src/shared/model/user';
import { UpdateDialogComponent } from 'src/shared/container/update-dialog/update-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrgService } from 'src/shared/service/org/org.service';
import { ToastrService } from 'ngx-toastr';
import { NgxCSVParserError, NgxCsvParser } from 'ngx-csv-parser';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnChanges {
  fileDetails!: FileDetails;
  fileUris: Array<string> = [];
  csvRecords: any[] = [];
  roles: string[] = [];
  userList: User[] = [];
  filterForm: FormGroup | any;
  activeUserIndex: number;
  constructor(private ngxCsvParser: NgxCsvParser, private toastr: ToastrService, private fb: FormBuilder, private orgService: OrgService, public userService: UserService, private dialog: MatDialog) {
    this.activeUserIndex = null;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getUser();
  }
  ngOnInit(): void {
    this.filterForm = this.fb.group({
      query: this.fb.control(''),
      type: this.fb.control(''),
      role: this.fb.control('')
    });
    this.activateForms();
    this.getUser();
  }
  fileName = `${this.userService.userInfo.company}.xlsx`;

  // exportexcel() {
  //   const headerRow = [
  //     { name: 'Name', key: 'name' },
  //     { name: 'Email', key: 'email' },
  //     { name: 'Password', key: 'password' },
  //     { name: 'Phone Numbers', key: 'phoneNumbers' },
  //     { name: 'Role', key: 'role' },
  //     { name: 'Gender', key: 'gender' },
  //     { name: 'Company', key: 'company' },
  //     { name: 'Created By', key: 'createdBy' },
  //     { name: 'Notes', key: 'notes' },
  //     { name: 'isAdmin', key: 'isAdmin' },
  //     { name: 'History', key: 'history' },
  //     { name: 'Attachments', key: 'attachments' }
  //   ];

  //   this.userList.forEach(user => {
  //     /** transform the data for phone numbers **/
  //     const phoneNumbers = user.phonenumber.map(phoneNumber => `${phoneNumber.type}: ${phoneNumber.number}`);

  //     /** transform the data for the history property **/
  //     const historyItems = user.history.map(historyItem => ({
  //       type: historyItem.type,
  //       content: historyItem.content,
  //       timestamp: historyItem.timestamp
  //     }));

  //     /** transform the data for the attachments property **/
  //     const attachments = user.attachments.map(attachment => ({
  //       fileName: attachment.fileName,
  //       fileUrl: attachment.fileUrl
  //     }));

  //     /** create a new worksheet for this user **/
  //     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([
  //       ...headerRow.map(row => ({ name: row.name, value: user[row.key] })),
  //       { name: 'Phone Numbers', value: phoneNumbers.join(', ') },
  //       { name: 'History', value: JSON.stringify(historyItems) },
  //       { name: 'Attachments', value: JSON.stringify(attachments) }
  //     ]);

  //     /** create a new workbook and add the worksheet **/
  //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

  //     /** save the file **/
  //     XLSX.writeFile(wb, `${user.name}.xlsx`);
  //   });
  // }
  exportexcel() {
    const headerRow = [
      { name: 'Name', key: 'name' },
      { name: 'Email', key: 'email' },
      { name: 'Password', key: 'password' },
      { name: 'Phone Numbers', key: 'phoneNumbers' },
      { name: 'Role', key: 'role' },
      { name: 'Gender', key: 'gender' },
      { name: 'Company', key: 'company' },
      { name: 'Created By', key: 'createdBy' },
      { name: 'Notes', key: 'notes' },
      { name: 'isAdmin', key: 'isAdmin' },
      { name: 'History', key: 'history' },
      { name: 'Attachments', key: 'attachments' }
    ].map(row => ({ ...row, name: row.name.toString() }))
      .filter(row => row.name !== '' && row.name !== undefined);
  
    /** create an array that contains all user data **/
    const sheetData = this.userList.map(user => {
      /** transform the data for phone numbers **/
      const phoneNumbers = user.phonenumber.map(phoneNumber => `${phoneNumber.type}: ${phoneNumber.number}`);
  
      /** transform the data for the history property **/
      const historyItems = user.history.map(historyItem => ({
        type: historyItem.type,
        content: historyItem.content,
        timestamp: historyItem.timestamp
      }));
  
      /** transform the data for the attachments property **/
      const attachments = user.attachments.map(attachment => ({
        fileName: attachment.fileName,
        fileUrl: attachment.fileUrl
      }));
  
      /** create a new object for this user **/
      const userObj = headerRow.reduce((acc, cur) => ({ ...acc, [cur.name]: user[cur.key] }), {});
      userObj['Phone Numbers'] = phoneNumbers.join(', ');
      userObj['History'] = JSON.stringify(historyItems);
      userObj['Attachments'] = JSON.stringify(attachments);
  
      return userObj;
    });
  
    /** create an array of data rows **/
    const dataRows = sheetData.map(data => headerRow.map(row => data[row.name].toString()));
  
    /** create a new worksheet with the header row and user data **/
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([
      headerRow.map(row => row.name),
      ...dataRows
    ]);
    
    /** create a new workbook and add the worksheet **/
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    /** save the file **/
    XLSX.writeFile(wb, this.fileName);
  }
  activateForms(): void {
    this.filterForm.valueChanges.subscribe((val: any) => {
      console.log("val", val);
      this.userService.searchFilterData(val.role, val.query, val.type).subscribe(data => {
        this.userList = data;
        console.log("after update : ", data);
      });


    });
  }
  @ViewChild('fileImportInput') fileImportInput: any;
  fileChangeListener($event: any): void {
    const files = $event.srcElement.files;

    this.ngxCsvParser.parse(files[0], { header: true, delimiter: ',' })
      .pipe().subscribe((result: Array<any>) => {

        this.csvRecords = result;
        console.log('Result', this.csvRecords);
        this.createMultipleUsers(this.csvRecords);
        this.toastr.success('file added successfully', 'Success');
      }, (error: NgxCSVParserError) => {
        this.toastr.error('Oops! something went wrong', 'Error');
        console.log('Error', error);
      });
  }
  getUser(): void {
    this.userService.getAllUser().subscribe(data => {
      this.userList = data;
      console.log("response : ", this.userList);
      this.roles = [...new Set(this.userList.map(employee => employee.role))];
      console.log("roles", this.roles);
    });

  }
  openDialogForDelete(user: User): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '300px',
      height: '120px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.data == true) {
        console.log("confirmed");
        this.userService.deleteUser(user).subscribe((response: any) => {
          console.log("response after delete", response);
          this.toastr.error('Account deleted successfully', 'delete');
          window.location.reload();
        });
        this.getUser();
      }
      else {
        this.toastr.info("Looks like you have changed your decision", "update");
      }
    })
  }

  createMultipleUsers(users: any[]) {
    for (let index = 0; index < users.length; index++) {
      let phoneObj: Num[] = [{ number: '', type: '' }];
      phoneObj[0].number = users[index].phonenumber.toString();
      phoneObj[0].type = users[index].type.toString();
      const obj = {
        name: users[index].name,
        email: users[index].email,
        role: users[index].role,
        company: this.userService.userInfo.company,
        phonenumber: phoneObj,
        notes: users[index].notes,
        createdBy: this.userService.userInfo.createdBy,
        attachments: [],
        history: [],
        password: "password@123",
        isAdmin: false
      }
      console.log("obj", obj);
      this.userService.createUser(obj).subscribe({
        next: response => {
          console.log('user created successfully:', response);
          this.toastr.success('User created successfully');
          window.location.reload();
          // do something else, like refresh the user list
        },
        error: err => {
          console.log('error creating user:', err);
          this.toastr.error('Oops! Something went wrong.');
          // handle error - maybe display an error message to user
        }
      });
    }
  }
  openDialogForAdd() {
    if (this.userService.userInfo.isAdmin == false) {
      alert("reqired admin access");
    }
    else {
      const dialogRef = this.dialog.open(AddDialogComponent, {
        width: '800px',
        height: '500px'
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          console.log("res", result);
          const obj = {
            name: result.data.name,
            email: result.data.email,
            company: result.data.company,
            phonenumber: result.data.phonenumber,
            role: result.data.role,
            createdBy: this.userService.userInfo.createdBy,
            notes: result.data.notes,
            gender: result.data.gender,
            history: [],
            attachments: [],
            password: "password@123",
            isAdmin: false
          }
          this.userService.createUser(obj).subscribe({
            next: response => {
              console.log('user created successfully:', response);
              window.location.reload();
              this.toastr.success('User created successfully');
              // do something else, like refresh the user list
            },
            error: err => {
              console.log('error creating user:', err);
              this.toastr.error('Oops! Something went wrong.');
              // handle error - maybe display an error message to user
            }
          });
          this.getUser();
        }
      });
    }

  }

  openDialogForUpdate(user: User) {
    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      width: '800px',
      height: '500px',
      data: user
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == null) {
        // this.toastr.warning("Do some update", "Warning");
      }
      else {
        let updatedUser: User = user;
        updatedUser.company = result.data[0].company;
        updatedUser.email = result.data[0].email;
        updatedUser.name = result.data[0].name;
        updatedUser.phonenumber = result.data[0].phonenumber;
        updatedUser.role = result.data[0].role;
        updatedUser.notes = result.data[0].notes;
        updatedUser.gender = result.data[0].gender;
        console.log("res from updatedialog to card", updatedUser);

        this.userService.updateUser(updatedUser).subscribe(
          (response: any) => {
            console.log('Account updated successfully', response);
          },
          (error: any) => {
            console.log('Error occurred: ', error);
          }
        );
        if (result.data[1] != null) {
          this.userService.upload(result.data[1], user).subscribe({
            next: (data) => {
              this.fileDetails = data;
              this.fileUris.push(this.fileDetails.fileUrl);
              console.log(this.fileDetails); console.log(this.fileUris);
              console.log("File Uploaded Successfully ", data);
              window.location.reload();
            },
            error: (e) => {
              // Handle error using toastr or other methods
              console.log(e);
            }
          });
        }
      }
    }
    );
  }

  openFile(fileUrl: string) {
    window.open(fileUrl, '_blank');
  }
}
