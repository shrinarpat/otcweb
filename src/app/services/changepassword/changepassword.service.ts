import { Injectable } from '@angular/core';
import {Observable} from 'rxjs'
import {HttpClient,HttpParams,HttpHeaders} from '@angular/common/http'
import {ChangePassword} from '../../modals/changepassword/changepassword'
import * as server from '../../../../config.json'

@Injectable({
  providedIn: 'root'
})
export class ChangepasswordService {

  constructor(private httpclient:HttpClient) { }
 
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
     
    })
  }

  changepassword(changepassword:ChangePassword):Observable<any> {
    return this.httpclient.post(server._url+"Masters/changeUserPassword",changepassword,this.httpOptions)
  }
}
