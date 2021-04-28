import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { EmployeeEdit, EmployeeAdd } from "../../modals/employee/employeemodal";
import * as server from "../../../../config.json";

@Injectable({
  providedIn: "root",
})
export class ManageEmployeeServiceService {
  constructor(private httpclient: HttpClient) {}

  // _url ="http://cmsliveuat.cms.com/CustOTCWebApp/api/";

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  getEmployee(userId): Observable<any> {
    let param1 = new HttpParams().set("userId", userId);
    return this.httpclient.get(server._url + "Masters/getListOfEmployees", {
      params: param1,
    });
  }

  editEmployee(employee: EmployeeEdit): Observable<any> {
    return this.httpclient.post(
      server._url + "Masters/EditEmployees",
      employee
    );
  }

  addEmployee(employee: EmployeeAdd): Observable<any> {
    return this.httpclient.post(server._url + "Masters/AddEmployees", employee);
  }
}
