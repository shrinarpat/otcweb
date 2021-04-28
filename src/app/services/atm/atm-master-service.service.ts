import { Injectable } from '@angular/core';
import {Observable} from 'rxjs'
import {HttpClient,HttpParams,HttpHeaders} from '@angular/common/http'
import {AtmMaster} from '../../modals/Atm/atmmastermodal'
import * as server from '../../../../config.json'

@Injectable({
  providedIn: 'root'
})
export class AtmMasterServiceService {


  constructor(private httpclient:HttpClient) { }
  // https://cmslive.cms.com/AlgoWebAPI
  _url ="https://cmslive.cms.com/AlgoWebAPI/api/";
  // _url ="http://cmsliveuat.cms.com/CustOTCWebApp/api/";

   // Http Options
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  
  getatm(userId):Observable<any> {
    console.log("inside get branch")
    console.log(this._url)
    
     let param1 =new HttpParams().set('userId',userId)
    // let param12 =new HttpParams()
  //  var data = {'argUserID':'ashutosh'}

    return this.httpclient.get(server._url+"Atm/getListOfATM",{params:param1})

  }

  editatm(atm):Observable<any>{

    return this.httpclient.post(server._url+"Atm/editAtmDetails",atm)

  }

  addatm(atm:AtmMaster):Observable<any> {
    console.log("inside add atm")
    return this.httpclient.post(server._url+"Atm/addAtmDetails",atm)
  }
}
