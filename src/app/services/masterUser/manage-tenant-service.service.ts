import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, filter, catchError } from "rxjs/operators";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { NewCustomer } from "../../modals/customer/customermodal";
import * as server from "../../../../config.json";

@Injectable({
  providedIn: "root",
})
export class ManageTenantServiceService {
  constructor(private httpclient: HttpClient) {}

  // _url ="http://cmsliveuat.cms.com/CustOTCWebApp/api/";

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  getAssignedCustomers(userId): Observable<any> {
    let param1 = new HttpParams().set("arguserid", userId);

    return this.httpclient.get(server._url + "Masters/GetAssignedCustomers", {
      params: param1,
    });
  }

  getCmsExecutives(userId, comCode): Observable<any> {
    let param1 = new HttpParams().set("arguserid", "1");
    return this.httpclient.get(server._url + "Masters/getCmsExecutives", {
      params: param1,
    });
  }

  getCustomerDetails(companyID): Observable<any> {
    let param1 = new HttpParams().set("companyId", companyID);

    return this.httpclient.get(server._url + "Masters/getCustomerDetails", {
      params: param1,
    });
  }

  editCustomer(teantEdit: NewCustomer): Observable<any> {
    return this.httpclient.post(
      server._url + "Masters/editCustomer",
      teantEdit
    );
  }

  addCustomer(newCust: NewCustomer): Observable<any> {
    console.log("inside add atm");
    return this.httpclient.post(server._url + "Masters/addCustomer", newCust);
  }

  //common API for change password
  changeUserPassword(dailyActivty: NewCustomer): Observable<any> {
    console.log("inside add atm");
    return this.httpclient.post(
      server._url + "Atm/addAtmDetails",
      dailyActivty
    );
  }
}
