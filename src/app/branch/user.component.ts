import { Component, OnInit, ViewChild } from "@angular/core";
import { NgModule } from "@angular/core";

import { Router } from "@angular/router";

import { retry } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/catch";
import { EMPTY } from "rxjs";

import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";

import { Subject } from "rxjs/Subject";
import { Observable, of } from "rxjs";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { SignaturePad } from "angular2-signaturepad/signature-pad";

import { BranchServiceService } from "../services/branch/branch-service.service";
import { Branch, addBranchReqchildModels } from "../modals/branch/branchmodal";
import { ManageTenantServiceService } from "../services/masterUser/manage-tenant-service.service";
import { constants } from "os";

@Injectable()
export class ConfirmDeactivateGuard1 implements CanDeactivate<UserComponent> {
  canDeactivate(target: UserComponent) {
    if (target.checkIfStarted()) {
      return window.confirm("Are you sure?");
    }
    return true;
  }
}
@NgModule({
  providers: [ConfirmDeactivateGuard1],
})
@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  login_token: any;
  access: any;
  review_mode: boolean = false;
  incomplete: boolean = false;
  date_of_audit: string;
  flagEditbranch: boolean = false;
  flagnewBranch: boolean = false;
  got_Branch: boolean = false;
  response: any;
  response_add_branch: any;
  // branch_list:Branch[]
  date: Date = new Date();

  confirm_pressed: boolean = false;
  branch_id1: string;
  branch_location: string;
  branch_zone: string;

  id: string;
  company_ID: string;
  branch_code: string;
  branch_name: string;
  created_by: string;
  createdDate: string;
  modified_by: string;
  modifieDate: string;
  userCode: string;
  userId: string;
  company_code: string;
  invalid_request: boolean = false;
  active_branch: boolean = true;
  addBranchList: any = [];
  permission: string;
  permission_flag: boolean = false;
  response_edit_branch: any;
  comp_name: string;
  br_name: string;
  branch_code_f: string;
  newArray: any = [];

  companies: any = [];
  company_list$: Observable<any>;
  companies_loading: boolean = false;
  virtual_scroll_company: boolean = true;
  clearable_company: boolean = false;
  branch_list: any = [];
  temp_branch_list: any = [];

  selectedCompanyId: string;
  selectedCompanyCode: string;

  company_flag: boolean = false;
  flagbranchtype: boolean = false;
  isCMS: boolean = false;
  show_blank_alert: boolean = false;
  show_branch_alert: boolean = false;
  show_filter: boolean = false;

  constructor(
    private router: Router,
    private _branchService: BranchServiceService,
    private _tenantService: ManageTenantServiceService
  ) {}

  ngOnInit() {
    this.confirm_pressed = false;
    this.login_token = localStorage.getItem("CMSAppUserLogin");
    if (this.login_token) {
      this.access = JSON.parse(this.login_token);
      this.userCode = this.access.Entity.EmployeeCode;
      this.company_code = this.access.Entity.CompanyCode;
      if (this.company_code == "CMS" || this.company_code == "cms") {
        this.isCMS = true;
      }
      console.log("---", this.access["Entity"]["branch_master"]);
      this.permission = this.access["Entity"]["branch_master"];
      if (this.permission != "Read") {
        this.permission_flag = true;
      }
      this.created_by = this.access.Entity.UserName;
      this.userCode = this.access.Entity.EmployeeCode;
      this.userId = this.access.Entity.UserID;
    } else {
      this.router
        .navigateByUrl("/", { skipLocationChange: false })
        .then(() => this.router.navigate(["/login"]));
    }
    this.createdDate =
      (this.date.getDate() < 10 ? "0" : "") +
      this.date.getDate() +
      "-" +
      ((this.date.getMonth() + 1 < 10 ? "0" : "") +
        (this.date.getMonth() + 1)) +
      "-" +
      this.date.getFullYear();

    //this.getBranches();
    this.getBranch();
  }

  //filetr method

  showFilter() {
    if (this.show_filter) {
      this.show_filter = false;
    } else {
      this.show_filter = true;
    }
  }

  filter(ev, id) {
    console.log("id is ", id);
    if (id == 1) {
      this.branch_list = this.temp_branch_list.filter((res) => {
        return res.CompanyCode.toLocaleUpperCase().match(
          this.comp_name.toLocaleUpperCase()
        );
      });
    }
    if (id == 2) {
      console.log(
        "isndie id 2",
        ev,
        this.br_name.toLocaleLowerCase(),
        this.temp_branch_list
      );
      this.branch_list = this.temp_branch_list.filter((res) => {
        return res.BranchName.toLocaleLowerCase().match(
          this.br_name.toLocaleLowerCase()
        );
      });
    }

    if (id == 3) {
      //console.log(this.temp_branch_list);
      this.branch_list = this.temp_branch_list.filter((res) => {
        return res.BranchCode.toLocaleUpperCase().match(
          this.branch_code_f.toLocaleUpperCase()
        );
      });
    }

    if (this.comp_name.length == 0 && this.br_name.length == 0) {
      // this.getBranch()
      console.log("data", this.temp_branch_list);
      this.branch_list = this.temp_branch_list;
    }
  }

  getBranch() {
    //call to get branch

    this._branchService.getbranch(this.userId).subscribe((data) => {
      this.branch_list = [];
      for (let i of data["Entity"]) {
        if (i.Active == true) {
          this.branch_list.push(i);
        }
      }
      console.log(this.branch_list);
      if (this.branch_list) {
        this.got_Branch = true;
        this.temp_branch_list = this.branch_list;
      }
    });
  }

  getCompanies() {
    this.companies = [];
    this.companies_loading = true;
    this._tenantService.getAssignedCustomers(this.userId).subscribe((data) => {
      console.log(data);
      for (let item of data["Entity"]) {
        if (item.Active === true) {
          this.companies.push(item);
        }
      }
      this.companies_loading = false;
      this.company_list$ = of(this.companies);
    });
  }

  getCompanyFlag(z) {
    this.company_flag = true;
    this.companies_loading = false;
    this.selectedCompanyId = z.CompanyId;
    this.selectedCompanyCode = z.CompanyCode;
  }

  validateBranchCode() {
    var reg = /[^0-9A-za-z]/;
    var isspecial = reg.test(this.branch_code);
    if (isspecial === true) {
      this.show_branch_alert = true;
    } else {
      this.show_branch_alert = false;
    }
  }

  //Checkbox Change detecting function
  getCheckboxValues(ev, data) {
    if (ev.target.checked) {
      // Pushing the object into array
      // console.log("---",obj.branch)
      // obj.branch['Active']=false
      data["userid"] = this.userId;
      data["Active"] = false;
      this.newArray.push(data);
    } else {
      let el = this.newArray.find((itm) => itm.branch === data);
      console.log("deactivation dat", el);

      if (el) console.log("deactivation dat", el);
      this.newArray.splice(this.newArray.indexOf(el), 1);
    }

    //Duplicates the obj if we uncheck it
    //How to remove the value from array if we uncheck it
    // this.newArray.length()
    console.log(this.newArray);
    if (this.newArray.length > 0) {
      this.flagEditbranch = true;
    }
    if (this.newArray.length == 0) {
      this.flagEditbranch = false;
    }

    // for ( let i of this.newArray.length) {
    //   console.log(this.newArray[i])
    // }
  }

  blankfieldCheck() {
    this.show_blank_alert = false;
    console.log(this.company_flag);
    console.log(this.branch_name);
    console.log(this.branch_code);
    if (!this.isCMS) {
      this.company_flag = true;
    }

    if (
      !this.company_flag ||
      this.nullCheck(this.branch_name) ||
      this.nullCheck(this.branch_code)
    ) {
      this.show_blank_alert = true;
    } else {
      this.show_blank_alert = false;
    }
    console.log(this.show_blank_alert);
    return this.show_blank_alert;
  }

  nullCheck(data) {
    if (data === undefined || data === "" || data === null) {
      return true;
    } else {
      return false;
    }
  }

  confirmSubmitBranch() {
    this._branchService.editbranch(this.newArray).subscribe((data) => {
      this.response_edit_branch = data;
      if (this.response_edit_branch) {
        window.alert("Successfully Submitted");
        window.location.reload();
      } else {
        window.alert("Failed To update");
      }
    });
  }

  createNewBranch() {
    this.flagnewBranch = true;
  }

  saveNewBranch() {
    if (!this.blankfieldCheck()) {
      if (!this.show_branch_alert) {
        var branch = new Branch();
        var addBranchMaster = new addBranchReqchildModels();
        addBranchMaster.BranchCode = this.branch_code.toLocaleUpperCase();
        addBranchMaster.BranchName = this.branch_name;
        // branch.CompanyID=1
        if (this.isCMS) {
          branch.CompanyCode = this.selectedCompanyCode;
          console.log(branch.CompanyCode);
        } else {
          branch.CompanyCode = this.company_code;
        }
        // branch.CompanyCode=this.company_code
        branch.userId = this.userId;
        branch.addBranchReqchildModels.push(addBranchMaster);
        // this.addBranchList.push(branch)
        console.log("--", this.branch_code);
        // if(this.branch_code&& this.branch_name){

        //api method call
        this._branchService.addbranch(branch).subscribe((data) => {
          this.response_add_branch = data;
          this.serviceCalled();
        });
      } else {
        window.alert(
          "Some Field validations have failed. Please fill valid data"
        );
      }
    } else {
      window.alert("Please fill the mandatory field");
    }
  }

  serviceCalled() {
    if (
      this.response_add_branch["Success"] &&
      this.response_add_branch.Message === "Record Added Successfully"
    ) {
      window.alert("Branch created sucessfully");
      window.location.reload();
    } else if (
      this.response_add_branch.Success &&
      this.response_add_branch.Message ===
        "Branch Code for the given Company ID is already present"
    ) {
      window.alert("Branch already exist");
    } else {
      this.invalid_request = true;
      window.alert("FailedTo add branch");
    }
  }

  formatDate(date) {
    var dateParts = date.split("-");
    var d = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("");
  }

  checkIfStarted() {
    if (0) {
      return true;
    } else {
      return false;
    }
  }
}
