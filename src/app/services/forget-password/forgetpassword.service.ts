import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { ForgetPassword } from "../../modals/forgetpassword/forgetpassmodal";
import * as server from "../../../../config.json";

@Injectable({
  providedIn: "root",
})
export class ForgetpasswordService {
  constructor(private httpclient: HttpClient) {}
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };

  setNewPassword(data: ForgetPassword): Observable<any> {
    console.log("setNewPassword: ", data);

    return this.httpclient.post(server._url + "Masters/createOtp", data);
  }
}
