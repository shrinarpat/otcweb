import { Injectable } from '@angular/core';
import {Observable} from 'rxjs'
import {HttpClient,HttpParams,HttpHeaders} from '@angular/common/http'
import {AtmEmpMapping} from '../../modals/atm-emp-mapping/atmEmpModal'
import * as server from '../../../../config.json'

@Injectable({
  providedIn: 'root'
})
export class AtmEmployeeMappingServiceService {

  constructor(private httpclient:HttpClient) { }
  // _url ="https://cmslive.cms.com/AlgoWebAPI/api/";
  // // _url ="http://cmsliveuat.cms.com/CustOTCWebApp/api/";

  // Http Options
  httpOptions = {
   headers: new HttpHeaders({
     'Content-Type': 'application/json'
   })
 }
 
 getatmEmpMapping(userId):Observable<any> {
 

     let param1 =new HttpParams().set('userId',userId)
  
   
   return this.httpclient.get(server._url+"Masters/getAtmEmployeeMapping",{params:param1})

 }

 editatmEmpMapping(atmEmpMap):Observable<any>{

   return this.httpclient.post(server._url+"Atm/editAtmDetails",atmEmpMap)

 }

 addatmEmpMapping(atmEmpMap:AtmEmpMapping):Observable<any> {
   return this.httpclient.post(server._url+"Masters/AddAtmEmployeeMapping",atmEmpMap)
 }

}
