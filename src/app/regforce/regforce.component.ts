import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TouchSequence } from 'selenium-webdriver';

import { retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import { EMPTY } from 'rxjs';

declare var $: any;
@Component({
  selector: 'app-regforce',
  templateUrl: './regforce.component.html',
  styleUrls: ['./regforce.component.scss']
})
export class RegforceComponent implements OnInit {

  server_json: any
  server_name: string
  service_name: string
  service_name_register: string
  service_name_demographic: string
  service_name_user: string

  request_register: any
  response_register: any

  request2: any
  response2: any

  request3: any
  response3: any

  username: string = null
  emp_id: string = null
  comp_code: string = null

  name: string = null
  title: string = null
  zone: string = null
  region: string = null
  location: string = null
  role_id: number = null

  zones: any
  regions: any
  locations: any

  pass1: string = null
  pass2: string = null

  invalid_emp: boolean = false
  invalid_reg: boolean = false
  invalid_msg: string
  already_reg: boolean = false

  password_mode: any
  login_token: any
  access: any

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {

    this.server_json = require('./../../../config.json');
    this.server_name = this.server_json['server'];
    this.service_name_register = this.server_name.concat('/register')
    this.service_name_demographic = this.server_name.concat('/demographic')
    this.service_name_user = this.server_name.concat('/user')

    this.login_token = localStorage.getItem('CMSAppUserLogin');
    if (this.login_token) {
      this.access = JSON.parse(this.login_token);
    }
    else {
      this.router.navigateByUrl('/', { skipLocationChange: false }).then(() =>
        this.router.navigate(["/login"]));
    }
    if (this.access['type'] == "admin") {
    }
    else {
      alert("Please login as admin for this functionality.")
      this.router.navigateByUrl('/', { skipLocationChange: false }).then(() =>
        this.router.navigate(["/login"]));
    }


  }

  getDemographicFilter(zone_name: any, region_name: any, location_name: any) {

    this.zone = zone_name
    this.region = region_name
    this.location = location_name
    this.request3 = { 'zone': this.zone, 'region': this.region }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY'
      })
    };
    this.http.post(this.service_name_demographic, this.request3, httpOptions)
      .catch(error => {
        alert("Could not connect to the server. Retry after some time.")
        return EMPTY
      })
      .subscribe(data => {
        this.response3 = data
        if (this.response3['status'] && this.response3['status'] == "Success") {
          this.zones = this.response3['zones']
          this.regions = this.response3['regions']
          this.locations = this.response3['locations']
        }
      });
  }

  sendEmpID() {

    this.already_reg = false
    if (this.emp_id && this.comp_code) {

      this.request2 = { 'emp_id': this.emp_id, 'comp_code': this.comp_code }

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Frame-Options': 'DENY'
        })
      };

      this.http.post(this.service_name_user, this.request2, httpOptions)
        .catch(error => {
          alert("Could not connect to the server. Retry after some time.")
          return EMPTY
        })
        .subscribe(data => {
          this.response2 = data
          if (this.response2['status'] && this.response2['status'] == "Exists") {
            this.already_reg = true
          }
          else {
            this.username = this.emp_id
            this.invalid_emp = false
            this.password_mode = true
          }
        });

    }
    else {
      this.invalid_emp = true
    }
  }

  passwordSend() {

    this.service_name_register = this.server_name.concat('/register')

    this.pass1 = btoa(this.pass1)
    this.pass2 = btoa(this.pass2)

    if (this.emp_id && this.comp_code && this.name && this.title && this.username && this.pass1 && this.pass2 && this.role_id) {
      this.request_register = {
        "emp_id": this.emp_id,
        "comp_code": this.comp_code,
        "name": this.name,
        "title": this.title,
        "username": this.username,
        "password": this.pass2,
        "zone": this.zone,
        "region": this.region,
        "location": this.location,
        "role_id": this.role_id
      }
      if (this.pass1 === this.pass2) {
        this.registerUser()
      }
      else {
        this.invalid_msg = "Passwords do not match."
        this.invalid_reg = true
      }

    }
    else {
      this.invalid_msg = "Please enter all the applicable fields."
      this.invalid_reg = true
    }

  }
  registerUser() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Frame-Options': 'DENY'
      })
    };

    this.http.post(this.service_name_register, this.request_register, httpOptions)
      .catch(error => {
        alert("Could not connect to the server. Retry after some time.")
        return EMPTY
      })
      .subscribe(data => {
        this.response_register = data
        if (this.response_register['status'] && this.response_register['status'] == "Success") {
          this.password_mode = false
          this.router.navigateByUrl('/login')
          alert("The user has been registered successfully.")
        }
        else {
          this.invalid_msg = "Unable to register the user in the database."
          this.invalid_reg = true
        }
      });
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

}
