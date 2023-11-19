import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User, FileDetails } from 'src/shared/model/user';
import { OrgService } from '../org/org.service';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class UserService implements OnInit {
  userInfo: User;
  constructor(private http: HttpClient, private orgService: OrgService,private toastr: ToastrService) {
    this.userInfo = JSON.parse(localStorage.getItem('user'));
  }
  ngOnInit(): void {
    throw new Error('Method not implemented');
  }
  upload(file: File, user: User): Observable<FileDetails> {
    const baseUrl = "http://localhost:8080/api/user";
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('userInfo', user._id);
    return this.http.post<FileDetails>(`${baseUrl}/attachment`, formData).pipe(
      tap(() => {
        // Display a success message using toastr
        this.toastr.success('File uploaded successfully', 'Success');
      }),
      catchError((error) => {
        // Display an error message using toastr
        this.toastr.error('Failed to upload file', 'Error');
        console.error(error);
        return of(null);
      })
    );
  }
  validateUser(obj: any): Observable<User> {
    const apiUrl = `http://localhost:8080/api/user/login`;
    return this.http.post<User>(apiUrl, obj).pipe(
      tap(response => {
        console.log('Account login successful', response);
        this.toastr.success('Account login successful');
      }),
      catchError(error => {
        console.log('Error occurred: ', error);
        this.toastr.error('Invalid User details');
        return throwError(error);
      })
    );
  }
  getAllUser(): Observable<User[]> {
    const userId = this.userInfo.createdBy;
    const apiUrl = `http://localhost:8080/api/user/${userId}`;
  
    return this.http.get<User[]>(apiUrl).pipe(
      catchError(err => {
        console.error(err);
        return throwError('An error occurred while fetching user data. Please try again later.');
      })
    );
  }
  createUser(data: any): Observable<User> {
    let saveObj: User = data;
    const apiUrl = `http://localhost:8080/api/user/`;
    return this.http.post<User>(apiUrl, saveObj).pipe(
      tap(response => {
        console.log('Account created successfully', response);
        this.toastr.success('Account created successfully','Login');
      }),
      catchError(error => {
        console.log('Error occurred: ', error);
        this.toastr.error('Oops! Something went wrong.');
        return throwError(error);
      })
    );
  }
  deleteUser(data: User): Observable<User> {
    const apiUrl = `http://localhost:8080/api/user/`;
    const options = {
      body: data
    };
    return this.http.delete<User>(apiUrl, options).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        this.toastr.error('Oops! Something went wrong.');
        return throwError(error);
      })
    );
  }
  updateUser(data: User): Observable<User> {
    const apiUrl = `http://localhost:8080/api/user/`;
    console.log(data, "data from service to backend");
    return this.http.put<User>(apiUrl, data).pipe(
      tap(response => {
        console.log('Account updated successfully', response);
        this.toastr.success('Account updated successfully');
      }),
      catchError(error => {
        console.log('Error occurred: ', error);
        this.toastr.error('Oops! Something went wrong.');
        return throwError(error);
      })
    );
  }
  // categorizedData(query: any): Observable<User[]> {
  //   const apiUrl = `http://localhost:8080/api/user/category/${query}`;
  //   return this.http.post<User[]>(apiUrl, this.userInfo).pipe(
  //     catchError(err => {
  //       console.error(err);
  //       return throwError('An error occurred while fetching user data. Please try again later.');
  //     })
  //   );
  // }
  searchFilterData(role: String, query: String, type: String): Observable<User[]> {
    if(role=="")  role="tmp";
    if(query=="")  query="tmp";
    if(type=="")  type="tmp";
    const apiUrl = `http://localhost:8080/api/user/category/${role}/search/${query}/filter/${type}`;
    return this.http.post<User[]>(apiUrl, this.userInfo).pipe(
      catchError(err => {
        console.error(err);
        return throwError('An error occurred while fetching user data. Please try again later.');
      })
    );
  }
}
