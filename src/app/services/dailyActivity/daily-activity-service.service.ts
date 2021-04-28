import { Injectable } from '@angular/core';
import {Observable} from 'rxjs'
import {HttpClient,HttpParams,HttpHeaders} from '@angular/common/http'
import {DailyActivityModal} from '../../modals/daily-activity/dailyActivityModal'
import * as server from '../../../../config.json'
@Injectable({
  providedIn: 'root'
})
export class DailyActivityServiceService {

  constructor(private httpclient:HttpClient) { }
  // _url ="http://cmsliveuat.cms.com/CustOTCWebApp/api/";

  // Http Options
  httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json'
   })
 }
 
 getdailyActivityType(userId):Observable<any> {

  
  let param1 =new HttpParams().set('userId',userId)
 

  return this.httpclient.get(server._url+"ManageActivity/getActivityTypes",{params:param1})

}


 getdailyActivities(userId):Observable<any> {
   
   let param1 =new HttpParams().set('userId',userId)

   return this.httpclient.get(server._url+"ManageActivity/getDailyActivity",{params:param1})

 }



 adddailyActivity(dailyActivty:DailyActivityModal):Observable<any> {
   return this.httpclient.post(server._url+"ManageActivity/addDailyActivity",dailyActivty)
 }

}
