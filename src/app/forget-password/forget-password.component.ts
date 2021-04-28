import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as CryptoJS from "crypto-js";

import { ForgetPassword } from "../modals/forgetpassword/forgetpassmodal";
import { ForgetpasswordService } from "../services/forget-password/forgetpassword.service";

@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.scss"],
})
export class ForgetPasswordComponent implements OnInit {
  request: any;
  response: any;

  login_token: any;
  access: any;
  failed_pass: boolean = false;
  invalid_pass: boolean = false;
  old_pass: boolean = false;
  changed: boolean = false;
  emp_code: any;
  com_code: any;
  emp_id: any;
  old_password: string;
  userID: number;
  companyID: number;
  new_pass1: any;
  new_pass2: any;

  tokenFromUI: string = "SMRTCKT2019_b14ca5898a4e4133bbce";
  noOfAttempt: number = 1;

  constructor(
    private router: Router,
    private _forgetPasswordService: ForgetpasswordService
  ) {}

  ngOnInit() {
    this.emp_code = localStorage.getItem("emp_code");
    this.com_code = localStorage.getItem("com_code");
  }
  checkPass() {
    if (this.new_pass1 !== this.new_pass2) {
      this.invalid_pass = true;
    } else {
      var forgetPasswordService = new ForgetPassword();

      // forgetPasswordService.CompanyId = this.com_code;
      // forgetPasswordService.UserId = this.emp_code;
      // forgetPasswordService.NewPassword = this.new_pass2;

      forgetPasswordService.CompanyId = this.encryptValues(this.com_code);
      forgetPasswordService.UserId = this.encryptValues(this.emp_code);
      forgetPasswordService.NewPassword = this.encryptValues(this.new_pass2);

      this._forgetPasswordService
        .setNewPassword(forgetPasswordService)
        .subscribe((response) => {
          // reponse from the api
          if (response["Success"]) {
            this.changed = true;
            this.router.navigate(["/login"]);
          } else {
            this.failed_pass = true;
          }
        });
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
}
