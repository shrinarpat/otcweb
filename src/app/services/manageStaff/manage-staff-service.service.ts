import { Injectable } from '@angular/core';
import {Observable} from 'rxjs'
import {HttpClient,HttpParams,HttpHeaders} from '@angular/common/http'
import * as server from '../../../../config.json'

@Injectable({
  providedIn: 'root'
})
export class ManageStaffServiceService {

  constructor(private httpclient:HttpClient) { }
  
  // _url ="http://cmsliveuat.cms.com/CustOTCWebApp/api/";

  // Http Options
  httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json'
   })
 }
 
 getRoles(userId):Observable<any> {

  
  
  let param1 =new HttpParams().set('userId',userId)
 

  return this.httpclient.get(server._url+"UserStaff/getPredefinedRoles",{params:param1})

}

getAllUserStaff(userId,comCode):Observable<any> {
  
  let param1 =new HttpParams().set('userId',userId).set('companyCode',comCode)
  // let param1 =new HttpParams().set('postId','1')
//  var data = {'argUserID':'ashutosh'}

  return this.httpclient.get(server._url+"ManageActivity/getActivityTypes",{params:param1})

}


 

 editUserStaff(atmEmpMap):Observable<any>{

   return this.httpclient.post(server._url+"Atm/editAtmDetails",atmEmpMap)

 }

createUserStaff(dailyActivty):Observable<any> {
   console.log("inside add atm")
   return this.httpclient.post(server._url+"Atm/addAtmDetails",dailyActivty)
 }

}
