import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
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
import {
  BsDatepickerDirective,
  BsDatepickerConfig,
} from "ngx-bootstrap/datepicker";
import * as XLSX from "xlsx";

import { BranchServiceService } from "../services/branch/branch-service.service";
import { ManageTenantServiceService } from "../services/masterUser/manage-tenant-service.service";
import { ManageStaffServiceService } from "../services/manageStaff/manage-staff-service.service";
import { ManageEmployeeServiceService } from "../services/manageEmployee/manage-employee-service.service";
import {
  EmployeeAdd,
  EmployeeEdit,
  UserData,
  UserDetails,
} from "../modals/employee/employeemodal";
import { ENGINE_METHOD_PKEY_ASN1_METHS } from "constants";

@Component({
  selector: "app-employee-master",
  templateUrl: "./employee-master.component.html",
  styleUrls: ["./employee-master.component.scss"],
})
export class EmployeeMasterComponent implements OnInit {
  //variables
  login_token: any;
  access: any;
  check_desc: string = null;
  flagEditEmp: boolean = false;
  flagnewEmp: boolean = false;
  flagPaginate: boolean = false;
  emp_list: any = [];
  deactivate_list: any = [];
  got_emp: boolean = false;
  exelData: [][];
  emp_name: string = null;
  reg_status: number;
  joininate_emp_name: string = null;
  reg_mobile_no: string;
  Macid: string;
  imei: string;
  mpin: number;
  createdBy: string;
  updatedBy: string;
  createdDate: string;
  updatedDate: string;
  photo: Blob;
  date: Date = new Date();
  allow_staff: boolean = false;
  user_name: string;
  user_email: string;

  created_by: string;
  company_code: string;
  userId: number;
  userCode: string;
  emp_name_f: string;
  branch_code_f: string;
  emp_code_f: string;

  companies: any = [];
  company_list$: Observable<any>;
  companies_loading: boolean = false;
  virtual_scroll_companies: boolean = true;
  clearable_company: boolean = false;

  branches: any = [];
  branch_list$: Observable<any>;
  disabledBranchSelection: boolean = true;
  virtual_scroll_branch: boolean = true;
  clearable_branch: boolean = false;
  branches_loading: boolean = false;

  editBranches: any = [];
  edit_branch_list$: Observable<any>;
  edit_branches_loading: boolean = false;
  edit_branch_selected_value: string = "";

  roles: any = [];
  role_list$: Observable<any>;
  clearable_role: boolean = false;
  roles_loading: boolean = false;
  temp_emp_list: any = [];

  selectedCompanyId: number;
  selectedCompanyCode: string;
  selectedBranchId: number;
  selectedBranchCode: string;
  selectedBranchName: string = null;
  selected_emp_id: string;

  selectedEditBranchId: number;
  selectedEditBranchCode: string;
  selectedEditBranchName: string;

  viewEmpName: string;
  viewEmpCode: string;
  viewEmpMobile: string;
  viewBranchCode: string;
  viewBranchID: number;
  viewCompanyCode: string;
  viewCompanyID: number;
  viewId: number;

  isUser: boolean;
  isActive: boolean;
  roletype: string;
  roleId: number;

  permission: string;
  permission_flag: boolean = false;
  roleFlag: boolean = false;
  company_flag: boolean = false;
  flagbranchtype: boolean = false;
  isCMS: boolean = false;
  employeeEdit: any;
  emp_code: string;
  showbranch: boolean = true;
  companyID: string;
  comp_code: string;
  br_code: String;

  mobileNoRemark: string;
  showmobAlert: boolean = false;
  showmobEditAlert: boolean = false;
  show_blank_alert: boolean = false;
  showEmailAlert: boolean = false;

  disabledUpdate: boolean = false;

  privilegeUnchecked = false;
  privilegeChecked = true;
  privilege = false;
  flagBranch: boolean = false;
  flagBranchyes: boolean = false;
  employeeFlag: boolean = false;
  deactiveapicall: boolean = false;
  showBranchFlag: boolean = false;
  de_Register: boolean = false;
  show_filter: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private _branchService: BranchServiceService,
    private _tenantService: ManageTenantServiceService,
    private _manageStaff: ManageStaffServiceService,
    private employeeService: ManageEmployeeServiceService
  ) {}

  ngOnInit() {
    this.login_token = localStorage.getItem("CMSAppUserLogin");
    if (this.login_token) {
      this.access = JSON.parse(this.login_token);
      this.createdBy = this.access["name"];
      console.log("--flag", this.privilege);

      //  =
      this.created_by = this.access.Entity.UserName;
      this.userCode = this.access.Entity.EmployeeCode;
      this.userId = parseInt(this.access.Entity.UserID);
      this.company_code = this.access.Entity.CompanyCode;
      this.companyID = this.access.Entity.CompanyID;
      this.getEmployee();

      if (this.company_code == "CMS" || this.company_code == "cms") {
        this.isCMS = true;
      } else {
        this.disabledBranchSelection = false;
      }

      console.log("---", this.access["Entity"]["field_emp_master"]);
      this.permission = this.access["Entity"]["field_emp_master"];
      if (this.permission != "Read") {
        this.permission_flag = true;
      }
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
      this.emp_list = this.temp_emp_list.filter((res) => {
        return res.CompanyCode.toLocaleUpperCase().match(
          this.comp_code.toLocaleUpperCase()
        );
      });
    }
    if (id == 2) {
      console.log(
        "isndie id 2",
        ev,
        this.emp_name_f.toLocaleUpperCase(),
        this.temp_emp_list
      );
      this.emp_list = this.temp_emp_list.filter((res) => {
        return res.employeeName
          .toLocaleUpperCase()
          .match(this.emp_name_f.toLocaleUpperCase());
      });
    }

    if (id == 3) {
      console.log(this.branch_code_f);
      console.log();
      if (this.branch_code_f.length == 0) {
        this.emp_list = this.temp_emp_list;
      } else {
        this.emp_list = this.temp_emp_list.filter((res) => {
          if (res.BranchCode) {
            console.log("res.branchcode: ", res.BranchCode);
            return res.BranchCode.toLocaleUpperCase().match(
              this.branch_code_f.toLocaleUpperCase()
            );
          }
        });
      }
    }

    if (id == 4) {
      //console.log(this.temp_emp_list);
      console.log(this.emp_code_f);

      this.emp_list = this.temp_emp_list.filter((res) => {
        return res.employeeCode
          .toLocaleUpperCase()
          .match(this.emp_code_f.toLocaleUpperCase());
      });
    }

    if (this.comp_code.length == 0 && this.emp_name_f.length == 0) {
      // this.getBranch()

      console.log("data", this.temp_emp_list);
      this.branches = this.temp_emp_list;
      //this.emp_list = this.temp_emp_list;
    }
  }

  getTypeEmployee() {
    console.log("value of switch flag", this.employeeFlag);
  }
  getEmployee() {
    console.log("inside get employee");
    this.employeeEdit = new EmployeeEdit();
    this.employeeEdit.UserId = this.userId;
    this.got_emp = true;
    this.employeeService.getEmployee(this.userId).subscribe((data) => {
      for (let a of data["Entity"]) {
        if (a.active === true) {
          this.emp_list.push(a);
        }
        if (a.active === false) {
          this.deactivate_list.push(a);
        }
      }
    });
    this.temp_emp_list = this.emp_list;
    console.log("emp list", this.emp_list);
    console.log("emp_deactivate", this.deactivate_list);
  }

  getCheckboxesValue(vlue) {
    this.roletype = null;
    console.log("--vlue", vlue);
    // console.log('ngModel value', this.privilege);
    this.flagBranch = vlue;
    this.allow_staff = vlue;
    if (!vlue) {
      this.flagBranchyes = false;
    }
  }

  getBranches() {
    console.log("inside getBranches");
    this.branches = [];
    this.branches_loading = true;
    this._branchService.getbranch(this.userId).subscribe((data) => {
      console.log(this.selectedCompanyId, this.companyID);
      for (let item of data["Entity"]) {
        if (this.isCMS) {
          if (
            item.CompanyID === this.selectedCompanyId &&
            item.Active === true
          ) {
            item.BranchLabel = item.BranchName + "(" + item.BranchCode + ")";
            // console.log("itme.branchLabel: ", item.BranchLabel);
            this.branches.push(item);
          }
        } else {
          if (
            item.CompanyID === Number(this.companyID) &&
            item.Active === true
          ) {
            item.BranchLabel = item.BranchName + "(" + item.BranchCode + ")";
            //console.log("itme.branchLabel: ", item.BranchLabel);
            this.branches.push(item);
          }
        }
      }
      this.branches_loading = false;
      this.branch_list$ = of(this.branches);
      //console.log("branch list: ", this.branch_list$);
    });
  }

  getBranchFlag(z) {
    this.flagbranchtype = true;
    this.branches_loading = false;
    this.selectedBranchId = z.BranchID;
    this.selectedBranchCode = z.BranchCode;
    this.selectedBranchName = z.BranchName;
  }

  getEditBranches() {
    console.log("inside getEditBranches");
    this.editBranches = [];
    this.edit_branches_loading = true;
    this._branchService.getbranch(this.userId).subscribe((data) => {
      console.log(this.selectedCompanyId, this.companyID);
      for (let item of data["Entity"]) {
        if (item.CompanyID === this.viewCompanyID && item.Active === true) {
          item.BranchLabel = item.BranchName + "(" + item.BranchCode + ")";
          // console.log("itme.branchLabel: ", item.BranchLabel);
          this.editBranches.push(item);
        }
      }
      this.edit_branches_loading = false;
      this.edit_branch_list$ = of(this.editBranches);
      //console.log("branch list: ", this.branch_list$);
    });
  }

  getEditBranchFlag(z) {
    //this.flagbranchtype = true;
    console.log("getEditBranchFlag: ", z);
    this.edit_branches_loading = false;

    this.selectedEditBranchId = z.BranchID;
    this.selectedEditBranchCode = z.BranchCode;
    this.selectedEditBranchName = z.BranchName;
    this.edit_branch_selected_value = z.BranchCode;
  }

  getCompanies() {
    if (this.companies.length <= 0 && this.companies_loading === false) {
      console.log("inside get companies");

      this.companies = [];
      this.companies_loading = true;
      this._tenantService
        .getAssignedCustomers(this.userId)
        .subscribe((data) => {
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
  }

  getCompanyFlag(z) {
    this.company_flag = true;
    this.companies_loading = false;
    this.branch_list$ = null;
    this.disabledBranchSelection = false;
    this.selectedBranchName = null;
    this.selectedCompanyId = z.CompanyId;
    this.selectedCompanyCode = z.CompanyCode;
    this.selectedBranchId = null;
    this.selectedBranchCode = null;
    this.flagbranchtype = false;
  }

  //function to edit the branchmaster data
  EmpDetails(aid) {
    // this.got_atm =false
    console.log("insde ", aid.BranchID);
    //this.emp_id =aid.emp_id
    this.viewEmpCode = aid.employeeCode;
    this.viewCompanyCode = aid.CompanyCode;
    this.viewCompanyID = aid.CompanyID;
    this.viewEmpMobile = aid.registeredMobileNumber;
    this.selectedCompanyId = aid.CompanyID;
    this.viewBranchCode = aid.BranchCode;
    this.viewBranchID = aid.BranchID;
    this.viewEmpName = aid.employeeName;
    this.viewId = aid.employeeId;
    this.edit_branch_selected_value = this.viewBranchCode;
    //console.log("employeeid: ", aid.employeeId);

    console.log("insdei brancode null", this.viewBranchID);
    if (aid.BranchID != 0) {
      this.showBranchFlag = true;
    } else {
      this.showBranchFlag = false;
    }

    this.flagEditEmp = true;
    this.deactiveapicall = false;

    //api call to get the branch details
  }

  validateMobileNumber() {
    //console.log("Inside function");
    this.disabledUpdate = true;
    var regexp = new RegExp("[0-9]{10}");
    if (this.viewEmpMobile !== undefined) {
      if (this.viewEmpMobile === "") {
        this.showmobEditAlert = true;
      } else if (this.viewEmpMobile.length != 10) {
        this.mobileNoRemark = "Invalid mobile number";
        this.showmobEditAlert = true;
      } else {
        if (regexp.test(this.viewEmpMobile)) {
          this.showmobEditAlert = false;
          this.disabledUpdate = false;
        } else {
          this.showmobEditAlert = true;
        }
      }
    }

    //this.reg_mobile_no = "" + this.reg_mobile_no;
    if (this.reg_mobile_no !== undefined) {
      if (this.reg_mobile_no === "") {
        console.log("inside if");

        this.showmobAlert = false;
      } else if (this.reg_mobile_no.length != 10) {
        console.log("inside esle if");

        this.mobileNoRemark = "Invalid mobile number";
        this.showmobAlert = true;
      } else {
        if (regexp.test(this.reg_mobile_no)) {
          console.log("inside else inside if");

          //this.disabledUpdate = false;
          this.showmobAlert = false;
        } else {
          this.showmobAlert = true;
        }
      }
    }
  }

  validateEmailId() {
    var regex = /\S+@\S+\.\S+/;
    if (this.user_email === "") {
      this.showEmailAlert = false;
    } else {
      this.showEmailAlert = !regex.test(this.user_email);
    }
  }

  validationChecks() {
    if ((this.allow_staff && this.showEmailAlert) || this.showmobAlert) {
      return true;
    } else {
      return false;
    }
  }

  addEmployee() {
    console.log("this");
    if (!this.blankfieldCheck()) {
      if (!this.validationChecks()) {
        var employeeadd = new EmployeeAdd();
        var userData = new UserData();
        employeeadd.UserId = Number(this.userId);
        if (this.isCMS === true) {
          userData.CompanyCode = this.selectedCompanyCode;
          userData.CompanyID = Number(this.selectedCompanyId);
        } else {
          userData.CompanyCode = this.company_code;
          userData.CompanyID = Number(this.companyID);
        }

        userData.EmpName = this.emp_name;
        if (
          !this.allow_staff ||
          (this.allow_staff &&
            !this.nullCheck(this.roletype) &&
            this.roletype.includes("Branch"))
        ) {
          userData.BranchID = Number(this.selectedBranchId);
          userData.BranchCode = this.selectedBranchCode;
        }
        //userData.CompanyID = Number(this.selectedCompanyId)
        userData.RegMobileNumber = this.reg_mobile_no;
        userData.EmpCode = this.emp_code.toLocaleUpperCase();
        userData.IsUser = this.allow_staff;
        if (this.allow_staff === true) {
          // userData.UserName = this.user_name
          userData.UserEmail = this.user_email;
          userData.RoleTypeId = Number(this.roleId);
          userData.UserName = this.emp_name;
        }

        employeeadd.EmployeeData.push(userData);
        console.log(employeeadd);
        this.employeeService.addEmployee(employeeadd).subscribe((resp) => {
          console.log("Message");
          console.log(resp);
          if (
            resp.Success === true &&
            resp.Message === "Data Added Successfully"
          ) {
            this.getEmployee();
            window.alert("Employee created successfully");
            window.location.reload();
          } else if (
            resp.Success === true &&
            resp.Message === "EmployeeName already Exists"
          ) {
            window.alert("Employeea already exist ");
          } else {
            window.alert("Failed to add data");
          }
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

  editActiveStatus(emp) {
    // let employeeEditModel=new EmployeeEdit()
    var employeeDetails = new UserDetails();
    this.employeeEdit.EmployeeData = [];
    // this.employeeEdit.EmployeeData =[]
    // this.employeeEdit.splice(0, this.employeeEdit.length)
    this.deactiveapicall = true;
    employeeDetails.Active = false;
    // employeeDetails.EmpID = Number(emp.employeeId)
    employeeDetails.EmpCode = emp.employeeCode;
    employeeDetails.BranchID = Number(emp.BranchID);
    employeeDetails.CompanyID = Number(emp.CompanyID);
    employeeDetails.RegMobileNumber = this.viewEmpMobile;
    employeeDetails.EmpName = this.viewEmpName;
    employeeDetails.DeRegister = false;
    this.employeeEdit.EmployeeData.push(employeeDetails);
  }

  confirmSubmitEmp() {
    console.log("current branch: ", this.viewBranchCode);
    console.log("selected branchcode: ", this.selectedEditBranchCode);
    console.log("edit branchcode: ", this.edit_branch_selected_value);

    if (!this.deactiveapicall) {
      this.employeeEdit.EmployeeData = [];
      var employeeDetails = new UserDetails();

      employeeDetails.Active = true;

      employeeDetails.EmpCode = this.viewEmpCode;

      if (this.viewBranchCode != this.edit_branch_selected_value) {
        employeeDetails.BranchCode = this.selectedEditBranchCode;
        employeeDetails.BranchID = this.selectedEditBranchId;
      } else {
        employeeDetails.BranchCode = "";
        employeeDetails.BranchID = this.viewBranchID;
      }
      employeeDetails.CompanyID = this.viewCompanyID;
      employeeDetails.RegMobileNumber = this.viewEmpMobile;
      employeeDetails.EmpName = this.viewEmpName;
      employeeDetails.DeRegister = this.de_Register;
      this.employeeEdit.EmployeeData.push(employeeDetails);
    }
    console.log("final paylaod", this.employeeEdit);

    this.employeeService.editEmployee(this.employeeEdit).subscribe((resp) => {
      if (resp.Success === true) {
        //this.emp_list = this.emp_list.filter(item => item !== emp)
        console.log(resp);
        this.emp_list = [];
        this.getEmployee();
        this.flagEditEmp = false;
        //  window.location.reload()
      } else {
        window.alert("Failed to update data ");
      }
    });
  }

  createNewEmp() {
    this.flagnewEmp = true;
  }

  saveNewEmp() {
    this.addEmployee();
    window.alert("employee Added Sucessfully");
    // window.location.reload()
  }

  fetchRoles() {
    if (this.roles.length <= 0 && this.roles_loading === false) {
      console.log("fetchRoles");
      this.roles = [];
      this.roles_loading = true;
      this._manageStaff.getRoles(this.userId).subscribe((data) => {
        console.log(data);
        for (let item of data["Entity"]) {
          this.roles.push(item);
        }
        this.roles_loading = false;
        this.role_list$ = of(this.roles);
      });
    }
  }

  getRoleFlag(z) {
    console.log("inside getRoleFlag");
    this.roleFlag = true;
    this.roletype = z.RoleName;
    this.roleId = z.RoleID;
    if (
      this.roletype === "Customer Branch Executive" ||
      this.roletype === "Customer Branch Approver"
    ) {
      this.flagBranchyes = true;
    } else {
      this.flagBranchyes = false;
    }
  }

  blankfieldCheck() {
    this.show_blank_alert = false;
    if (!this.isCMS) {
      this.company_flag = true;
    }

    var flag1 =
      !this.company_flag ||
      (!this.flagbranchtype &&
        (!this.allow_staff ||
          (this.allow_staff &&
            !this.nullCheck(this.roletype) &&
            this.roletype.includes("Branch"))));
    var flag2 =
      this.nullCheck(this.emp_code) ||
      this.nullCheck(this.emp_name) ||
      this.nullCheck(this.reg_mobile_no);

    if (flag1 || flag2) {
      this.show_blank_alert = true;
    } else {
      if (this.allow_staff) {
        if (this.nullCheck(this.user_email) || this.nullCheck(this.roletype)) {
          this.show_blank_alert = true;
        }
      } else {
        this.show_blank_alert = false;
      }
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
