import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as CryptoJS from "crypto-js";
import { ForgetPassword } from "../modals/forgetpassword/forgetpassmodal";
import { ForgetpasswordService } from "../services/forget-password/forgetpassword.service";

@Component({
  selector: "app-otp",
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.scss"],
})
export class OtpComponent implements OnInit {
  otp: any;
  config: any;
  emp_code: any;
  com_code: any;
  otp_attempt: number;

  tokenFromUI: string = "SMRTCKT2019_b14ca5898a4e4133bbce";

  constructor(
    private router: Router,
    private _forgetPasswordService: ForgetpasswordService
  ) {
    this.config = {
      length: 6,
      inputStyles: {
        width: "40px",
        color: "#320773",
        border: "solid",
      },
    };
  }

  ngOnInit() {
    this.emp_code = localStorage.getItem("emp_code");
    this.com_code = localStorage.getItem("com_code");
    this.otp_attempt = 0;
  }
  onOtpChange(event) {
    console.log("onotpchange: ", event);

    this.otp = event;
  }

  sendDetails() {
    console.log("data of OTP is", this.otp);

    //console.log(this.otp.length);
    if (this.otp == undefined) {
      window.alert("OTP Can't be empty");
    } else if (this.otp.length < 6) {
      window.alert("OTP must be complete");
    } else {
      console.log("ok");

      //api call to verify the otp
      this.serviceCall();
    }

    //navigate to forget password
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

  reSendOtp() {
    this.otp_attempt += 1;
    this.serviceCallForResendOtp();
  }
  //api call to verify otp
  serviceCall() {
    console.log(this.com_code);
    console.log(this.emp_code);
    var forgetPasswordService = new ForgetPassword();
    forgetPasswordService.NoOfAttempts = this.otp_attempt;
    forgetPasswordService.OTPGenerated = this.otp;

    // forgetPasswordService.CompanyId = this.com_code;
    // forgetPasswordService.UserId = this.emp_code;

    forgetPasswordService.CompanyId = this.encryptValues(this.com_code);
    forgetPasswordService.UserId = this.encryptValues(this.emp_code);

    this._forgetPasswordService
      .setNewPassword(forgetPasswordService)
      .subscribe((response) => {
        // reponse from the api
        if (response["Success"]) {
          this.router.navigate(["/forgetpassword"]);
        } else {
          window.alert("OTP is incorrect");
        }
      });
  }

  //api call to resend OTP
  serviceCallForResendOtp() {
    console.log(this.com_code);
    console.log(this.emp_code);
    var forgetPasswordService = new ForgetPassword();
    forgetPasswordService.NoOfAttempts = this.otp_attempt;
    // forgetPasswordService.OTPGenerated =this.otp
    forgetPasswordService.CompanyId = this.com_code;
    forgetPasswordService.UserId = this.emp_code;

    this._forgetPasswordService
      .setNewPassword(forgetPasswordService)
      .subscribe((response) => {
        // reponse from the api
        if (response["Success"]) {
          window.alert("OTP Send Sucessfully");
        } else {
          window.alert("Failed to send OTP");
        }
      });
  }
}
