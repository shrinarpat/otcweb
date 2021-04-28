import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as CryptoJS from "crypto-js";
import { retry } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/catch";
import { EMPTY } from "rxjs";
import { ChangepasswordService } from "../services/changepassword/changepassword.service";

declare const $: any;

@Component({
  selector: "app-password",
  templateUrl: "./password.component.html",
  styleUrls: ["./password.component.scss"],
})
export class PasswordComponent implements OnInit {
  request: any;
  response: any;

  login_token: any;
  access: any;

  invalid_user: boolean = false;
  old_pass: boolean = false;
  changed: boolean = false;

  emp_id: any;
  old_password: string;
  userID: number;
  companyID: number;
  new_pass1: any;
  new_pass2: any;

  tokenFromUI: string = "SMRTCKT2019_b14ca5898a4e4133bbce";

  constructor(
    private router: Router,
    private _changePasswordService: ChangepasswordService
  ) {}

  ngOnInit() {
    this.login_token = localStorage.getItem("CMSAppUserLogin");

    if (this.login_token) {
      this.access = JSON.parse(this.login_token);
      this.access["password"] = true;
      this.userID = this.access.Entity.UserID;
      this.companyID = this.access.Entity.CompanyID;
    } else {
      this.router
        .navigateByUrl("/", { skipLocationChange: false })
        .then(() => this.router.navigate(["/login"]));
    }
  }

  resetPass() {
    this.invalid_user = false;
    this.old_pass = false;
    this.changed = false;

    if (this.new_pass1 == this.old_password) {
      this.old_pass = true;
      // this.new_pass1 = btoa(this.new_pass1)
      // this.new_pass2 = btoa(this.new_pass2)
    } else if (this.new_pass1 === this.new_pass2) {
      //   NewPassword: this.encryptValues(this.new_pass1),

      // ** only newpassword is encrypted
      this.request = {
        UserId: this.userID,
        CompanyId: this.companyID,
        NewPassword: this.encryptValues(this.new_pass1),
      };
      this._changePasswordService
        .changepassword(this.request)
        .subscribe((data) => {
          this.response = data;
          this.serviceCalled();
        });
    } else {
      alert("Passwords do not match.");
      this.new_pass1 = null;
      this.new_pass2 = null;
    }
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
    if (this.response["Success"]) {
      this.changed = true;
    } else {
      window.alert("Failed to change the password");
    }
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
