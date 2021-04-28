import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as CryptoJS from "crypto-js";
import { ForgetPassword } from "../modals/forgetpassword/forgetpassmodal";
import { ForgetpasswordService } from "../services/forget-password/forgetpassword.service";

@Component({
  selector: "app-forget-password-details",
  templateUrl: "./forget-password-details.component.html",
  styleUrls: ["./forget-password-details.component.scss"],
})
export class ForgetPasswordDetailsComponent implements OnInit {
  request: any;
  response: any;

  invalid_user: boolean = false;

  emp_id: any;
  company_code: any;
  emp_code: any;

  tokenFromUI: string = "SMRTCKT2019_b14ca5898a4e4133bbce";

  constructor(
    private router: Router,
    private _forgetPasswordService: ForgetpasswordService
  ) {}

  ngOnInit() {}
  sendDetails() {
    console.log(this.company_code);
    console.log(this.emp_code);
    var forgetPasswordService = new ForgetPassword();

    forgetPasswordService.NoOfAttempts = 0;
    forgetPasswordService.OTPGenerated = 0;

    // forgetPasswordService.CompanyId = this.company_code;
    // forgetPasswordService.UserId = this.emp_code;

    forgetPasswordService.CompanyId = this.encryptValues(this.company_code);
    forgetPasswordService.UserId = this.encryptValues(this.emp_code);

    this._forgetPasswordService
      .setNewPassword(forgetPasswordService)
      .subscribe((response) => {
        // reponse from the api
        if (response["Success"]) {
          localStorage.setItem("emp_code", this.emp_code);
          localStorage.setItem("com_code", this.company_code);
          this.router.navigate(["/otp"]);
        } else {
          window.alert("Please check your employee code or companycode");
        }
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
}
