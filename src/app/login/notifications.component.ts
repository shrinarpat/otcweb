import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TouchSequence } from "selenium-webdriver";
import * as CryptoJS from "crypto-js";

import { retry } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/catch";
import { EMPTY } from "rxjs";
import { LoginServiceService } from "../services/login/login-service.service";
import { Login } from "../modals/login/loginmodal";

declare var $: any;

@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"],
})
export class NotificationsComponent implements OnInit {
  server_json: any;
  server_name: string;
  service_name: string;

  request: any;
  response: any;

  username: string = null;
  password: string = null;
  cmcode: string = null;

  invalid_user: boolean = false;

  //flag to handle first time loggedin user
  firstTimeLogin: boolean = false;

  logged_out: boolean = true;
  login_token: any;

  tokenFromUI: string = "SMRTCKT2019_b14ca5898a4e4133bbce";
  //tokenFromUI: string = "0123456789123456";

  constructor(
    private router: Router,
    private _loginService: LoginServiceService
  ) {}

  ngOnInit() {
    // console.log("userid: ", this.decryptValues("gNQK/XH0oYES6vE9VMcY3Q=="));
    // console.log("username: ", this.decryptValues("BS/2CZJ+nLp7EI3ibd9Awg=="));
    // console.log(
    //   "employeecode: ",
    //   this.decryptValues("mxG1aQufaMxLtj+XIzt+jA==")
    // );
    // console.log("companyID: ", this.decryptValues("dBc5lkGkGar+uaosdQDCiA=="));
    // console.log("CompanyCode: ");
    // console.log(this.decryptValues("Udp1L1q+M5VULEgxNJv76w=="));
    // //console.log("mobileno: ");
    // // console.log(this.decryptValues("null"));
    // console.log("isactive: ", this.decryptValues("KlvkQWNTP+UCfl4oUYPbRw=="));
    // console.log("roleid: ", this.decryptValues("dBc5lkGkGar+uaosdQDCiA=="));
    // console.log("rolename: ", this.decryptValues("J5nLvMY7MyH7SKa+8lHrxA=="));
    // console.log(
    //   "branchmaster: ",
    //   this.decryptValues("JJlRZzOVUFtLajrkGvJjJg==")
    // );
    // console.log("atmmaster: ", this.decryptValues("JJlRZzOVUFtLajrkGvJjJg=="));
    // console.log(
    //   "field_emp_master: ",
    //   this.decryptValues("JJlRZzOVUFtLajrkGvJjJg==")
    // );
    // console.log(
    //   "atm_emp_mapping: ",
    //   this.decryptValues("JJlRZzOVUFtLajrkGvJjJg==")
    // );
    // console.log(
    //   "company_master: ",
    //   this.decryptValues("JJlRZzOVUFtLajrkGvJjJg==")
    // );
    // console.log(
    //   "transaction_approval_master: ",
    //   this.decryptValues("JJlRZzOVUFtLajrkGvJjJg==")
    // );
    // console.log(
    //   "daily_activity_master: ",
    //   this.decryptValues("JJlRZzOVUFtLajrkGvJjJg==")
    // );
    // console.log(
    //   "bulk_upload: ",
    //   this.decryptValues("JJlRZzOVUFtLajrkGvJjJg==")
    // );

    this.login_token = localStorage.getItem("CMSAppUserLogin");
    if (this.login_token) {
      this.logged_out = false;
    } else {
      this.logged_out = true;
    }
  }

  logoutButton() {
    location.href = "./";
    localStorage.clear();
    this.logged_out = true;
  }

  loginButton() {
    //service api call

    var login = new Login();

    // login.CompanyCode = this.cmcode;
    // login.LoginID = this.username;
    // login.UserPassword = this.password;

    login.CompanyCode = this.encryptValues(this.cmcode);
    login.LoginID = this.encryptValues(this.username);
    login.UserPassword = this.encryptValues(this.password);
    //console.log("userpassword: ", login.UserPassword);

    this._loginService.login(login).subscribe((data) => {
      this.response = data;
      console.log("==", this.response["Entity"]);

      let obj = this.response["Entity"];
      Object.keys(this.response["Entity"]).forEach((key) => {
        console.log(key);
        if (obj[key] === null) {
          obj[key] = "";
        } else {
          //obj[key] = "123";
          obj[key] = this.decryptValues(obj[key]);
        }
      });
      console.log("check this");
      console.log(this.response);
      this.serviceCalled();
    });
  }

  encryptValues(val) {
    let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let encrypted = CryptoJS.AES.encrypt(JSON.stringify(val), _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }

  decryptValues(val) {
    //console.log(val);
    let _key = CryptoJS.enc.Utf8.parse(this.tokenFromUI);
    let _iv = CryptoJS.enc.Utf8.parse(this.tokenFromUI);

    let decrypted = CryptoJS.AES.decrypt(val, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }).toString(CryptoJS.enc.Utf8);

    return decrypted;
  }

  serviceCalled() {
    console.log("insde service called" + this.response.Entity);
    if (this.response["Success"]) {
      this.invalid_user = false;
      this.response["date_time"] = this.currentDateTime();
      var access_json = JSON.stringify(this.response);
      console.log(access_json);
      localStorage.setItem("CMSAppUserLogin", access_json);
      if (this.firstTimeLogin) {
        console.log("inside first timr");
        this.router.navigateByUrl("/password");
      } else {
        location.href = "./";
      }
    } else {
      this.invalid_user = true;
    }
  }

  registerButton() {
    this.router.navigateByUrl("/register");
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  currentDateTime() {
    var now = new Date();
    var year = "" + now.getFullYear();
    var month = "" + (now.getMonth() + 1);
    if (month.length == 1) {
      month = "0" + month;
    }
    var day = "" + now.getDate();
    if (day.length == 1) {
      day = "0" + day;
    }
    var hour = "" + now.getHours();
    if (hour.length == 1) {
      hour = "0" + hour;
    }
    var minute = "" + now.getMinutes();
    if (minute.length == 1) {
      minute = "0" + minute;
    }
    var second = "" + now.getSeconds();
    if (second.length == 1) {
      second = "0" + second;
    }
    return (
      year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
    );
  }

  contactAdmin() {
    // alert('Please contact the Administrator for a new default password.')
    this.router.navigate(["/forgetpassworddetails"]);
  }
}
