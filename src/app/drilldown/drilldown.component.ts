import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare const $: any;

import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-drilldown',
  templateUrl: './drilldown.component.html',
  styleUrls: ['./drilldown.component.scss']
})
export class DrilldownComponent implements OnInit {

 

  request2: any
  response2: any
  chk_data: any
  chk_resp: any
  chk_cash: any
  chk_img: any

  request_img: any
  response_img: any

  got_drilldown: boolean = false
  got_checklist: boolean = false
  checklist_mode: boolean = false

  login_token: any
  userName:string
  access: any
  p: number = 1
  failure_message: string

  identifier_title: string
  identifier_value: string


  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {

    

    this.login_token = localStorage.getItem('CMSAppUserLogin');

    if (this.login_token) {
      this.access = JSON.parse(this.login_token);
      this.userName =this.access.Entity.UserName
     
    }
    else {
      this.router.navigateByUrl('/', { skipLocationChange: false }).then(() =>
        this.router.navigate(["/login"]));
    }

   

  }

  

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  scrollTop() {
    var pageTop = document.querySelector('#pagetop');
    pageTop.scrollIntoView();
  }

}
