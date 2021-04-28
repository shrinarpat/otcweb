import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { NgModule } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/catch";
import { Injectable } from "@angular/core";
import { Observable, Subject, concat, of } from "rxjs";
import {
  map,
  filter,
  distinctUntilChanged,
  debounceTime,
  tap,
  switchMap,
} from "rxjs/operators";
import { CanDeactivate } from "@angular/router";
import { AtmMasterServiceService } from "../services/atm/atm-master-service.service";
import { AtmMaster, ATMMasterModel } from "../modals/Atm/atmmastermodal";
import { BranchServiceService } from "../services/branch/branch-service.service";

import {
  BsDatepickerDirective,
  BsDatepickerConfig,
} from "ngx-bootstrap/datepicker";
import { ManageTenantServiceService } from "../services/masterUser/manage-tenant-service.service";

@Injectable()
export class ConfirmDeactivateGuard2
  implements CanDeactivate<TypographyComponent> {
  canDeactivate(target: TypographyComponent) {
    if (target.checkIfStarted()) {
      return window.confirm("Are you sure?");
    }
    return true;
  }
}
@NgModule({
  providers: [ConfirmDeactivateGuard2],
})
@Component({
  selector: "app-typography",
  templateUrl: "./typography.component.html",
  styleUrls: ["./typography.component.css"],
})
export class TypographyComponent implements OnInit {
  @ViewChild(BsDatepickerDirective) datepicker: BsDatepickerDirective;
  datepickerconfig: Partial<BsDatepickerConfig>;

  @HostListener("window:scroll", ["$event"])
  onScrollEvent() {
    this.datepicker.hide();
  }

  colorTheme: string = "theme-dark-blue";
  bsInlineValue: Date = new Date();

  image_names: string = null;
  date_img: any = null;

  server_json: any;
  server_name: string;
  service_name: string;

  request: any;
  response: any;

  login_token: any;
  access: any;

  location_name: string;
  location_name_header: string;
  audit_done_by: string;
  date_of_audit: string = null;
  date_of_audit_ov: string = null;
  date_of_audit_so: string = null;

  date: Date = new Date();
  minDate: Date;

  confirm_pressed: boolean = false;

  check_desc: string = null;
  flagEditATM: boolean = false;
  flagnewATM: boolean = false;
  flagPaginate: boolean = false;
  atm_list: any = [];
  response_add_atm: any = [];
  response_edit_Atm: any;
  got_atm: boolean = false;
  atm_zone: string = null;
  atm_id1: string = null;
  atm_location: string = null;

  atm_id: String;
  atm_code: string;
  pin_code: string;
  atm_serialNo: string;

  bank_name: string = null;
  address: string = null;
  companyID: string = null;
  createdBy: string = null;
  created_date: string;
  UpdatedBy: string = null;
  route_code: string = null;
  location: string = null;
  Zone_code: string = null;
  branch_id: string;
  userCode: string;
  company_name: string;
  company_code: string;
  newArray: any = [];
  userID: string;
  branchName: string;

  atm_codef: string;
  br_code: string;
  comp_code: string;

  companies: any = [];
  company_list$: Observable<any>;
  companies_loading: boolean = false;
  clearable_company: boolean = false;
  virtual_scroll_company: boolean = true;

  branches: any = [];
  branch_list$: Observable<any>;
  branches_loading: boolean = false;
  clearable_branch: boolean = false;
  virtual_scroll_branch: boolean = true;
  disabledBranchSelection: boolean = true;

  temp_atm_list: any = [];

  selectedCompanyId: string;
  selectedCompanyCode: string = null;
  previousSelectedCompanyCode: string = null;
  selectedBranchId: string;
  selectedBranchCode: string;
  selectedBranchName: string = null;
  permission_flag: boolean = false;
  permission: string;
  show_filter: boolean = false;

  company_flag: boolean = false;
  flagbranchtype: boolean = false;
  isCMS: boolean = false;
  showbranch: boolean = true;
  show_blank_alert: boolean = false;
  show_pin_alert: boolean = false;
  show_atm_alert: boolean = false;

  constructor(
    private router: Router,
    private _atmService: AtmMasterServiceService,
    private _branchService: BranchServiceService,
    private _tenantService: ManageTenantServiceService
  ) {
    this.datepickerconfig = Object.assign(
      {},
      {
        containerClass: this.colorTheme,
      }
    );
    this.flagbranchtype = false;
    this.minDate = new Date();
  }

  ngOnInit() {
    this.confirm_pressed = false;

    this.login_token = localStorage.getItem("CMSAppUserLogin");
    if (this.login_token) {
      this.access = JSON.parse(this.login_token);
      this.createdBy = this.access["name"];
      this.userCode = this.access.Entity.EmployeeCode;
      this.userID = this.access.Entity.UserID;
      this.companyID = this.access.Entity.CompanyID;
      this.company_code = this.access.Entity.CompanyCode;
      if (this.company_code == "CMS" || this.company_code == "cms") {
        this.isCMS = true;
      } else {
        this.disabledBranchSelection = false;
      }
      console.log("---", this.access["Entity"]["atm_master"]);
      this.permission = this.access["Entity"]["atm_master"];
      if (this.permission != "Read") {
        this.permission_flag = true;
      }
      console.log(this.permission_flag);
    } else {
      this.router
        .navigateByUrl("/", { skipLocationChange: false })
        .then(() => this.router.navigate(["/login"]));
    }
    this.created_date =
      (this.date.getDate() < 10 ? "0" : "") +
      this.date.getDate() +
      "-" +
      ((this.date.getMonth() + 1 < 10 ? "0" : "") +
        (this.date.getMonth() + 1)) +
      "-" +
      this.date.getFullYear();

    this.getATM();
    console.log("atm list", this.atm_list);
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
      this.atm_list = this.temp_atm_list.filter((res) => {
        return res.ATMID.toLocaleUpperCase().match(
          this.atm_codef.toLocaleUpperCase()
        );
      });
    }
    if (id == 2) {
      console.log(
        "isndie id 2",
        ev,
        this.br_code.toLocaleUpperCase(),
        this.temp_atm_list
      );
      this.atm_list = this.temp_atm_list.filter((res) => {
        return res.BranchCode.toLocaleUpperCase().match(
          this.br_code.toLocaleUpperCase()
        );
      });
    }
    if (id == 3) {
      this.atm_list = this.temp_atm_list.filter((res) => {
        return res.CompanyName.toLocaleUpperCase().match(
          this.comp_code.toLocaleUpperCase()
        );
      });

      if (
        this.comp_code.length == 0 &&
        this.br_code.length == 0 &&
        this.atm_codef.length == 0
      ) {
        console.log("data", this.temp_atm_list);
        this.atm_list = this.temp_atm_list;
      }
    }
  }

  getBranches() {
    console.log("inside getBranches");
    this.branches_loading = true;

    this.branches = [];
    this._branchService.getbranch(this.userID).subscribe((data) => {
      for (let item of data["Entity"]) {
        if (this.isCMS) {
          if (
            item.CompanyID === this.selectedCompanyId &&
            item.Active === true
          ) {
            item.BranchLabel = item.BranchName + "(" + item.BranchCode + ")";
            //console.log("branchlable: ", item.BranchLabel);
            this.branches.push(item);
          }
        } else {
          if (
            item.CompanyID === Number(this.companyID) &&
            item.Active === true
          ) {
            item.BranchLabel = item.BranchName + "(" + item.BranchCode + ")";
            this.branches.push(item);
          }
        }
      }
      this.branches_loading = false;
      this.branch_list$ = of(this.branches);
      //console.log("this.branch_list$: ", this.branch_list$);
    });
  }

  getBranchFlag(z) {
    this.flagbranchtype = true;
    this.branches_loading = false;
    this.selectedBranchId = z.BranchID;
    this.selectedBranchCode = z.BranchCode;
    this.selectedBranchName = z.BranchName;
  }

  getCompanies() {
    console.log("inside getCompanies");
    if (this.companies.length <= 0 && this.companies_loading === false) {
      this.companies_loading = true;
      this.companies = [];
      this._tenantService
        .getAssignedCustomers(this.userID)
        .subscribe((data) => {
          for (let item of data["Entity"]) {
            if (item.Active === true) {
              this.companies.push(item);
            }
          }
          this.companies_loading = false;
          this.company_list$ = of(this.companies);
        });
    }
  }

  getCompanyFlag(z) {
    this.company_flag = true;
    this.companies_loading = false;
    this.disabledBranchSelection = false;
    this.branch_list$ = null;
    this.selectedCompanyId = z.CompanyId;
    this.selectedCompanyCode = z.CompanyCode;
    this.selectedBranchId = "";
    this.selectedBranchCode = "";
    this.selectedBranchName = null;
    this.flagbranchtype = false;
    //this.getBranches();
  }

  //cal to get the lsit of ATM
  getATM() {
    //call to get branch

    this._atmService.getatm(this.userID).subscribe((data) => {
      this.atm_list = [];
      for (let i of data["Entity"]) {
        if (i.Active == true) {
          this.atm_list.push(i);
        }
      }
      if (this.atm_list) {
        this.got_atm = true;
        this.temp_atm_list = this.atm_list;
        console.log("atm list", this.atm_list);
      }
    });
  }

  //Checkbox Change detecting function
  getCheckboxValues(ev, data) {
    if (ev.target.checked) {
      // Pushing the object into array
      // console.log("---",obj.branch)
      data["Active"] = false;
      this.newArray.push(data);
    } else {
      let el = this.newArray.find((itm) => itm.atm === data);
      console.log("inside el on deactivation0", el);

      if (el) console.log("inside el on deactivation1", el);
      this.newArray.splice(this.newArray.indexOf(el), 1);
    }

    //Duplicates the obj if we uncheck it
    //How to remove the value from array if we uncheck it
    // this.newArray.length()
    console.log("length of new array", this.newArray.length);
    console.log(this.newArray);

    if (this.newArray.length > 0) {
      this.flagEditATM = true;
    }
    if (this.newArray.length == 0) {
      console.log("if zwero ", this.newArray.length);

      this.flagEditATM = false;
    }

    // for ( let i of this.newArray.length) {
    //   console.log(this.newArray[i])
    // }
  }

  //function to edit the branchmaster data
  editATM(aid) {
    // this.got_atm =false
    console.log(aid);
    this.atm_id1 = aid.Atm_id;
    // this.atm_location =aid.location
    this.atm_zone = aid.zone;
    // this.flagEditATM =true

    //api call to get the branch details
  }

  confirmSubmitATM() {
    const payload = {
      UserId: this.userID,
      CompanyCode: this.company_code,
      AtmMasterModel: this.newArray,
    };

    this._atmService.editatm(payload).subscribe((data) => {
      this.response_edit_Atm = data;
      if (this.response_edit_Atm) {
        window.alert("Successfully Submitted");

        window.location.reload();
      } else {
        window.alert("Failed to add data");
      }
    });
  }

  createNewATM() {
    this.flagnewATM = true;
  }

  validationChecks() {
    if (this.show_pin_alert || this.show_atm_alert) {
      return true;
    } else {
      return false;
    }
  }

  saveNewATM() {
    if (!this.blankfieldCheck()) {
      if (!this.validationChecks()) {
        var atm = new AtmMaster();
        var atmMaster = new ATMMasterModel();
        //atm.CompanyCode =this.company_code
        atm.UserId = parseInt(this.userID);

        if (this.isCMS) {
          atm.CompanyCode = this.selectedCompanyCode;
          atmMaster.CompanyID = parseInt(this.selectedCompanyId);
        } else {
          atm.CompanyCode = this.company_code;
          atmMaster.CompanyID = Number(this.companyID);
        }
        atmMaster.ATMID = this.atm_code.toLocaleUpperCase();
        atmMaster.BankName = this.bank_name;
        atmMaster.Address = this.address;
        atmMaster.PinCode = parseInt(this.pin_code);
        // atmMaster.CompanyName=this.selectedCompanyCode
        atmMaster.ATMLockSerialNo = this.atm_serialNo;
        atmMaster.BranchName = this.selectedBranchCode;
        atmMaster.BranchID = this.selectedBranchId;

        atm.AtmMasterModel.push(atmMaster);

        // if(this.atm_code&& this.bank_name&& this.address&&this.pin_code){

        //api method call
        this._atmService.addatm(atm).subscribe((data) => {
          this.response_add_atm = data;
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
    console.log("inside servicecalled");
    if (
      this.response_add_atm["Success"] &&
      this.response_add_atm["Message"] === "Data Added Successfully"
    ) {
      window.alert("ATM added successfully");

      window.location.reload();
    } else if (
      this.response_add_atm["Success"] &&
      this.response_add_atm["Message"] === "ATM Code already Exists"
    ) {
      window.alert("ATM already exist");
    } else {
      // this.invalid_request =true
      window.alert("Failed to add atm");
    }
  }

  validatePinCode() {
    console.log("Inside function");
    var regexp = new RegExp("[0-9]{6}");
    if (this.pin_code === "") {
      this.show_pin_alert = false;
    } else if (this.pin_code.length != 6) {
      this.show_pin_alert = true;
    } else {
      if (regexp.test(this.pin_code)) {
        this.show_pin_alert = false;
      } else {
        this.show_pin_alert = true;
      }
    }
  }

  validateAtmCode() {
    var reg = /[^0-9A-za-z]/;
    var isspecial = reg.test(this.atm_code);
    if (isspecial === true) {
      this.show_atm_alert = true;
    } else {
      this.show_atm_alert = false;
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

  wait(ms: number) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
      end = new Date().getTime();
    }
  }

  checkIfStarted() {
    if (0) {
      return true;
    } else {
      return false;
    }
  }

  blankfieldCheck() {
    this.show_blank_alert = false;
    if (!this.isCMS) {
      this.company_flag = true;
    }

    var flag1 = !this.company_flag || !this.flagbranchtype;
    var flag2 =
      this.nullCheck(this.atm_code) ||
      this.nullCheck(this.bank_name) ||
      this.nullCheck(this.address) ||
      this.nullCheck(this.pin_code) ||
      this.nullCheck(this.atm_serialNo);

    if (flag1 || flag2) {
      this.show_blank_alert = true;
    } else {
      this.show_blank_alert = false;
    }
    console.log(this.show_blank_alert);
    return this.show_blank_alert;
  }

  //Check if data is empty
  nullCheck(data) {
    if (data === undefined || data === "" || data === null) {
      return true;
    } else {
      return false;
    }
  }
}
