import { Injectable } from '@angular/core';
import {Observable} from 'rxjs'
import {HttpClient,HttpParams,HttpHeaders} from '@angular/common/http'
import {Branch} from '../../modals/branch/branchmodal'
import * as server from '../../../../config.json'


@Injectable({
  providedIn: 'root'
})
export class BranchServiceService {

  

  constructor(private httpclient:HttpClient) { }

  // _url ="http://cmsliveuat.cms.com/CustOTCWebApp/api/Masters";

 

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  
  getbranch(userId):Observable<any> {
     let param1 =new HttpParams().set('argUserID',userId)

    return this.httpclient.get(server._url+"Masters/getListOfBranches",{params:param1})

  }

  editbranch(branch:Branch):Observable<any>{

    return this.httpclient.post(server._url+"Masters/EditBranch",branch)

  }

  addbranch(branch:Branch):Observable<any> {
    console.log("inside add bracnh")
    return this.httpclient.post(server._url+"Masters/AddBranch",branch)
  }
}
