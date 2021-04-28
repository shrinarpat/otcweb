import { Observable, of } from "rxjs";
import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import {
  BsDatepickerDirective,
  BsDatepickerConfig,
} from "ngx-bootstrap/datepicker";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DailyActivityServiceService } from "../services/dailyActivity/daily-activity-service.service";
import { AtmMasterServiceService } from "../services/atm/atm-master-service.service";
import {
  DailyActivityModal,
  DailyActivity,
} from "../modals/daily-activity/dailyActivityModal";
import { ManageTenantServiceService } from "../services/masterUser/manage-tenant-service.service";
import { BranchServiceService } from "../services/branch/branch-service.service";
import * as constant from "../bulkupload/Constants";
import { windowWhen } from "rxjs/operators";

declare var $: any;

@Component({
  selector: "app-tables",
  templateUrl: "./tables.component.html",
  styleUrls: ["./tables.component.css"],
})
export class TablesComponent implements OnInit {
  @ViewChild(BsDatepickerDirective) datepicker: BsDatepickerDirective;
  datepickerconfig: Partial<BsDatepickerConfig>;
  colorTheme: string = "theme-dark-blue";

  @HostListener("window:scroll", ["$event"])
  onScrollEvent() {
    this.datepicker.hide();
  }

  login_token: any;
  access: any;

  activities: any = [];
  type_activity$: Observable<any>;
  activities_loading: boolean = false;
  clearable_activity: boolean = false;
  disabledActivitySelection: boolean = true;

  temp_activity_list: any = [];
  response_add_Activity: any;
  atm_id_list: any = [];
  dailyactivity_list: any = [];
  temp_daily_activity_list: any = [];
  activity: string;
  flagactivitytype: boolean = false;
  got_data: boolean = false;
  userCode: string;
  company_code: string;
  from_date: any = null;
  to_date: any = null;
  atm_id: string;
  date: Date = new Date();
  minDate: Date;
  userId: number;

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

  atms: any = [];
  atm_list$: Observable<any>;
  virtual_scroll_atm: boolean = true;
  atm_loading: boolean = false;
  clearable_atm: boolean = false;
  disabledAtmSelection: boolean = true;
  atm_code: string = null;

  selectedCompanyId: number;
  selectedCompanyCode: string;
  selectedBranchId: number;
  selectedBranchCode: string;
  selectedBranchName: string;
  selectedATMCode: number;
  selectedATMId: number;
  selectedTRTYPE: string;
  selectedActivityID: number;

  company_flag: boolean = false;
  flagbranchtype: boolean = false;
  flagatm: boolean = false;
  isCMS: boolean = false;
  permission: string;
  permission_flag: boolean = false;
  showbranch: boolean = true;
  companyID: string;
  show_blank_alert: boolean = false;
  show_filter: boolean = false;
  comp_code: string;
  activity_name: string;
  atm_codef;

  constructor(
    private router: Router,
    private _dailyActivity: DailyActivityServiceService,
    private _atmService: AtmMasterServiceService,
    private _tenantService: ManageTenantServiceService,
    private _branchService: BranchServiceService
  ) {
    this.datepickerconfig = Object.assign(
      {},
      {
        containerClass: this.colorTheme,
        dateInputFormat: "YYYY-MM-DD",
      }
    );

    this.minDate = new Date();
  }

  ngOnInit() {
    this.login_token = localStorage.getItem("CMSAppUserLogin");
    if (this.login_token) {
      this.access = JSON.parse(this.login_token);
      this.userCode = this.access.Entity.EmployeeCode;
      this.company_code = this.access.Entity.CompanyCode;
      this.userId = this.access.Entity.UserID;
      this.companyID = this.access.Entity.CompanyID;
      if (this.company_code == "CMS" || this.company_code == "cms") {
        this.isCMS = true;
      } else {
        this.disabledBranchSelection = false;
        console.log(this.company_code);
        this.selectedCompanyCode = this.company_code;
      }
      this.permission = this.access["Entity"]["daily_activity_master"];
      if (this.permission != "Read") {
        this.permission_flag = true;
      }
    } else {
      this.router
        .navigateByUrl("/", { skipLocationChange: false })
        .then(() => this.router.navigate(["/login"]));
    }
    this.dailyactivity();
    //this.getActivityType();
  }

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
      this.dailyactivity_list = this.temp_daily_activity_list.filter((res) => {
        return res.ATMID.toLocaleUpperCase().match(
          this.atm_codef.toLocaleUpperCase()
        );
      });
    }

    if (id == 3) {
      this.dailyactivity_list = this.temp_daily_activity_list.filter((res) => {
        return res.TransType.toLocaleUpperCase().match(
          this.activity_name.toLocaleUpperCase()
        );
      });
    }
    if (id == 2) {
      this.dailyactivity_list = this.temp_daily_activity_list.filter((res) => {
        return res.CompanyName.toLocaleUpperCase().match(
          this.comp_code.toLocaleUpperCase()
        );
      });

      if (
        this.comp_code.length == 0 &&
        this.activity_name.length == 0 &&
        this.atm_codef.length == 0
      ) {
        this.dailyactivity_list = this.temp_daily_activity_list;
      }
    }
  }

  Dateformattter(unformatted_date: string) {
    // return unformatted_date.replace("T","  ").split(/[\.]/)[0].slice(0,-3);
    return unformatted_date.replace("T", "  ").split(" ")[0];
  }

  getBranches() {
    this.branches = [];
    this.branches_loading = true;
    this._branchService.getbranch(this.userId).subscribe((data) => {
      for (let item of data["Entity"]) {
        if (this.isCMS) {
          if (
            item.CompanyID === this.selectedCompanyId &&
            item.Active === true
          ) {
            item.BranchLabel = item.BranchName + "(" + item.BranchCode + ")";
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
    });
  }

  getBranchFlag(z) {
    this.flagbranchtype = true;
    this.branches_loading = false;
    this.disabledAtmSelection = false;
    this.disabledActivitySelection = true;
    this.selectedTRTYPE = null;
    this.type_activity$ = null;
    this.atm_list$ = null;
    this.atm_code = null;
    this.selectedBranchId = z.BranchID;
    this.selectedBranchCode = z.BranchCode;
    this.selectedBranchName = z.BranchName;
    // this.selectedATMCode =
    this.selectedATMId = null;
    this.flagatm = false;
  }

  getCompanies() {
    if (this.companies.length <= 0 && this.companies_loading === false) {
      this.companies = [];
      this.companies_loading = true;
      this._tenantService
        .getAssignedCustomers(this.userId)
        .subscribe((data) => {
          for (let item of data["Entity"]) {
            if (item.Active === true) {
              this.companies.push(item);
            }
          }
          this.companies_loading = false;
          this.company_list$ = of(this.companies);
          console.log("compnaies_lsti: ", this.company_list$);
        });
    }
  }

  getCompanyFlag(z) {
    this.company_flag = true;
    this.companies_loading = false;
    this.disabledBranchSelection = false;
    this.disabledAtmSelection = true;
    this.disabledActivitySelection = true;
    this.selectedTRTYPE = null;
    this.type_activity$ = null;
    this.branch_list$ = null;
    this.atm_list$ = null;
    this.atm_code = null;
    this.selectedCompanyId = z.CompanyId;
    this.selectedCompanyCode = z.CompanyCode;
    this.selectedBranchId = null;
    this.selectedBranchCode = "";
    this.selectedBranchName = null;
    // this.selectedATMCode = ""
    this.selectedATMId = null;
    this.flagbranchtype = false;
    this.flagatm = false;
  }

  getAtmList() {
    this.atms = [];
    this.atm_loading = true;
    this._atmService.getatm(this.userId).subscribe((data) => {
      for (let item of data["Entity"]) {
        if (item.BranchID === this.selectedBranchId && item.Active === true) {
          this.atms.push(item);
        }
      }
      this.atm_loading = false;
      this.atm_list$ = of(this.atms);
    });
  }

  getAtmFlag(z) {
    console.log("--", z);
    this.flagatm = true;
    this.atm_loading = false;
    this.disabledActivitySelection = false;
    this.selectedATMId = z.ATMID;
    this.selectedATMCode = z.ATMCode;
  }

  atmMasterFetch() {
    this._atmService.getatm(this.userId).subscribe((data) => {
      for (let item of data["Entity"]) {
        console.log(item);
        this.atm_id_list.push(item["ATMID"]);
      }
    });
  }

  getActivityType() {
    this.activities_loading = true;

    this._dailyActivity.getdailyActivityType(this.userId).subscribe((data) => {
      for (let item of data["Entity"]) {
        console.log({
          ActivityName: item["ActivityName"],
          ActivityID: item["ActivityID"],
        });
        this.activities.push(item);
      }
      this.activities_loading = false;
      this.type_activity$ = of(this.activities);
    });
    this.temp_activity_list = this.activities;
  }

  getActivityflag(z) {
    this.selectedTRTYPE = z.ActivityName;
    this.selectedActivityID = z.ActivityID;
    this.flagactivitytype = true;
    this.dailyactivity();
  }

  dailyactivity() {
    this.got_data = true;
    this._dailyActivity.getdailyActivities(this.userId).subscribe((data) => {
      this.dailyactivity_list = data["Entity"];
      this.temp_daily_activity_list = this.dailyactivity_list;
      console.log("data oos daily actity", this.dailyactivity_list);
    });
  }

  saveDailyActivty() {
    if (!this.blankfieldCheck()) {
      var dailtActivityMaster = new DailyActivityModal();
      var dailActivty = new DailyActivity();
      dailtActivityMaster.UserID = Number(this.userId);
      // dailActivty.CompanyID = Number(this.selectedCompanyId)
      dailActivty.ATMID = this.selectedATMId.toString();
      dailActivty.ATMCode = this.selectedATMCode;

      if (this.isCMS === true) {
        dailActivty.CompanyID = Number(this.selectedCompanyId);
      } else {
        dailActivty.CompanyID = Number(this.companyID);
      }
      dailActivty.ActivityId = Number(this.selectedActivityID);
      //dailActivty.ToDate =this.to_date
      dailActivty.TRTYPE = this.selectedTRTYPE;
      dailActivty.TransDate = this.from_date;
      dailActivty.ActivityName = this.selectedTRTYPE;
      dailtActivityMaster.DailyActivity.push(dailActivty);
      console.log("daily Activity data", dailtActivityMaster);

      this._dailyActivity
        .adddailyActivity(dailtActivityMaster)
        .subscribe((data) => {
          console.log("Daily Activity data");
          console.log(data);
          if (data["Success"]) {
            window.alert("Activity Assigned Successfully");
            window.location.reload();
          } else {
            window.alert("Failed to add data");
          }
        });
    } else {
      window.alert("Please fill the mandatory field");
    }
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  blankfieldCheck() {
    this.show_blank_alert = false;
    if (!this.isCMS) {
      this.company_flag = true;
    }

    var flag1 =
      !this.company_flag ||
      !this.flagbranchtype ||
      !this.flagatm ||
      !this.flagactivitytype ||
      this.nullCheck(this.from_date);

    if (flag1) {
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
