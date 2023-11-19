import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit ,ElementRef} from '@angular/core';
import { Observable } from 'rxjs';
import { Org } from 'src/shared/model/org';
import * as XLSX from 'xlsx';

const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class OrgService implements OnInit {

  constructor(private http: HttpClient) {
  }
  orgInfo : Org[];
  ngOnInit(): void {
    throw new Error('Method not implemented');
  }
  getOrg(): Observable<Org[]>{
    const apiUrl = `http://localhost:8080/api/org/getall`;
    return this.http.get<Org[]>(apiUrl);
  }
  validateOrg(obj : any) : Observable<Org>{
    console.log("Org",obj);
    const apiUrl = `http://localhost:8080/api/Org/login`;
    return this.http.post<Org>(apiUrl,obj);
  }
  registerOrg(obj : any) : Observable<Org>{
    console.log("register Org",obj);
    const apiUrl = `http://localhost:8080/api/Org/register`;
    return this.http.post<Org>(apiUrl,obj);
  }
  public exportTableElmToExcel(element: ElementRef, fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element.nativeElement);
    // generate workbook and add the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    // save to file
    XLSX.writeFile(workbook, `${fileName}${EXCEL_EXTENSION}`);

  }
}
