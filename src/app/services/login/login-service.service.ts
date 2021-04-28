import { Injectable } from '@angular/core';
import {Observable} from 'rxjs'
import {HttpClient,HttpParams,HttpHeaders} from '@angular/common/http'
import {Login} from '../../modals/login/loginmodal'
import * as server from '../../../../config.json'

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private httpclient:HttpClient) { }
 
    // Http Options
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
       
      })
    }

    login(login:Login):Observable<any> {
      return this.httpclient.post(server._url+"Masters/Login",login,this.httpOptions)
    }
}
