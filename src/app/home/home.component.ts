import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';

import { retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import { EMPTY } from 'rxjs';
import { strict } from 'assert';

import * as jspdf from 'jspdf';
import * as _html2canvas from "html2canvas";
import { BsDatepickerDirective, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { parseDate } from 'ngx-bootstrap/chronos/public_api';
import { AnyMxRecord } from 'dns';

declare const $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  
})
export class HomeComponent implements OnInit {

  server_json: any
  server_name: string
  service_name: string
  service_name1:string

  request: any
  response: any

  request1: any
  response1: any

  login_token: any
  access: any

  got_history: boolean = false

  got_report: boolean = false

  type_role:any=[]
  role:string
  emp_id_list:any=[]
  name_cust_list:any=[]
  flagroletype:boolean=false
  emp_id:string
  name_cust:string

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {

    this.server_json = require('./../../../config.json');
    this.server_name = this.server_json['server'];
    this.service_name = this.server_name.concat('/home')
    this.service_name1 =this.server_name.concat('/supervisor-home')



    this.login_token = localStorage.getItem('CMSAppUserLogin');
    console.log(this.login_token);
    
    if (this.login_token) {
      this.access = JSON.parse(this.login_token);
      this.access['history'] = true
    }
    else {
      this.router.navigateByUrl('/', { skipLocationChange: false }).then(() =>
        this.router.navigate(["/login"]));
    }
    this.getCustodianData()

  
      
  }

  getCustodianData(){
    this.emp_id_list=['9612340','9612341','9612342','9612343','9612344','9612345','9612346','9612347','9612348','9612349','9612350',]

    this.name_cust_list=['Ashu','Ashu1','Ashu2','Ashu3','Ashu4','Ashu5','Ashu6','Ashu7','Ashu8','Ashu9','Ashu10',]

  }
  
  getRoleType(){
        this.type_role=['Admin','Branch Manager','ATM Manager','Cms manager']
    
  }
  getRoleflag(){
   
  this.flagroletype=true

}

  saveNewRole(){
    window.alert(" Data Added Sucessfully")
    window.location.reload()

  }
 
 

  isMobileLogin() {
    if (this.isMobileMenu()) {
      return true
    }
    else {
      return false
    }
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

}