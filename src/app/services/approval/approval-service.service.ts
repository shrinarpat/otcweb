import { Injectable } from '@angular/core';
import {Observable} from 'rxjs'
import {HttpClient,HttpParams,HttpHeaders} from '@angular/common/http'
import {Approval} from '../../modals/approval/approvalModal'
import * as server from '../../../../config.json'

@Injectable({
  providedIn: 'root'
})
export class ApprovalServiceService {

  constructor(private httpclient:HttpClient) { }
   // Http Options
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    })
  }
  
  getTransactions(userId,comCode):Observable<any> {
   let param1 =new HttpParams().set('userId',userId).set('companyCode',comCode)
   // let param1 =new HttpParams().set('postId','1')
 //  var data = {'argUserID':'ashutosh'}
   return this.httpclient.get(server._url+"Transaction/getPendingTransactions",{params:param1});
 
 }
 
  sendApprovalStatus(approval:Approval):Observable<any>{
    return this.httpclient.post(server._url+"Transaction/approveTransactions",approval);
  } 

 
}
