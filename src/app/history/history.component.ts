import { Component, OnInit, ViewChild, HostListener } from "@angular/core";

import { Router } from "@angular/router";
import "rxjs/add/operator/catch";
import { EMPTY, Observable, of } from "rxjs";
import { strict } from "assert";
import {
  BsDatepickerDirective,
  BsDatepickerConfig,
} from "ngx-bootstrap/datepicker";
import { parseDate } from "ngx-bootstrap/chronos/public_api";
import { AnyMxRecord } from "dns";
import { BranchServiceService } from "../services/branch/branch-service.service";
import { AtmMasterServiceService } from "../services/atm/atm-master-service.service";
import { ManageTenantServiceService } from "../services/masterUser/manage-tenant-service.service";
import { ManageEmployeeServiceService } from "../services/manageEmployee/manage-employee-service.service";
import { AtmEmployeeMappingServiceService } from "../services/atm-emp-mapping/atm-employee-mapping-service.service";
import {
  AtmEmpMapping,
  AtmEmployeeData,
} from "../modals/atm-emp-mapping/atmEmpModal";

//var constants = require('../history/huge_test_file.json');
// import * as constants from "C:/Users/admin/Documents/test_case/huge_test.json" ;

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"],
})
export class HistoryComponent implements OnInit {
  @ViewChild(BsDatepickerDirective) datepicker: BsDatepickerDirective;
  datepickerconfig: Partial<BsDatepickerConfig>;
  colorTheme: string = "theme-dark-blue";

  @HostListener("window:scroll", ["$event"])
  onScrollEvent() {
    this.datepicker.hide();
  }

  from_date: any = null;
  to_date: any = null;

  date: Date = new Date();

  login_token: any;

  access: any;

  atm_id_list: any = [];
  emp_id_list: any = [];
  name_cust_list: any = [];
  atm_id: string;
  emp_id1: string;
  name_cust1: string;

  emp_id2: string;
  name_cust2: string;
  got_data: boolean = false;
  mapping_list: any = [];

  minDate: Date;
  userID: string;
  //disabledDateSelection: boolean = false;

  branchName: string;
  userCode: string;
  company_code: string;
  //atm_id:string
  branch_id: string;
  companyId: string;

  //flags
  company_flag: boolean = false;
  flagbranchtype: boolean = false;
  flagatm: boolean = false;
  flagemp1: boolean = false;
  flagemp2: boolean = false;

  companies: any = [];
  company_list$: Observable<any>;
  clearable_company: boolean = false;
  disabledCompanySelection: boolean = false;
  companies_loading: boolean = false;
  virtual_scroll_company: boolean = true;

  branches: any = [];
  branch_list$: Observable<any>;
  branches_loading: boolean = false;
  virtual_scroll_branch: boolean = true;
  clearable_branch: boolean = false;
  disabledBranchSelection: boolean = true;

  atms: any = [];
  atm_list$: Observable<any>;
  virtual_scroll_atm: boolean = true;
  atm_loading: boolean = false;
  clearable_atm: boolean = false;
  disabledAtmSelection: boolean = true;

  employees1: any = [];
  employee_list1$: Observable<any>;
  emp1_loading: boolean = false;
  clearable_emp1: boolean = false;
  disabledEmp1Selection: boolean = true;
  disabledEmp2Selection: boolean = true;
  virtual_scroll_emp1: boolean = true;
  emp1_selected_value: string = null;

  employees2: any = [];
  employee_list2$: Observable<any>;
  emp2_loading: boolean = false;
  clearable_emp2: boolean = false;
  virtual_scroll_emp2: boolean = true;
  emp2_selected_value: string = null;

  temp_mapping_list: any = [];
  //employee_list2: any = [];
  response_atmEmp_data = [];
  atm_codef: string;
  atm_code: string = null;
  comp_code: string;
  emp_code1: string;
  emp_code2: string;
  re_map_checkbox: boolean = false;

  selectedCompanyId: string;
  selectedCompanyCode: string;
  selectedBranchId: string;
  selectedBranchCode: string;
  selectedBranchName: string = null;
  selectedATMCode: string;
  selectedATMId: string;
  selectedEmp1Id: number;
  selectedEmp1Code: string;
  selectedEmp2Id: number;
  selectedEmp2Code: string;

  isCMS: boolean = false;
  responseAddEmp: any;
  permission: string;
  permission_flag: boolean = false;
  showbranch: boolean = true;
  companyID: string;

  show_blank_alert: boolean = false;
  show_filter: boolean = false;

  editMappingFlag: boolean = false;

  //empDeactivate: boolean = false;

  constructor(
    private router: Router,
    private _branchService: BranchServiceService,
    private _atmService: AtmMasterServiceService,
    private _tenantService: ManageTenantServiceService,
    private employeeService: ManageEmployeeServiceService,
    private _atmEmpMappingService: AtmEmployeeMappingServiceService
  ) {
    this.datepickerconfig = Object.assign(
      {},
      {
        containerClass: this.colorTheme,
        dateInputFormat: "YYYY-MM-DD",
      }
    );
    this.minDate = new Date();
    this.companyId = "";
    this.branch_id = "";
  }

  Dateformattter(unformatted_date: string) {
    return unformatted_date.replace("T", "  ").split(" ")[0];
  }

  ngOnInit() {
    this.login_token = localStorage.getItem("CMSAppUserLogin");

    if (this.login_token) {
      this.access = JSON.parse(this.login_token);
      this.userID = this.access.Entity.UserID;
      this.userCode = this.access.Entity.EmployeeCode;
      this.company_code = this.access.Entity.CompanyCode;
      this.companyID = this.access.Entity.CompanyID;
      if (this.company_code == "CMS" || this.company_code == "cms") {
        this.isCMS = true;
      } else {
        this.disabledBranchSelection = false;
      }
      //console.log("---", this.access["Entity"]["atm_emp_mapping"]);
      this.permission = this.access["Entity"]["atm_emp_mapping"];
      if (this.permission != "Read") {
        this.permission_flag = true;
      }
    } else {
      this.router
        .navigateByUrl("/", { skipLocationChange: false })
        .then(() => this.router.navigate(["/login"]));
    }

    //to fetch the list of ATM master data from databse

    //console.log("just before dailyMapping caling:");
    this.dailyMapping();
  }

  ReMapEmp2(z) {
    console.log("table data cliked: ", z);

    this.disabledEmp2Selection = false;
    this.disabledCompanySelection = false;
    this.disabledBranchSelection = false;
    this.disabledAtmSelection = false;
    this.disabledEmp1Selection = false;

    this.company_flag = true;
    this.flagbranchtype = true;
    this.flagatm = true;
    this.flagemp1 = true;
    this.flagemp2 = false;
    //this.disabledDateSelection = true;

    this.selectedBranchId = z.branchId;
    this.selectedBranchCode = z.branchCode;
    this.selectedBranchName = z.branchCode;
    //this.selectedBranchName = "Allahabad Bank_Andheri";

    this.selectedCompanyCode = z.compCode;
    this.selectedCompanyId = z.CompanyID;

    this.selectedATMId = z.atmCode;
    this.selectedATMCode = z.atmId;
    this.atm_code = z.atmCode;

    if (z.ToDate === null || z.ToDate === "-") {
      this.emp1_selected_value = z.empCode1;
      this.selectedEmp1Code = z.empCode1;
    }

    //this.selectedEmp1Id = z.employeeId;

    //this.from_date = z.FromDate;
  }

  goToTop(): void {
    //console.log("inside gototop: ");
    // window.scrollTo(0, 0);
    // window.scroll({
    //   top: 0,
    //   left: 0,
    //   behavior: "smooth",
    // });
    // (function smoothscroll() {
    //   console.log("inside smoothscroll");
    //   var currentScroll =
    //     document.documentElement.scrollTop || document.body.scrollTop;
    //   console.log("currentScroll: ", currentScroll);
    //   if (currentScroll > 0) {
    //     window.requestAnimationFrame(smoothscroll);
    //     window.scrollTo(0, currentScroll - currentScroll / 8);
    //   }
    // })();
    //window.scrollTo(0, 0);
    //this.viewportScroller.scrollToPosition([0, 0]);
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
    //console.log("id is ", id);
    if (id == 1) {
      this.mapping_list = this.temp_mapping_list.filter((res) => {
        return res.atmCode
          .toLocaleUpperCase()
          .match(this.atm_codef.toLocaleUpperCase());
      });
    }
    if (id == 4) {
      console.log(
        "isndie id 3",
        ev,
        this.emp_code1.toLocaleUpperCase(),
        this.temp_mapping_list
      );
      this.mapping_list = this.temp_mapping_list.filter((res) => {
        //console.log("employeecode", res.employeeCode);
        return res.empCode2
          .toLocaleUpperCase()
          .match(this.emp_code2.toLocaleUpperCase());
      });
    }

    if (id == 3) {
      // console.log(
      //   "isndie id 3",
      //   ev,
      //   this.emp_code1.toLocaleUpperCase(),
      //   this.temp_mapping_list
      // );
      this.mapping_list = this.temp_mapping_list.filter((res) => {
        console.log("employeecode", res.employeeCode);
        return res.empCode1
          .toLocaleUpperCase()
          .match(this.emp_code1.toLocaleUpperCase());
      });
    }
    if (id == 2) {
      this.mapping_list = this.temp_mapping_list.filter((res) => {
        return res.compCode
          .toLocaleUpperCase()
          .match(this.comp_code.toLocaleUpperCase());
      });

      if (
        this.comp_code.length == 0 &&
        this.emp_code1.length == 0 &&
        this.emp_code2.length == 0 &&
        this.atm_codef.length == 0
      ) {
        this.mapping_list = this.temp_mapping_list;
      }
    }

    if (id == 5) {
      //console.log(ev);
      //console.log(this.re_map_checkbox);
      //console.log(id);

      if (ev) {
        this.mapping_list = this.temp_mapping_list.filter((res) => {
          if (res.atmEmpStatusCode === 1) return res;
        });
      } else {
        this.mapping_list = this.temp_mapping_list;
      }
    }
  }

  saveNewMapping() {
    if (!this.blankfieldCheck()) {
      console.log("inside new  mapping");
      var atmEmpMaster = new AtmEmpMapping();
      var atmEmpMasterModal = new AtmEmployeeData();

      atmEmpMaster.UserId = parseInt(this.userID);

      console.log(this.selectedCompanyCode);
      if (this.isCMS === true) {
        atmEmpMasterModal.CompanyCode = this.selectedCompanyCode;
      } else {
        atmEmpMasterModal.CompanyCode = this.company_code;
      }
      // atmEmpMasterModal.CompanyCode =this.selectedCompanyCode
      atmEmpMasterModal.AtmCode = Number(this.selectedATMCode);
      atmEmpMasterModal.atmId = this.selectedATMId;
      atmEmpMasterModal.Emp1Code = this.selectedEmp1Code;
      atmEmpMasterModal.Emp2Code = this.selectedEmp2Code;
      atmEmpMasterModal.BranchCode = this.selectedBranchCode;
      // atmEmpMasterModal.Employee1Id =this.selectedEmp1Id
      // atmEmpMasterModal.Employee2Id =this.selectedEmp2Id
      atmEmpMasterModal.FromDate = this.from_date;
      atmEmpMaster.AtmEmployeeData.push(atmEmpMasterModal);

      this._atmEmpMappingService
        .addatmEmpMapping(atmEmpMaster)
        .subscribe((data) => {
          if (data.Success) {
            window.alert(" ATM EMP Mapped Sucessfully");
            window.location.reload();
          } else {
            window.alert("Failed to add data");
          }
        });
    } else {
      window.alert("Please fill the mandatory fields");
    }
  }

  dailyMapping() {
    //console.log("inside dailyMapping");
    this._atmEmpMappingService
      .getatmEmpMapping(this.userID)
      .subscribe((data) => {
        if (data) {
          this.response_atmEmp_data = data["Entity"];
          //console.log("response data atm emp: ", this.response_atmEmp_data);

          var mapped_data = [];

          //store the atm-emp transction
          var mapped_list = [];

          let date: Date = new Date();
          date.setDate(date.getDate() - 1);

          for (let item of this.response_atmEmp_data) {
            //console.log("mapped_data array: ", mapped_data);
            if (!mapped_data.includes(item.atmCode)) {
              // var selected_data = {}
              mapped_data.push(item.atmCode);
              console.log("ATM Code");
              console.log(item.atmCode);

              //All the custodian mapped to current item.atmCode now stored in filtered_data variable
              var filtered_data = this.response_atmEmp_data.filter(
                (i) => i.atmCode === item.atmCode
              );
              //console.log("Outer data");
              //console.log(filtered_data);

              // var atm_emp_list = []

              //date_list arr store all the from_dates
              var date_list = [];

              //this loop traverse the emp mapped to item.atmCode
              for (let filt of filtered_data) {
                // if(!(atm_emp_list.includes(filt.atmEmployeeId))){
                if (!date_list.includes(filt.FromDate)) {
                  //this is this the single row/atm-emp transcation in grid
                  var selected_data = {};

                  //all the emp having same from_date are stored into the date_filtered_data
                  var date_filtered_data = filtered_data.filter(
                    (i) => i.FromDate === filt.FromDate
                  );
                  console.log("date_filtered data: ", date_filtered_data);

                  // if (filt.ToDate == null) {
                  //   selected_data["ToDate"] = "-";
                  // } else {
                  //   selected_data["ToDate"] = date_filtered_data[0]["ToDate"];
                  // }

                  if (
                    date_filtered_data[0] != undefined &&
                    date_filtered_data[1] != undefined
                  ) {
                    if (date_filtered_data[0]["ToDate"] != null) {
                      selected_data["ToDate"] = date_filtered_data[0]["ToDate"];
                    } else if (date_filtered_data[1]["ToDate"] != null) {
                      selected_data["ToDate"] = date_filtered_data[1]["ToDate"];
                    } else {
                      selected_data["ToDate"] = "-";
                    }
                  } else {
                    if (date_filtered_data[0] != undefined) {
                      if (date_filtered_data[0]["ToDate"] != null) {
                        selected_data["ToDate"] =
                          date_filtered_data[0]["ToDate"];
                      } else {
                        selected_data["ToDate"] = "-";
                      }
                    }
                    if (date_filtered_data[1] != undefined) {
                      if (date_filtered_data[1]["ToDate"] != null) {
                        selected_data["ToDate"] =
                          date_filtered_data[1]["ToDate"];
                      } else {
                        selected_data["ToDate"] = "-";
                      }
                    }
                  }

                  selected_data["atmCode"] = date_filtered_data[0]["atmCode"];
                  selected_data["atmId"] = date_filtered_data[0]["atmId"];
                  selected_data["branchCode"] =
                    date_filtered_data[0]["branchCode"];
                  selected_data["branchId"] = date_filtered_data[0]["branchId"];

                  if (date_filtered_data[0] === undefined) {
                    selected_data["empCode1"] = "-";
                  } else {
                    selected_data["empCode1"] =
                      date_filtered_data[0]["employeeCode"];
                    //console.log("++++++++");
                    //console.log(date_filtered_data[0]);
                  }

                  if (date_filtered_data[1] !== undefined) {
                    selected_data["atmEmpStatusCode"] = 0;
                    selected_data["empCode2"] =
                      date_filtered_data[1]["employeeCode"];
                    //console.log("--------");
                    //console.log(date_filtered_data[1]);
                  } else if (
                    date_filtered_data[1] === undefined &&
                    (date_filtered_data[0]["ToDate"] === null ||
                      new Date(date_filtered_data[0]["ToDate"]).getTime() >
                        date.getTime())
                  ) {
                    selected_data["atmEmpStatusCode"] = 1;
                  } else {
                    selected_data["atmEmpStatusCode"] = 2;
                  }

                  selected_data["compCode"] =
                    date_filtered_data[0]["CompanyCode"];
                  selected_data["CompanyID"] =
                    date_filtered_data[0]["CompanyID"];
                  selected_data["FromDate"] = date_filtered_data[0]["FromDate"];
                  date_list.push(date_filtered_data[0]["FromDate"]);
                  // atm_emp_list.push(date_filtered_data[0]["atmEmployeeId"])
                  // atm_emp_list.push(date_filtered_data[1]["atmEmployeeId"])
                  mapped_list.push(selected_data);
                }
                // }
              }
              // mapped_list.push(selected_data)
            }
          }
          this.mapping_list = mapped_list;
          this.temp_mapping_list = this.mapping_list;
          this.got_data = true;
          //console.log("this is empdata ", this.mapping_list);
        } else {
          alert("failed to get data");
        }
      });
  }
  getBranches() {
    console.log("insdie get branch: ", this.userID);
    this.branches = [];
    this.branches_loading = true;
    this._branchService.getbranch(this.userID).subscribe((data) => {
      console.log(this.selectedCompanyId);
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
    //console.log(z);
    this.flagbranchtype = true;
    this.flagatm = false;
    this.flagemp1 = false;
    this.flagemp2 = false;

    this.branches_loading = false;
    this.disabledAtmSelection = false;
    this.disabledEmp1Selection = true;
    this.disabledEmp2Selection = true;
    this.atm_list$ = null;
    this.employee_list1$ = null;
    this.employee_list2$ = null;
    this.atm_code = null;
    this.emp1_selected_value = null;
    this.emp2_selected_value = null;
    this.selectedBranchId = z.BranchID;
    this.selectedBranchCode = z.BranchCode;
    this.selectedBranchName = z.BranchName;
    this.selectedATMCode = "";
    this.selectedATMId = "";
    this.selectedEmp1Code = "";
    this.selectedEmp1Id = null;
    this.selectedEmp2Code = "";
    this.selectedEmp2Id = null;
  }

  getCompanies() {
    if (this.companies.length <= 0 && this.companies_loading === false) {
      this.companies = [];
      this.companies_loading = true;
      this._tenantService
        .getAssignedCustomers(this.userID)
        .subscribe((data) => {
          //console.log(data);
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
    this.flagbranchtype = false;
    this.flagatm = false;
    this.flagemp1 = false;
    this.flagemp2 = false;

    this.companies_loading = false;
    this.disabledBranchSelection = false;
    this.disabledAtmSelection = true;
    this.disabledEmp1Selection = true;
    this.disabledEmp2Selection = true;
    this.selectedBranchName = null;
    this.atm_list$ = null;
    this.employee_list1$ = null;
    this.employee_list2$ = null;
    this.atm_code = null;
    this.emp1_selected_value = null;
    this.emp2_selected_value = null;
    this.selectedCompanyId = z.CompanyId;
    this.selectedCompanyCode = z.CompanyCode;
    this.selectedBranchId = "";
    this.selectedBranchCode = "";
    this.selectedATMCode = "";
    this.selectedATMId = "";
    this.selectedEmp1Code = "";
    this.selectedEmp1Id = null;
    this.selectedEmp2Code = "";
    this.selectedEmp2Id = null;
    this.flagbranchtype = false;
    this.flagemp1 = false;
    this.flagemp2 = false;
    this.flagatm = false;

    //console.log("selectedcomapany code: ", this.selectedCompanyCode);
  }

  getAtmList() {
    this.atms = [];
    this.atm_loading = true;
    this._atmService.getatm(this.userID).subscribe((data) => {
      for (let item of data["Entity"]) {
        if (item.BranchID === this.selectedBranchId && item.Active === true) {
          this.atms.push(item);
        }
      }
      this.atm_loading = false;
      this.atm_list$ = of(this.atms);
      //console.log(this.atms);
    });
  }

  getAtmFlag(z) {
    //console.log("inside getAtmFlag");
    this.flagatm = true;
    this.flagemp1 = false;
    this.flagemp2 = false;

    this.atm_loading = false;
    this.emp1_selected_value = null;
    this.emp2_selected_value = null;
    this.disabledEmp1Selection = false;
    this.disabledEmp2Selection = false;
    this.selectedATMId = z.ATMID;
    this.selectedATMCode = z.ATMCode;
  }

  getEmployee1List() {
    let date: Date = new Date();
    //console.log(date);
    this.employees1 = [];
    this.employee_list1$ = null;
    this.emp1_loading = true;
    this.employeeService.getEmployee(this.userID).subscribe((data) => {
      //.log("Branch");
      // console.log(this.selectedBranchId);
      for (let item of data["Entity"]) {
        if (
          item.BranchID === this.selectedBranchId &&
          item.employeeCode != this.selectedEmp2Code &&
          item.active === true
        ) {
          item.emp1Label = item.employeeName + "(" + item.employeeCode + ")";
          this.employees1.push(item);
          //.log(item);
        }
      }
      this.emp1_loading = false;
      this.employee_list1$ = of(this.employees1);
    });
  }

  getEmployeeFlag1(z) {
    this.flagemp1 = true;
    this.emp1_loading = false;
    // this.selectedEmp1Code = z.employeeName
    this.selectedEmp1Code = z.employeeCode;
    this.selectedEmp1Id = z.employeeId;
    this.name_cust1 = z.employeeName;
  }

  getEmployee2List() {
    let date: Date = new Date();
    // console.log("inside getEmployee2List");
    // console.log("userID: ", this.userID);
    // console.log("selectedBranchId: ", this.selectedBranchId);
    // console.log("selectedEmp1Code: ", this.selectedEmp1Code);
    this.employees2 = [];
    this.employee_list2$ = null;
    this.emp2_loading = true;
    this.employeeService.getEmployee(this.userID).subscribe((data) => {
      //console.log("data: ", data["Entity"]);
      for (let item of data["Entity"]) {
        // console.log("inside emp2 for");
        //console.log()
        if (
          item.BranchID == this.selectedBranchId &&
          item.employeeCode != this.selectedEmp1Code &&
          item.active === true
        ) {
          //console.log("inside emp2 if");

          item.emp2Label = item.employeeName + "(" + item.employeeCode + ")";
          this.employees2.push(item);
        }
      }
      this.emp2_loading = false;
      // console.log("this.employees2:", this.employees2);
      this.employee_list2$ = of(this.employees2);
    });
  }

  getEmployeeFlag2(z) {
    this.flagemp2 = true;
    this.emp2_loading = false;
    // this.selectedEmp2Code = z.employeeName
    this.selectedEmp2Code = z.employeeCode;
    this.selectedEmp2Id = z.employeeId;
    this.name_cust2 = z.employeeName;
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
      !this.flagemp1 ||
      !this.flagemp2 ||
      this.nullCheck(this.from_date);

    if (flag1) {
      this.show_blank_alert = true;
    } else {
      this.show_blank_alert = false;
    }
    //console.log(this.show_blank_alert);
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
