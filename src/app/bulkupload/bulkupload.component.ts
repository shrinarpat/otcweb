import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import { NgModule } from "@angular/core";

import { Router } from "@angular/router";

import { retry } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import "rxjs/add/operator/catch";
import { EMPTY, Observable, of } from "rxjs";

import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";

import { Subject } from "rxjs/Subject";
import { WebcamImage, WebcamInitError, WebcamUtil } from "ngx-webcam";
import { SignaturePad } from "angular2-signaturepad/signature-pad";
import {
  BsDatepickerDirective,
  BsDatepickerConfig,
} from "ngx-bootstrap/datepicker";
import { extendsDirectlyFromObject } from "@angular/core/src/render3/jit/directive";
import Handsontable from "handsontable";
import * as constant from "../bulkupload/Constants";
import { constants } from "os";

import { BranchServiceService } from "../services/branch/branch-service.service";
import { Branch, addBranchReqchildModels } from "../modals/branch/branchmodal";
import { ManageTenantServiceService } from "../services/masterUser/manage-tenant-service.service";

import { AtmMasterServiceService } from "../services/atm/atm-master-service.service";
import { AtmMaster, ATMMasterModel } from "../modals/Atm/atmmastermodal";
import { ManageStaffServiceService } from "../services/manageStaff/manage-staff-service.service";
import { ManageEmployeeServiceService } from "../services/manageEmployee/manage-employee-service.service";
import {
  EmployeeAdd,
  EmployeeEdit,
  UserData,
  UserDetails,
} from "../modals/employee/employeemodal";
import { AtmEmployeeMappingServiceService } from "../services/atm-emp-mapping/atm-employee-mapping-service.service";
import { AtmEmpMapping } from "../modals/atm-emp-mapping/atmEmpModal";

import { DailyActivityServiceService } from "../services/dailyActivity/daily-activity-service.service";
import { DailyActivityModal } from "../modals/daily-activity/dailyActivityModal";

@Component({
  selector: "app-bulkupload",
  templateUrl: "./bulkupload.component.html",
  styleUrls: ["./bulkupload.component.scss"],
})
export class BulkuploadComponent implements OnInit {
  login_token: any;
  access: any;
  check_desc: string = null;
  flagUploadtype: boolean = false;
  flagnewEmp: boolean = false;
  flagPaginate: boolean = false;
  type_upload: any = [];
  type: string = null;
  emp_id: string = null;
  temp_col: any[] = [];
  col_size: number = 0;
  got_emp: boolean = false;
  exelData: [][];
  emp_name: string = null;
  reg_status: number;
  joininate_emp_name: string = null;
  col_type: any = [];
  // colwidth:number[] = []

  branch_drop_flag: boolean = false;
  emp_drop_flag: boolean = false;
  comp_drop_flag: boolean = false;

  companies: any = [];
  company_list$: Observable<any>;
  companies_loading: boolean = false;
  virtual_scroll_companies: boolean = true;
  clearable_company: boolean = false;

  branch_list: any = [];
  selectedCompanyId: string;

  selectedCompanyCode: string = "";
  selectedBranchId: string;
  selectedBranchCode: string;
  created_by: string;
  company_code: string;
  userId: string;
  userCode: string;
  companyID: string;
  columns: any;
  isCMS: boolean = false;
  show_blank_alert: boolean = false;
  flagbranchtype: boolean = false;
  company_flag: boolean = false;
  validbranchCode: boolean = false;
  validAtmCode: boolean = false;
  validPinCode: boolean = false;
  validMobileNo: boolean = false;
  validEmail: boolean = false;
  lenaddress: boolean = false;
  lenbankname: boolean = false;
  lenserialcode: boolean = false;
  response_add_atm: any;
  response_add_branch: any;
  dataset: any[] = [];
  dataupload: any = [];
  atmList: any = [];
  empList: any = [];
  type_activity: any = [];
  atm_code: any = [];
  atm_code_global: any = [];
  emp_code: any = [];
  emp_code_global: any = [];
  branch_name_global: any = [];
  branch_name: any = [];
  private data: any[];
  private options: any;
  text: string;
  colValid: boolean = true;
  atm_dict: any = {};
  activity_dict: any = {};
  emp_dict: any = {};
  branch_dict: any = {};
  flagEmpty: boolean = true;
  resetFlag: boolean;

  constructor(
    private router: Router,
    private http: HttpClient,
    private _branchService: BranchServiceService,
    private _atmService: AtmMasterServiceService,
    private _employeeService: ManageEmployeeServiceService,
    private _tenantService: ManageTenantServiceService,
    private _atmEmpService: AtmEmployeeMappingServiceService,
    private _dialyActivityService: DailyActivityServiceService
  ) {
    // this.data = Handsontable.helper['createSpreadsheetData'](100, 12); // tslint:disable-line:no-string-literal
    this.options = {
      height: 350,
      // colHeaders: true,
      rowHeaders: true,
      stretchH: "all",
      columnSorting: true,
      contextMenu: true,
    };
  }

  ngOnInit() {
    this.login_token = localStorage.getItem("CMSAppUserLogin");
    if (this.login_token) {
      this.access = JSON.parse(this.login_token);
      this.created_by = this.access.Entity.UserName;
      this.userCode = this.access.Entity.EmployeeCode;
      this.userId = this.access.Entity.UserID;
      this.company_code = this.access.Entity.CompanyCode;
      this.companyID = this.access.Entity.CompanyID;
      this.text = "Please select the Upload type";

      if (this.company_code == "CMS" || this.company_code == "cms") {
        this.isCMS = true;
      } else {
        this.company_flag = true;
      }
    } else {
      this.router
        .navigateByUrl("/", { skipLocationChange: false })
        .then(() => this.router.navigate(["/login"]));
    }

    this.getActivityType();
  }

  getActivityType() {
    this._dialyActivityService
      .getdailyActivityType(this.userId)
      .subscribe((data) => {
        for (let item of data["Entity"]) {
          this.type_activity.push(item["ActivityName"]);
          //added this line
          this.activity_dict[item["ActivityName"]] = item["ActivityID"];
        }
      });
  }
  getAtmList() {
    this._atmService.getatm(this.userId).subscribe((data) => {
      this.atm_code_global = data;

      for (let item of data["Entity"]) {
        // this.atm_code.push(item['ATMID'])
        //added this line
        this.atm_dict[item["ATMID"]] = item["ATMCode"];
      }
    });
  }
  getEmpList() {
    this._employeeService.getEmployee(this.userId).subscribe((data) => {
      this.emp_code_global = data;
      for (let item of data["Entity"]) {
        // this.emp_code.push(item['employeeCode'])
        this.emp_dict[item["employeeCode"]] = item["employeeCode"];
      }
    });
  }
  getBranches() {
    this.branch_list = [];
    this.branch_dict = {};
    this._branchService.getbranch(this.userId).subscribe((data) => {
      this.branch_name_global = data;
      for (let item of data["Entity"]) {
        if (this.isCMS) {
          this.branch_dict[item["BranchCode"]] = item["BranchID"];
          this.branch_dict[item["BranchName"]] = item["BranchCode"];
          if (
            item.CompanyID === this.selectedCompanyId &&
            item.Active === true
          ) {
            this.branch_dict[item["BranchName"]] = item["BranchCode"];
            this.branch_list.push(item);
          }
        } else {
          this.branch_dict[item["BranchName"]] = item["BranchCode"];
          if (
            item.CompanyID === Number(this.companyID) &&
            item.Active === true
          ) {
            this.branch_list.push(item);
          }
        }
      }
    });
  }

  getUploadType() {
    this.type_upload = constant.select_category;
    this.company_flag = false;
    this.selectedCompanyId = null;
    this.selectedCompanyCode = null;
    this.selectedBranchId = null;
    this.selectedBranchCode = null;
    this.flagbranchtype = false;

    switch (this.type) {
      case "Manage Branch":
        this.text = "BranchCode:Test123 BranchName:Test ";
        this.temp_col = constant.branch_master_col;
        this.columns = [
          {
            data: "Branch Code",
            validator: function (value, callback) {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (!/[^0-9A-Za-z]/g.test(value) && value.length <= 15) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
          {
            data: "Branch Name",
            validator: function (value, callback) {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else {
                callback(true);
              }
            },
          },
        ];
        this.array_to_dict();
        this.flagUploadtype = true;
        this.comp_drop_flag = true;
        this.branch_drop_flag = false;

        break;

      case "Manage ATM":
        this.text =
          "ATMID:Test123 BankName:Test Address:Location PinCode:6digit ATMLockSerialNo:Test ";
        this.getBranches();
        this.temp_col = constant.atm_master_col;
        this.columns = [
          {
            data: "Branch Name",
            validator: (value, callback) => {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (this.branch_name.includes(value)) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
          {
            data: "ATMID",
            validator: function (value, callback) {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (!/[^0-9A-Za-z]/g.test(value) && value.length <= 25) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
          {
            data: "Bank Name",
            validator: function (value, callback) {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (value.length <= 100) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
          {
            data: "Address",
            validator: function (value, callback) {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (value.length <= 200) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
          {
            data: "Pin Code",
            validator: function (value, callback) {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (value.length == 6 && !/[^0-9]/g.test(value)) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
          {
            data: "ATM Lock Serial No",
            validator: function (value, callback) {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (value.length <= 50) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
        ];
        this.array_to_dict();
        this.comp_drop_flag = true;
        this.flagUploadtype = true;
        break;

      case "Manage Employee":
        this.text = "EmpCode:Test123 EmpName:Test RegMobileNumber:10 digit ";
        console.log("getBranch call");
        this.getBranches();
        this.temp_col = constant.emp_master_col;
        this.columns = [
          {
            data: "Branch Name",
            validator: (value, callback) => {
              //console.log("inside validator", value, this.branch_name);
              console.log("inside validator");
              console.log("value: ", value);
              console.log("this.branch name: ", this.branch_name);
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (this.branch_name.includes(value)) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
          {
            data: "Emp Code",
            validator: function (value, callback) {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (!/[^0-9A-Za-z]/g.test(value) && value.length <= 25) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
          {
            data: "Emp Name",
            validator: function (value, callback) {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else {
                callback(true);
              }
            },
          },
          {
            data: "Reg Mobile Number",
            validator: function (value, callback) {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (value.length == 10 && !/[^0-9]/g.test(value)) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
        ];
        this.array_to_dict();
        this.comp_drop_flag = true;
        this.flagUploadtype = true;
        break;

      case "Daily Activities":
        this.text = "ActivityName:FLM ATMCode:Test123 Date:YY-MM-DD ";
        this.getBranches();
        this.getAtmList();
        this.temp_col = constant.daily_activity_col;
        var temp_activity_aaray = this.type_activity;
        var temp_atm_aaray = this.atm_code;

        //this.col_type = constant.daily_activity_data_type;
        this.columns = [
          {
            data: "Activity Name",
            validator: (value, callback) => {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (temp_activity_aaray.includes(value)) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
          {
            data: "ATM Code",
            validator: (value, callback) => {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (this.atm_code.includes(value)) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
          {
            data: "Activity Date",
            placeholder: "YYYY-MM-DD",
            validator: (value, callback) => {
              console.log("inside validator", value);
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (
                /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/g.test(value)
              ) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
        ];
        this.array_to_dict();
        this.comp_drop_flag = true;
        this.flagUploadtype = true;

        break;

      case "Mapping OF ATM Employee":
        this.text =
          "ATMCode:Test123 Emp1Code:Test123 Emp2Code:Test123 FromDate:YY-MM-DD ";
        this.getBranches();
        this.getAtmList();
        this.getEmpList();
        this.temp_col = constant.atm_emp_col;
        var temp_emp_array = this.emp_code;
        var temp_atm_aaray = this.atm_code;
        this.columns = [
          {
            data: "ATM Code",
            validator: (value, callback) => {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (this.atm_code.includes(value)) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
          {
            data: "Emp1 Code",
            validator: (value, callback) => {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (this.emp_code.includes(value)) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
          {
            data: "Emp2 Code",
            validator: (value, callback) => {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (this.emp_code.includes(value)) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
          {
            data: "From Date",
            placeholder: "YYYY-MM-DD",
            validator: (value, callback) => {
              if (value === undefined || value === "" || value === null) {
                callback(false);
              } else if (
                /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/g.test(value)
              ) {
                callback(true);
              } else {
                callback(false);
              }
            },
          },
        ];
        this.array_to_dict();
        this.comp_drop_flag = true;
        this.flagUploadtype = true;
        break;

      default:
        break;
    }
  }
  //for balnk row
  array_to_dict() {
    this.dataset = [];
    var dict = {};
    for (var i = 0; i < this.temp_col.length; i++) {
      dict[this.temp_col[i]] = "";
    }
    this.dataset.push(dict);
  }

  blankfieldCheck() {
    this.show_blank_alert = false;
    var flag2;
    if (!this.isCMS) {
      this.company_flag = true;
    }
    var flag1 = !this.company_flag || !this.flagbranchtype;
    if (this.type === "Manage Branch") {
      flag2 =
        this.nullCheck(this.type) || this.nullCheck(this.selectedCompanyCode);
    } else {
      flag2 =
        this.nullCheck(this.type) ||
        this.nullCheck(this.selectedCompanyCode) ||
        this.nullCheck(this.selectedBranchCode);
    }

    if (flag1 || flag2) {
      this.show_blank_alert = true;
    } else {
      this.show_blank_alert = false;
    }
    return this.show_blank_alert;
  }

  customize_dataset(type) {
    console.log("insde customize set");

    if (type == "Manage Branch") {
      console.log("data", this.dataset);
      this.dataset.forEach((data) => {
        if (data["Branch Code"] == "" || data["Branch Name"] == "") {
          this.flagEmpty = false;
        } else {
          data["BranchName"] = data["Branch Name"];
          delete data["Branch Name"];
          data["BranchCode"] = data["Branch Code"];
          delete data["Branch Code"];

          this.flagEmpty = true;
        }
      });
    } else if (type === "Daily Activities") {
      console.log("data", this.dataset);
      this.dataset.forEach((data) => {
        if (
          data["Activity Date"] == "" ||
          data["Activity Name"] == "" ||
          this.atm_dict[data["ATM Code"]] == ""
        ) {
          this.flagEmpty = false;
        } else {
          data["BranchName"] = data["Branch Name"];
          data["BranchCode"] = this.branch_dict[data["Branch Name"]];
          delete data["Branch Name"];
          data["ATMID"] = data["ATM Code"];
          data["ActivityName"] = data["Activity Name"];
          data["TransDate"] = data["Activity Date"];
          delete data["Activity Date"];
          delete data["Activity Name"];
          data["ATMCode"] = this.atm_dict[data["ATM Code"]];
          delete data["ATM Code"];
          data["TRTYPE"] = data["ActivityName"];
          data["ActivityId"] = this.activity_dict[data["ActivityName"]];
          data["CompanyCode"] = this.selectedCompanyCode;
          data["CompanyID"] = this.selectedCompanyId;
          this.flagEmpty = true;
        }
      });
    } else if (type === "Manage ATM") {
      this.dataset.forEach((data) => {
        console.log("dat us ", data);
        if (
          data["Branch Name"] == "" ||
          data["ATM Lock Serial No"] == "" ||
          data["Pin Code"] == ""
        ) {
          console.log("inside null ");
          this.flagEmpty = false;
        } else {
          data["BankName"] = data["Bank Name"];
          delete data["Bank Name"];
          data["PinCode"] = data["Pin Code"];
          delete data["Pin Code"];
          data["ATMLockSerialNo"] = data["ATM Lock Serial No"];
          delete data["ATM Lock Serial No"];
          data["CompanyCode"] = this.selectedCompanyCode;
          data["CompanyID"] = this.selectedCompanyId;
          data["BranchName"] = data["Branch Name"];
          data["BranchCode"] = this.branch_dict[data["Branch Name"]];
          data["BranchID"] = this.branch_dict[data["BranchCode"]];
          delete data["Branch Name"];
          this.flagEmpty = true;
        }
      });
    } else if (type === "Manage Employee") {
      this.dataset.forEach((data) => {
        console.log("data: ", data);
        if (
          data["Emp Code"] == null ||
          data["Emp Name"] == "" ||
          data["Reg Mobile Number"] == "" ||
          data["Branch Name"] == ""
        ) {
          this.flagEmpty = false;
        } else {
          data["EmpCode"] = data["Emp Code"];
          delete data["Emp Code"];
          data["EmpName"] = data["Emp Name"];
          delete data["Emp Name"];
          data["RegMobileNumber"] = data["Reg Mobile Number"];
          delete data["Reg Mobile Number"];
          data["CompanyCode"] = this.selectedCompanyCode;
          data["CompanyID"] = this.selectedCompanyId;
          data["BranchName"] = data["Branch Name"];
          data["BranchCode"] = this.branch_dict[data["Branch Name"]];
          data["BranchID"] = this.branch_dict[data["BranchCode"]];
          delete data["Branch Name"];

          this.flagEmpty = true;
        }
      });
    } else if (type === "Mapping OF ATM Employee") {
      this.dataset.forEach((data) => {
        if (
          data["ATM Code"] == "" ||
          data["From Date"] == "" ||
          data["Emp1 Code"] == "" ||
          data["Emp2 Code"] == ""
        ) {
          this.flagEmpty = false;
        } else {
          data["BranchName"] = data["Branch Name"];
          data["BranchCode"] = this.branch_dict[data["Branch Name"]];
          delete data["Branch Name"];
          data["ATMID"] = data["ATM Code"];
          data["ATMCode"] = this.atm_dict[data["ATM Code"]];
          delete data["ATM Code"];
          data["Emp1Code"] = data["Emp1 Code"];
          delete data["Emp1 Code"];
          data["Emp2Code"] = data["Emp2 Code"];
          delete data["Emp2 Code"];
          data["FromDate"] = data["From Date"];
          delete data["From Date"];

          data["CompanyCode"] = this.selectedCompanyCode;
          data["CompanyID"] = this.selectedCompanyId;

          this.flagEmpty = true;
        }
      });
    }
  }

  submitBulkdata() {
    var invalidLength = document.getElementsByClassName("htInvalid").length;
    console.log("invalidLength: ", invalidLength);
    this.blankfieldCheck();
    var isValid = false;
    switch (this.type) {
      case "Manage Branch":
        if (this.selectedCompanyCode || this.company_code) {
          // isValid = this.branch_data_validator()

          if (invalidLength == 0) {
            this.customize_dataset(this.type);
            this.dataupload = this.dataset;

            this.dataupload = this.dataset;
            var branch = new Branch();
            // var  addBranchMaster = new addBranchReqchildModels()
            if (this.isCMS) {
              branch.CompanyCode = this.selectedCompanyCode;
            } else {
              branch.CompanyCode = this.company_code;
            }
            branch.userId = this.userId;
            for (let data in this.dataupload) {
              branch.addBranchReqchildModels.push(this.dataupload[data]);
            }
            if (this.flagEmpty) {
              this.uploadData(branch, this.type);
            } else {
              console.log("insde else falgemoptr");
              window.alert("Plese fill the empty field");
              // this.array_to_dict();
            }
          }
          console.log("data", isValid, this.dataset.length);
          // if (isValid){
          //  if(this.dataset.length==0){
          //    this.flagEmpty =false
          //  }

          // }
        } else {
          alert("Please fill the required field");
        }

        break;
      case "Manage ATM":
        if (this.selectedCompanyCode || this.company_code) {
          console.log("submit data ", this.flagEmpty);
          //  isValid = this.atm_data_validation()
          if (invalidLength == 0) {
            this.customize_dataset(this.type);
            this.dataupload = this.dataset;
            var atm = new AtmMaster();
            //atm.CompanyCode =this.company_code
            atm.UserId = parseInt(this.userId);

            if (this.isCMS) {
              atm.CompanyCode = this.selectedCompanyCode;
            } else {
              atm.CompanyCode = this.company_code;
            }
            for (let data in this.dataupload) {
              atm.AtmMasterModel.push(this.dataupload[data]);
            }
            if (this.flagEmpty) {
              this.uploadData(atm, this.type);
            } else {
              window.alert("Plese fill the empty field");
            }
          }
        } else {
          alert("Please fill the required field");
        }
        break;
      case "Manage Employee":
        if (this.selectedCompanyCode || this.company_code) {
          console.log("Mangae employee");
          if (invalidLength == 0) {
            console.log("inside invalidlength == 0");
            this.customize_dataset(this.type);
            this.dataupload = this.dataset;
            var employeeadd = new EmployeeAdd();
            employeeadd.UserId = Number(this.userId);
            for (let data in this.dataupload) {
              employeeadd.EmployeeData.push(this.dataupload[data]);
            }
            if (this.flagEmpty) {
              this.uploadData(employeeadd, this.type);
            } else {
              window.alert("Plese fill the empty field");
            }
          }
        } else {
          alert("Please fill the required field");
        }
        break;
      case "Daily Activities":
        if (this.selectedCompanyCode || this.company_code) {
          if (invalidLength == 0) {
            this.customize_dataset(this.type);
            this.dataupload = this.dataset;

            var dailyActivtyAdd = new DailyActivityModal();
            dailyActivtyAdd.UserID = Number(this.userId);
            for (let data in this.dataupload) {
              dailyActivtyAdd.DailyActivity.push(this.dataupload[data]);
            }
            if (this.flagEmpty) {
              this.uploadData(dailyActivtyAdd, this.type);
            } else {
              window.alert("Plese fill the empty field");
            }
          }
        } else {
          alert("Please fill the required field");
        }
        break;
      case "Mapping OF ATM Employee":
        if (this.selectedCompanyCode || this.company_code) {
          if (invalidLength == 0) {
            this.customize_dataset(this.type);
            this.dataupload = this.dataset;
            var mappingAtmEmp = new AtmEmpMapping();
            mappingAtmEmp.UserId = Number(this.userId);
            for (let data in this.dataupload) {
              mappingAtmEmp.AtmEmployeeData.push(this.dataupload[data]);
            }

            if (this.flagEmpty) {
              this.uploadData(mappingAtmEmp, this.type);
            } else {
              window.alert("Plese fill the empty field");
            }
          }
        } else {
          alert("Please fill the required field");
        }
        break;
    }
    if (invalidLength != 0 && this.dataset.length != 0) {
      window.alert("Please correct the highlighted fields");
    }
  }

  branch_data_validator() {
    for (var i = 0; i < this.dataset.length; i++) {
      var isProper = 0;
      var c = 0;
      for (let [key, value] of Object.entries(this.dataset[i])) {
        var col_name = key.replace(/\s/g, "");
        if (key === "Branch Code") {
          if (this.nullCheck(this.dataset[i][key])) {
            c += 1;
          } else if (this.branchDetailValidation(this.dataset[i][key])) {
            this.dataset[i][col_name] = this.dataset[i][key];
            delete this.dataset[i][key];
            isProper += 1;
          }
        } else {
          if (this.nullCheck(this.dataset[i][key])) {
            c += 1;
          } else {
            this.dataset[i][col_name] = this.dataset[i][key];
            delete this.dataset[i][key];
            isProper += 1;
          }
        }
      }
      if (c == 2) {
        this.dataset = this.dataset.filter((j) => j != this.dataset[i]);
        continue;
      }
      if (isProper < 2) {
        return false;
      }
    }
    return true;
  }

  atm_data_validation() {
    for (var i = 0; i < this.dataset.length; i++) {
      var isProper = 0;
      var c = 0;
      for (let [key, value] of Object.entries(this.dataset[i])) {
        var col_name = key.replace(/\s/g, "");
        if (this.isCMS) {
          this.dataset[i]["CompanyID"] = this.selectedCompanyId;
        } else {
          this.dataset[i]["CompanyID"] = this.companyID;
        }
        this.dataset[i]["BranchName"] = this.selectedBranchCode;
        this.dataset[i]["BranchID"] = this.selectedBranchId;
        if (key === "ATMID") {
          if (this.nullCheck(this.dataset[i][key])) {
            c += 1;
          } else if (this.atmDetailsValidation(this.dataset[i][key])) {
            isProper += 1;
          }
        } else if (key === "Bank Name") {
          if (this.nullCheck(this.dataset[i][key])) {
            c += 1;
          } else if (this.checkForBanknameLength(this.dataset[i][key])) {
            this.dataset[i][col_name] = this.dataset[i][key];
            delete this.dataset[i][key];
            isProper += 1;
          }
        } else if (key === "Address") {
          if (this.nullCheck(this.dataset[i][key])) {
            c += 1;
          } else if (this.checkforAddressLength(this.dataset[i][key])) {
            isProper += 1;
          }
        } else if (key === "Pin Code") {
          if (this.nullCheck(this.dataset[i][key])) {
            c += 1;
          } else if (this.pinCodeValidation(this.dataset[i][key])) {
            this.dataset[i][col_name] = this.dataset[i][key];
            delete this.dataset[i][key];
            isProper += 1;
          }
        } else if (key === "ATM Lock Serial No") {
          if (this.nullCheck(this.dataset[i][key])) {
            c += 1;
          } else if (this.checkforserialnoLength(this.dataset[i][key])) {
            this.dataset[i][col_name] = this.dataset[i][key];
            delete this.dataset[i][key];
            isProper += 1;
          }
        }
      }
      if (c == 5) {
        this.dataset = this.dataset.filter((j) => j != this.dataset[i]);
        continue;
      }
      if (isProper < 5) {
        return false;
      }
    }
    return true;
  }

  employee_data_validation() {
    for (var i = 0; i < this.dataset.length; i++) {
      var isProper = 0;
      var c = 0;
      for (let [key, value] of Object.entries(this.dataset[i])) {
        var col_name = key.replace(/\s/g, "");
        this.dataset[i]["BranchID"] = Number(this.selectedBranchId);
        this.dataset[i]["BranchCode"] = this.selectedBranchCode;
        // this.dataset[i]['EmpCode']=''
        this.dataset[i]["IsUser"] = false;

        if (this.isCMS) {
          this.dataset[i]["CompanyCode"] = this.selectedCompanyCode;
          this.dataset[i]["CompanyID"] = this.selectedCompanyId;
        } else {
          this.dataset[i]["CompanyCode"] = this.company_code;
          this.dataset[i]["CompanyID"] = this.companyID;
        }

        var col_name = key.replace(/\s/g, "");
        if (key === "Emp Code") {
          if (this.nullCheck(this.dataset[i][key])) {
            c += 1;
          } else if (this.employeeDetailsValidation(this.dataset[i][key])) {
            this.dataset[i][col_name] = this.dataset[i][key];
            delete this.dataset[i][key];
            isProper += 1;
          }
        } else if (key === "Emp Name") {
          if (this.nullCheck(this.dataset[i][key])) {
            c += 1;
          } else {
            this.dataset[i][col_name] = this.dataset[i][key];
            delete this.dataset[i][key];
            isProper += 1;
          }
        } else if (key === "Reg Mobile Number") {
          if (this.nullCheck(this.dataset[i][key])) {
            c += 1;
          } else if (this.mobileNoValidation(this.dataset[i][key])) {
            this.dataset[i][col_name] = this.dataset[i][key];
            delete this.dataset[i][key];
            isProper += 1;
          }
        }
      }
      if (c == 3) {
        this.dataset = this.dataset.filter((j) => j != this.dataset[i]);
        continue;
      }
      if (isProper < 3) {
        return false;
      }
    }
    return true;
  }

  uploadData(dataupload, type) {
    if (type === "Manage Branch") {
      this._branchService.addbranch(dataupload).subscribe((data) => {
        this.response_add_branch = data;
        if (this.response_add_branch["Success"]) {
          window.alert(this.response_add_branch.Message);
          window.location.reload();
        } else {
          window.alert(this.response_add_branch.Message);
        }
      });
    } else if (type === "Manage ATM") {
      this._atmService.addatm(dataupload).subscribe((data) => {
        this.response_add_atm = data;
        if (this.response_add_atm["Success"]) {
          window.alert(this.response_add_atm["Message"]);
          window.location.reload();
        } else {
          window.alert(this.response_add_atm["Message"]);
        }
      });
    } else if (type === "Manage Employee") {
      this._employeeService.addEmployee(dataupload).subscribe((resp) => {
        if (resp.Success) {
          window.alert(resp.Message);
          window.location.reload();
        } else {
          window.alert(resp["Message"]);
        }
      });
    } else if (type === "Daily Activities") {
      this._dialyActivityService
        .adddailyActivity(dataupload)
        .subscribe((data) => {
          if (data.Succes) {
            window.alert(data.Message);
            window.location.reload();
          } else {
            window.alert(data["Message"]);
          }
        });
    } else if (type === "Mapping OF ATM Employee") {
      this._atmEmpService.addatmEmpMapping(dataupload).subscribe((data) => {
        if (data.Success) {
          window.alert(data.Message);
          window.location.reload();
        } else {
          window.alert(data["Message"]);
        }
      });
    }
  }
  getBranchFlag(z) {
    this.flagbranchtype = true;
    this.selectedBranchId = z.BranchID;
    this.selectedBranchCode = z.BranchCode;

    // comment this for data  atm _code filter  atm_code_global contains all the data
    for (let item of this.atm_code_global["Entity"]) {
      if (item["BranchCode"] === this.selectedBranchCode) {
        this.atm_code.push(item["ATMID"]);
      }
    }
    if (this.emp_code_global.length != 0) {
      for (let item of this.emp_code_global["Entity"]) {
        if (item["BranchCode"] === this.selectedBranchCode) {
          this.emp_code.push(item["employeeCode"]);
        }
      }
    }
  }

  getCompanies() {
    this.companies = [];
    this.companies_loading = true;
    this._tenantService.getAssignedCustomers(this.userId).subscribe((data) => {
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
    // this.array_to_dict()

    this.resetFlag = true;
    this.selectedCompanyId = z.CompanyId;
    this.selectedCompanyCode = z.CompanyCode;
    this.selectedBranchId = null;
    this.selectedBranchCode = null;
    this.flagbranchtype = false;
    this.branch_name = [];
    this.atm_code = [];
    this.emp_code = [];
    for (let item of this.branch_name_global["Entity"]) {
      if (item["CompanyCode"] === this.selectedCompanyCode) {
        this.branch_name.push(item["BranchName"]);
      }
    }

    if (
      this.type === "Mapping OF ATM Employee" ||
      this.type === "Daily Activities"
    ) {
      console.log("inside dailya activity ||Maaping of atm");
      for (let item of this.atm_code_global["Entity"]) {
        if (item["CompanyID"] == this.selectedCompanyId) {
          this.atm_code.push(item["ATMID"]);
        }
      }

      console.log("final atm code", this.atm_code);
      if (this.emp_code_global.length != 0) {
        for (let item of this.emp_code_global["Entity"]) {
          if (item["CompanyID"] == this.selectedCompanyId) {
            this.emp_code.push(item["employeeCode"]);
          }
        }
      }
      console.log("final atm code", this.emp_code);
    }
  }

  nullCheck(data) {
    if (data === undefined || data === "" || data === null) {
      return true;
    } else {
      return false;
    }
  }

  branchDetailValidation(data) {
    if (this.checkForalphnum(data) && data.length <= 15) {
      return true;
    }
    return false;
  }

  atmDetailsValidation(data) {
    if (this.checkForalphnum(data) && data.length <= 25) {
      return true;
    }
    return false;
  }
  employeeDetailsValidation(data) {
    if (this.checkForalphnum(data) && data.length <= 25) {
      return true;
    }
    return false;
  }

  pinCodeValidation(data) {
    if (this.checkforNum(data) && data.length <= 6) {
      return true;
    }
    return false;
  }

  mobileNoValidation(data) {
    if (this.checkforNum(data) && data.length === 10) {
      return true;
    }
    return false;
  }

  emailValidation(data) {
    var reg = /\S+@\S+\.\S+/;
    return reg.test(data);
  }

  checkForalphnum(data) {
    var reg = /[0-9A-Za-z]/;
    return reg.test(data) && !/[^0-9A-Za-z]/g.test(data);
  }

  checkforNum(data) {
    var reg = /[0-9]/;
    return reg.test(data) && !/[^0-9]/g.test(data);
  }

  checkforAddressLength(data) {
    return data.length <= 200;
  }

  checkForBanknameLength(data) {
    return data.length <= 100;
  }

  checkforserialnoLength(data) {
    return data.length <= 50;
  }
}
