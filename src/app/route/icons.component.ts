import { Component, OnInit, ViewChild } from '@angular/core';

import { NgModule } from '@angular/core';

import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import { EMPTY } from 'rxjs';

import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import * as constant from '../bulkupload/Constants';
import {ApprovalServiceService} from '../services/approval/approval-service.service'
import { analytics } from 'googleapis/build/src/apis/analytics';
import {Approval} from '../modals/approval/approvalModal'
import { constants } from 'os';


@Injectable()
export class ConfirmDeactivateGuard3 implements CanDeactivate<IconsComponent> {

  canDeactivate(target: IconsComponent) {
    if (target.checkIfStarted()) {
      return window.confirm('Are you sure?');
    }
    return true;
  }
}

@NgModule({
  providers: [
    ConfirmDeactivateGuard3
  ]
})

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent implements OnInit {


 
 
  emp_id_list: any = []
  name_cust_list: any = []

  image_names: string = null
  date_img: any = null
  user_id:any

  
  response_getTransaction: any
  data_submit_header:any=[]

  request: any
  response: any

  service_name_loc: string
  locations: any
  regions: any
  zones: any

  login_token: any
  access: any

  got_transactions:boolean=false
  full_transactions:boolean=false
  isChecked:boolean=false
  transaction_list: any = []
  data1:string=''
  data2:string=''
  data3:string=''
  data4:string=''
  transaction_id:number;
  dummy_data:any=[]
  userCode:string
  company_code:string
  remarks:string
  approvalData:any=[]
  selected_trans:any=[]
  permission:string
  permission_flag:boolean =false
  showbranch:boolean = true
  companyID:string
  show_remark_alert:boolean = false


  constructor(private router: Router, private _appprovalService:ApprovalServiceService) { }


  ngOnInit() {


    this.login_token = localStorage.getItem('CMSAppUserLogin');
    if (this.login_token) {
      this.access = JSON.parse(this.login_token);
      this.userCode =this.access.Entity.EmployeeCode
      this.company_code =this.access.Entity.CompanyCode
      this.user_id = this.access.Entity.UserID
       this.permission = this.access['Entity']['transaction_approval_master']
      if(this.permission !='Read') {
        this.permission_flag =true
      }
    }
    else {
      this.router.navigateByUrl('/', { skipLocationChange: false }).then(() =>
        this.router.navigate(["/login"]));
    }
    this.got_transactions =true
    
   this.getTransactions();

  }

  Dateformattter(unformatted_date:string){
      //return unformatted_date.replace("T","  ").split(/[\.]/)[0].slice(0,-3);
      return unformatted_date.replace("T","  ").split(' ')[0];
  }

  getTransactions(){
    this._appprovalService.getTransactions(this.user_id,this.company_code).subscribe(
      data=>{
        this.response_getTransaction=data["Entity"]
      }
    )

  }


  approveTransactions(i){
    console.log("Transaction")
    console.log(i);
    if(this.permission_flag){
      this.got_transactions =false
      this.full_transactions =true
      this.data1 =i.Type.toUpperCase();
      this.data2=i.CompanyName
      this.data3 =this.Dateformattter(i.CreatedDate)
      this.data4 = i.UserName+" ("+i.CreatedBy+")"
      this.selected_trans = i
      this.approvalData = []

      switch(this.data1){
        case 'DAILYACTIVITY':
          this.data_submit_header = constant.daily_activity_col_apr
          console.log("data",i.Value)
          for(let v  of i.Value){
            v["ActivityName"] = v["TransType"]
            v["ATMCode"] = v["ATMID"]
            v['ActivityDate'] =v['TransDate']
        }
        this.approvalData = i.Value;
       
          break;
        case 'ATM':
          this.data_submit_header = constant.atm_master_col_apr;
          this.approvalData = i.Value;
          break;
        case 'BRANCH':
          this.data_submit_header = constant.branch_master_col;
          this.approvalData = i.Value;
          break;
        case 'EMP':
          this.data_submit_header = constant.emp_master_col_apr;
          this.approvalData = i.Value;
          break;
        case 'ATMEMP':
          this.data_submit_header = constant.atm_emp_col_apr;
          for(let v  of i.Value){
              v["AtmCode"] = v["atmId"]
          }
          this.approvalData = i.Value;
          break;
        default:
          break;
      }
    }
   }

  formattingFunc(data,col_name){
      // console.log(data)
      if(col_name === "Trans Date"){
          let new_date = data.split(" ")
          if(new_date[0].toUpperCase() in constant.date_month){
              return new_date[2]+'-'+constant.date_month[new_date[0].toUpperCase()]+'-'+new_date[1]
          }
          else{
            return this.Dateformattter(data)
          }
      }
      else if(col_name === "From Date"){
        return this.Dateformattter(data)
      }
      else{
        return data
      }
  }

  submitApproval(decision_string){
    
    //this.response_getTransaction = this.response_getTransaction.filter(item => item !== this.selected_trans)
    this.show_remark_alert = false
    var flag1 = (decision_string==="reject") && !this.nullCheck(this.remarks)
    var flag2 = decision_string=='approve'
    if(flag1 || flag2)
    {
        var approve = new Approval();
        approve.UserID = Number(this.user_id)
        approve.ID = Number(this.selected_trans.ID)
        if(decision_string==='approve'){
            approve.IsApproved = true
        }
        else{
            approve.Remarks = this.remarks
            approve.IsApproved = false
        }
        this.getTransactions();

        this._appprovalService.sendApprovalStatus(approve).subscribe(
          resp=>{
            console.log("Approve json")
            console.log(resp);
            if(resp['Success'] && resp.Message==='Data Added Successfully'){
              this.full_transactions =false
              this.got_transactions =true
              window.alert("Status updated successfully")
               window.location.reload()
            }
            else if( resp['Success'] && resp.Message==='Data Already Exists') {
              window.alert("Data is duplicate entry")

            }
            else{
              window.alert("Failed to approve ")
            }
          }
        )
    }
    else{
      this.show_remark_alert = true
      window.alert("Please fill the mandatory fields and submit again") 
    }

  }

  back_screen(){
    this.full_transactions = false;
    this.got_transactions = true;
    this.show_remark_alert = false
  }
  
  checkIfStarted() {
    if (0) {
      return true
    }
    else {
      return false
    }
  }

  nullCheck(data){
    if(data === undefined || data === "" || data === null){
      return true
    }
    else{
      return false
    }
  }

}
