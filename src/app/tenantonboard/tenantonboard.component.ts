import { Observable, of } from "rxjs";
import { Component, OnInit, ViewChild, HostListener } from "@angular/core";
import {
  BsDatepickerDirective,
  BsDatepickerConfig,
} from "ngx-bootstrap/datepicker";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ManageTenantServiceService } from "../services/masterUser/manage-tenant-service.service";
import { NewCustomer, CompanyDetails } from "../modals/customer/customermodal";
import { fusiontables_v2 } from "googleapis";

@Component({
  selector: "app-tenantonboard",
  templateUrl: "./tenantonboard.component.html",
  styleUrls: ["./tenantonboard.component.css"],
})
export class TenantonboardComponent implements OnInit {
  @ViewChild(BsDatepickerDirective) datepicker: BsDatepickerDirective;
  datepickerconfig: Partial<BsDatepickerConfig>;
  colorTheme: string = "theme-dark-blue";

  @HostListener("window:scroll", ["$event"])
  onScrollEvent() {
    this.datepicker.hide();
  }
  login_token: any;
  access: any;
  registerForm: FormGroup;
  user_email: string;
  phone_no: string;
  customer_code: string;
  customer_name: string;
  customer_type: number;
  atm_count: number;
  contact_person_name: string;
  startDate: Date;
  endDate: Date;
  end_date: string;

  dummy_executives: any = [];
  isSelected: boolean;
  isCustomerSelected: boolean = false;
  user: string;
  formBuilder: FormBuilder;
  selectedFile: File;
  active_transaction: boolean;
  active_master: boolean;
  userCode: string;
  companyCode: string;
  executiveList: any = [];
  admin_name: string;
  admin_contact_no: string;
  admin_email: string;
  admin_username: string;

  customerList$: Observable<any>;
  customers: any = [];
  clearable_customer: boolean = false;
  customer: string = null;

  customerDetails: any;
  flagEditCustomers: boolean = false;
  editDetailsCustomer: boolean = false;
  userID: string;
  companyID: string;
  imageData: string;
  company_code: string;
  company_name: string;
  from_date: string;
  to_date: string;
  cms_executive: string;
  EmpCode: string;
  admin_emp_code: string;

  mobileNoRemark: string;
  showmobAlert: boolean = false;
  show_blank_alert: boolean = false;
  showEmailAlert: boolean = false;
  countAlert: boolean = false;
  show_customer_alert: boolean = false;

  constructor(
    private router: Router,
    private _tennantService: ManageTenantServiceService
  ) {
    this.datepickerconfig = Object.assign(
      {},
      {
        containerClass: this.colorTheme,
        dateInputFormat: "YYYY-MM-DD",
      }
    );
    this.isSelected = false;
    this.user = "";
    this.startDate = new Date();
    this.endDate = new Date();
  }

  ngOnInit() {
    this.login_token = localStorage.getItem("CMSAppUserLogin");
    if (this.login_token) {
      this.access = JSON.parse(this.login_token);
      this.userCode = this.access.Entity.EmployeeCode;
      // this.companyID =this.access.Entity.CompanyID
      this.companyCode = this.access.Entity.CompanyCode;
      this.userID = this.access.Entity.UserID;
      this.getExecutiveName();
      // this.getCustomerDetails()
    } else {
      this.router
        .navigateByUrl("/", { skipLocationChange: false })
        .then(() => this.router.navigate(["/login"]));
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  getCustomerDetails() {
    this._tennantService
      .getCustomerDetails(this.companyID)
      .subscribe((data) => {
        this.customerDetails = data;
        if (this.customer) {
          console.log("inside edit customer ", this.customer);
          console.log("customer list", this.customerDetails);
          this.editDetailsCustomer = true;
          for (let Item of this.customerDetails["Entity"]) {
            if (Item.CompanyCode == this.customer) {
              console.log("insdie iffff");
              this.company_code = Item.CompanyCode;
              this.company_name = Item.CompanyName;
              this.from_date = this.Dateformattter(Item.StartDate);
              this.to_date = this.Dateformattter(Item.EndDate);
              this.contact_person_name = Item.ContactPersonName;
              this.phone_no = Item.ContactPersonPhone;
              this.user_email = Item.ContactPersonEmail;
              this.cms_executive = Item.CMSExecutive;
              this.active_master = Item.MasterApproval;
              this.active_transaction = Item.TransactionApproval;
            }
          }
        }
      });
  }

  editCustomer() {
    this.getCustomerName();
    this.flagEditCustomers = true;
    console.log("editDetailsCustomer: ", this.editDetailsCustomer);
    console.log("customer: ", this.customer);
    if (this.customer) {
      this.editDetailsCustomer = true;
    }
  }

  getCustomerName() {
    this._tennantService.getAssignedCustomers(this.userID).subscribe((data) => {
      for (let item of data["Entity"]) {
        if (item.Active === true) {
          this.customers.push({
            CompanyCode: item["CompanyCode"],
            CompanyId: item["CompanyId"],
          });
        }
      }
      this.customerList$ = of(this.customers);
    });
  }

  getCustomerNameFlag(data) {
    console.log("--", data.CompanyId);
    this.customer = data.CompanyCode;
    this.companyID = data.CompanyId;
    this.getCustomerDetails();
    this.isCustomerSelected = true;
  }

  validateMobileNumber() {
    console.log("Inside function");
    var regexp = new RegExp("[0-9]{10}");
    if (this.phone_no === "") {
      this.showmobAlert = false;
    } else if (this.phone_no.length != 10) {
      this.mobileNoRemark = "Invalid mobile number";
      this.showmobAlert = true;
    } else {
      if (regexp.test(this.phone_no)) {
        this.showmobAlert = false;
      } else {
        this.showmobAlert = true;
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

  validatecustomerCode() {
    var reg = /[^0-9A-za-z]/;
    var isspecial = reg.test(this.customer_code);
    if (isspecial === true) {
      this.show_customer_alert = true;
    } else {
      this.show_customer_alert = false;
    }
  }

  getExecutiveName() {
    this._tennantService
      .getCmsExecutives(this.userCode, this.companyCode)
      .subscribe((data) => {
        for (let item of data["Entity"]) {
          console.log("--", item);
          if (item.Active === true) {
            this.executiveList.push({
              name: item["UserName"],
              UserID: item["Userid"],
              EmpCode: item["EmpCode"],
            });
          }
        }
      });
  }

  getSelectedexec(z) {
    this.isSelected = true;
    this.EmpCode = z["EmpCode"];
    console.log("--", z);
  }

  getImageData(event) {
    this.selectedFile = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (e) => {
      //me.modelvalue = reader.result;
      this.imageData = reader.result.toString().split(",")[1];
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  validationChecks() {
    if (
      this.showEmailAlert ||
      this.showmobAlert ||
      this.countAlert ||
      this.show_customer_alert
    ) {
      return true;
    } else {
      return false;
    }
  }

  createNewCustomer() {
    if (!this.blankfieldCheck()) {
      if (!this.validationChecks()) {
        var newCust = new NewCustomer();
        var companyDetails = new CompanyDetails();
        companyDetails.CompanyCode = this.customer_code.toLocaleUpperCase();
        companyDetails.CompanyName = this.customer_name;
        // companyDetails.ContactPersonEmail = this.user_email
        // companyDetails.ContactPersonName = this.contact_person_name
        // companyDetails.ContactPersonPhone = this.phone_no
        //companyDetails.CompanyLogo = this.imageData
        companyDetails.UserName = this.contact_person_name;
        companyDetails.UserEmail = this.user_email;
        companyDetails.EmpCode = this.admin_emp_code;
        companyDetails.StartDate = this.from_date;
        companyDetails.EndDate = this.end_date;
        companyDetails.total_atm_count = this.atm_count;
        companyDetails.TransactionApproval = this.active_transaction;
        companyDetails.MasterApproval = this.active_master;
        companyDetails.CMSExecutive = this.EmpCode;
        companyDetails.EmpName = this.contact_person_name;
        companyDetails.RegMobileNumber = this.phone_no;

        newCust.UserID = this.userID;
        newCust.CompanyDetails = companyDetails;

        this._tennantService.addCustomer(newCust).subscribe((resp) => {
          console.log("Add customer payload");
          console.log(resp);
          if (resp.Success && resp.Message === "Data Added Successfully") {
            window.alert("Customer Added Successfully ");
            window.location.reload();
          } else if (
            resp.Success &&
            resp.Message === "Customer Already Exists"
          ) {
            window.alert("Customer Already Exists ");
            // window.location.reload()
          } else {
            window.alert("Failed To Add Customer");
          }
        });
      } else {
        window.alert(
          "Some Field validations have failed. Please fill valid data"
        );
      }
    } else {
      window.alert("Please fill all the mandatory fields");
    }
  }

  navigateToScreen() {
    console.log(this.imageData);
    this.createNewCustomer();
    //window.alert("Directing to Staff Role Page for Admin Role Creation")
  }

  covertTobase64(url) {
    console.log("inside url" + url);
    var image = new Image();
    //image.crossOrigin ='Anonymous';
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
    image.onload = function () {
      console.log("inside onload");

      var canvas = document.createElement("canvas");
      canvas.width = 80;
      canvas.height = 80;

      var ctx = canvas.getContext("2d");
      ctx.drawImage(url, 0, 0);

      var dataURL = canvas.toDataURL("image/png");
      console.log("Data URL");
      console.log(dataURL);
      console.log("BAse 64--->>");
      console.log(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
      return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    };
  }

  deactivateCustomer() {
    let deactivate_flag = confirm(
      "Are you sure you want to deactivate customer ?"
    );

    if (deactivate_flag) {
      var customerMaster = new NewCustomer();
      var customerModal = new CompanyDetails();
      customerMaster.UserID = this.userID;
      customerModal.CompanyID = parseInt(this.companyID);

      customerModal.Active = false;
      customerMaster.CompanyDetails = customerModal;

      this._tennantService.editCustomer(customerMaster).subscribe((data) => {
        console.log(data.Success);
        if (data.Success) {
          window.alert("Customer Deactivated Successfully");
          this.back_screen();
          window.location.reload();
        } else {
          window.alert("Failed To Deactivate");
        }
        this.getCustomerName();
      });
    }
  }

  blankfieldCheck() {
    this.show_blank_alert = false;

    var flag =
      this.nullCheck(this.customer_name) ||
      this.nullCheck(this.customer_code) ||
      this.nullCheck(this.atm_count) ||
      this.nullCheck(this.from_date) ||
      this.nullCheck(this.end_date) ||
      this.nullCheck(this.contact_person_name) ||
      this.nullCheck(this.phone_no) ||
      this.nullCheck(this.user_email) ||
      this.nullCheck(this.admin_emp_code);

    if (flag || !this.isSelected) {
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

  Dateformattter(unformatted_date: string) {
    //return unformatted_date.replace("T","  ").split(/[\.]/)[0].slice(0,-3);
    return unformatted_date.replace("T", "  ").split(" ")[0];
  }

  back_screen() {
    //this.flagEditCustomers = false
    this.isCustomerSelected = false;
    this.editDetailsCustomer = false;
    this.contact_person_name = null;
    this.user_email = null;
    this.phone_no = null;
    this.from_date = null;
    this.customer = null;
    this.active_transaction = false;
    this.active_master = false;
  }

  back_to_new_cust() {
    this.flagEditCustomers = false;
  }

  validate_atm_count() {
    if (this.atm_count < 0) {
      this.countAlert = true;
    } else {
      this.countAlert = false;
    }
  }
}
