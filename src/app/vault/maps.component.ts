import { Component, OnInit, ViewChild } from '@angular/core';
import { NgModule } from '@angular/core';

import { Router } from '@angular/router';

import { retry } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import { EMPTY } from 'rxjs';

import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';


import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';

import { SignaturePad } from 'angular2-signaturepad/signature-pad';


@Injectable()
export class ConfirmDeactivateGuard4 implements CanDeactivate<MapsComponent> {

  canDeactivate(target: MapsComponent) {
    if (target.checkIfStarted()) {
      return window.confirm('Are you sure?');
    }
    return true;
  }

}
@NgModule({
  providers: [
    ConfirmDeactivateGuard4
  ]
})


@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  @ViewChild('signpad1') signaturePad: SignaturePad;
  @ViewChild('signpad2') signaturePad2: SignaturePad;
  @ViewChild('signpad3') signaturePad3: SignaturePad;
 
 
  private signaturePadOptions:  object= { // passed through to szimek/signature_pad constructor
    'minWidth': .5,
    penColor:'rgb(7, 8, 7)',
    backgroundColor:'rgb(255,255,255)',
    'canvasWidth': 400,
    'canvasHeight': 100
    
  };


  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;
  public webcamImageArr: any = []

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  request_img: any = []
  response_img: any = null
  signature_img_custodian1: boolean= false
  signature_img_custodian2: boolean= false
  signature_img_auditor: boolean= false

  signatureImage_custodian1: any= null;
  signatureImage_custodian2: any= null;
  signatureImage_auditor: any= null;
  emp_id_list: any = []
  emp_id_list1: any = []
  name_cust_list: any = []
  emp_id_bm :any
  emp_id_vc :any
  emp_id_vc_cust1 :any
  emp_id_vc_cust2 :any

  image_names: string = null
  date_img: any = null

  server_json: any
  server_name: string
  service_name: string
  service_name_user_master: any
  service_name_custodian: any
  service_name_datetime: any
  response_datetime: any
  response_user_master:any
  response_custodian:any

  request: any
  response: any

  service_name_loc: string
  locations: any
  regions: any
  zones: any
  height:any

  login_token: any
  access: any

  review_mode: boolean = false
  incomplete: boolean = false

  switch1: boolean = false
  switch2: boolean = false
  switch3: boolean = false
  switch4: boolean = false
  switch5: boolean = false
  switch6: boolean = false
  switch7: boolean = false
  switch8: boolean = false
  switch9: boolean = false
  switch10: boolean = false
  switch11: boolean = false
  switch12: boolean = false
  switch13: boolean = false
  switch14: boolean = false
  switch15: boolean = false
  switch16: boolean = false
  switch17: boolean = false
  switch18: boolean = false
  switch19: boolean = false
  switch20: boolean = false
  switch21: boolean = false
  switch22: boolean = false
  switch23: boolean = false

  rating1: number = null
  rating2: number = null
  rating3: number = null
  rating4: number = null
  rating5: number = null
  rating6: number = null
  rating7: number = null
  rating8: number = null
  rating9: number = null
  rating10: number = null
  rating11: number = null
  rating12: number = null
  rating13: number = null
  rating14: number = null
  rating15: number = null
  rating16: number = null
  rating17: number = null
  rating18: number = null
  rating19: number = null
  rating20: number = null
  rating21: number = null
  rating22: number = null
  rating23: number = null

  total_score: number = null
  risk_score: string = null

  all_cash_lim: boolean = false
  all_vault_ins: boolean = false
  all_key_proc: boolean = false
  all_vault_auth: boolean = false
  all_frisking: boolean = false
  all_cmo_proc: boolean = false
  all_sec_sys: boolean = false
  all_rec: boolean = false
  all_repo: boolean = false
  all_sealed_pass: boolean = false
  all_phy_cash: boolean = false
  all_data: boolean = false

  branch_name: string
  audit_done_by: string
  date_of_audit: string
  branch_manager: string
  vault_incharge: string
  name_cust1: string
  name_cust2: string
  comments: string = null

  location: string
  region: string
  zone: string

  sent_to_server: boolean = false
  error_sending: boolean = true

  save_info: any = null
  save_json: string = null

  date: Date = new Date()

  lat_stamp: number = 0
  long_stamp: number = 0
  got_Emp:boolean=false
  flagnewEmp:boolean=false
  flagEditEmp:boolean=false
  Emp_zone:string
  Emp_id1
  Emp_list:any=[]
  createdBy:string



  image_upload_url: string
  confirm_pressed: boolean = false

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {

    this.confirm_pressed = false

    


    this.login_token = localStorage.getItem('CMSAppUserLogin');
    if (this.login_token) {
      this.access = JSON.parse(this.login_token);
      this.createdBy=this.access['name']
    }
    else {
      this.router.navigateByUrl('/', { skipLocationChange: false }).then(() =>
        this.router.navigate(["/login"]));
    }
    this.getEmp()

  }

  getEmp(){
    console.log('inside get Emp')
    this.got_Emp =true
    this.Emp_list =[{'Emp_id':'a12','location':'x','zone':'y','region':'E'},
                    {'Emp_id':'b323','location':'x','zone':'y','region':'E'},
                    {'Emp_id':'c2433423','location':'x','zone':'y','region':'E'},
                    {'Emp_id':'d3423','location':'x','zone':'y','region':'E'},
                    {'Emp_id':'e23423423','location':'x','zone':'y','region':'E'},
                    {'Emp_id':'f32432','location':'x','zone':'y','region':'E'},
                    {'Emp_id':'g4423','location':'x','zone':'y','region':'E'},
                    {'Emp_id':'h23432432432','location':'x','zone':'y','region':'E'},
                    {'Emp_id':'i342343','location':'x','zone':'y','region':'E'},
                    {'Emp_id':'j23234','location':'x','zone':'y','region':'E'},
                    {'Emp_id':'k3324','location':'x','zone':'y','region':'E'},
                    {'Emp_id':'l2424','location':'x','zone':'y','region':'E'}]
  
                    // console.log(this.Emp_list[0].Emp_id)
  }
  
  //function to edit the branchmaster data 
  editEmp(aid){
    // this.got_Emp =false
    console.log(aid)
    this.Emp_id1 =aid.Emp_id
    // this.Emp_location =aid.location
    this.Emp_zone =aid.zone
    this.flagEditEmp =true
  
    //api call to get the branch details
  
  }
  confirmSubmitEmp(){
    window.alert("data updated sucessfully")
    window.location.reload()
    
    
  }
  
  createNewEmp(){
    this.flagnewEmp =true
  }
  
  saveNewEmp(){
    window.alert("Emp Added Sucess fully")
    window.location.reload()
  }
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'X-Frame-Options': 'DENY'
  //     })
  //   };

  //   if (this.server_name) {
  //     this.http.post(this.service_name_datetime, {}, httpOptions)
  //       .catch(error => {
  //         alert("Could not connect to the server. Retry after some time.")
  //         this.date_of_audit = ((this.date.getDate() < 10 ? '0' : '') + this.date.getDate()) + '-' + (((this.date.getMonth() + 1) < 10 ? '0' : '') + (this.date.getMonth() + 1)) + '-' + this.date.getFullYear();
  //         return EMPTY
  //       })
  //       .subscribe(data => {
  //         this.response_datetime = data
  //         this.date_of_audit = this.response_datetime['date_server']
  //       });
  //   }

  //   this.save_json = localStorage.getItem('CMSAppUserSavedVault')
  //   this.save_info = JSON.parse(this.save_json)
  //   if (this.save_info) {
  //     [this.switch1, this.switch2, this.switch3, this.switch4, this.switch5, this.switch6, this.switch7, this.switch8, this.switch9, this.switch10, this.switch11, this.switch12, this.switch13, this.switch14, this.switch15, this.switch16, this.switch17, this.switch18, this.switch19, this.switch20, this.switch21, this.switch22, this.switch23, this.branch_name, this.audit_done_by, this.date_of_audit, this.branch_manager, this.vault_incharge, this.name_cust1, this.name_cust2, this.comments, this.all_cash_lim, this.all_vault_ins, this.all_key_proc, this.all_vault_auth, this.all_frisking, this.all_cmo_proc, this.all_sec_sys, this.all_rec, this.all_repo, this.all_sealed_pass, this.all_phy_cash, this.all_data,this.signatureImage_custodian1,this.signatureImage_custodian2,this.signatureImage_auditor,
  //        this.access['zone'], this.access['region'], this.access['location']] = this.save_info
  //   }

  //   this.getDemographic()
  //   this.getUserMaster()
  //   this.branch_name = this.access['location']
  //   this.getCustodianData()


  //   WebcamUtil.getAvailableVideoInputs()
  //     .then((mediaDevices: MediaDeviceInfo[]) => {
  //       this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
  //     });
     
  // }

  
  // public triggerSnapshot(): void {
  //   this.trigger.next();
  // }

  // public toggleWebcam(): void {
  //   this.showWebcam = !this.showWebcam;
  // }

  // public handleInitError(error: WebcamInitError): void {
  //   this.errors.push(error);
  // }

  // public showNextWebcam(directionOrDeviceId: boolean | string): void {
  //   this.nextWebcam.next(directionOrDeviceId);
  // }


  // public handleImage(webcamImage: WebcamImage): void {
  //   this.webcamImage = webcamImage;
  //   if (this.webcamImageArr.length < 4) {
  //     this.webcamImageArr.push(this.webcamImage);
  //   }
  //   else {
  //     alert("Maximum 4 images are allowed.")
  //   }
  // }


  // public cameraWasSwitched(deviceId: string): void {
  //   this.deviceId = deviceId;
  // }

  // public get triggerObservable(): Observable<void> {
  //   return this.trigger.asObservable();
  // }

  // public get nextWebcamObservable(): Observable<boolean | string> {
  //   return this.nextWebcam.asObservable();
  // }
  // showImage(data) {
  //   this.signature_img=true
  //   console.log("inside signature")
  //   this.signatureImage = data;
  //   console.log(data);
  // }
  // showImage(type) {
  //   console.log(type)
  //   if(type==='c1') {
  //     this.signature_img_custodian1=true
  //     this.signatureImage_custodian1 = this.signaturePad.toDataURL('image/png,0.5');
  //     console.log("c1");
  //     console.log(this.signatureImage_custodian1);
  //   }
  //   if(type==='c2') {
  //     this.signature_img_custodian2=true
  //     this.signatureImage_custodian2 = this.signaturePad2.toDataURL('image/png,0.5');
  //     console.log("c2");
  //     console.log(this.signatureImage_custodian2);
  //   }
  //   if(type==='A') {
  //     this.signature_img_auditor=true
  //     this.signatureImage_auditor = this.signaturePad3.toDataURL('image/png,0.5');
  //     console.log("A");
  //     console.log(this.signatureImage_auditor);
  //   }
  //   console.log("inside signature")
  // }
  // resetSign(type){

  //   if(type==='c1') {
  //     console.log("inside reset")
  //     this.signature_img_custodian1=false
  //     this.signaturePad.clear();
  //   }
  //   if(type==='c2') {
  //     console.log("inside reset")
  //     this.signature_img_custodian2=false
  //     this.signaturePad2.clear();
  //   }
  //   if(type==='A') {
  //     console.log("inside reset")
  //     this.signature_img_auditor=false
  //   this.signaturePad3.clear();
  //   }
  // }


  // formatDate(date) {
  //   var dateParts = date.split('-')
  //   var d = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]),
  //     month = '' + (d.getMonth() + 1),
  //     day = '' + d.getDate(),
  //     year = d.getFullYear();

  //   if (month.length < 2)
  //     month = '0' + month;
  //   if (day.length < 2)
  //     day = '0' + day;

  //   return [year, month, day].join('');
  // }

  // uploadImages() {

  //   this.date_img = this.formatDate(this.date_of_audit)
  //   this.request_img = []

  //   if (this.webcamImageArr[0]) {

  //     this.image_names = "Vault/" + this.date_img.slice(0, 6) + "/" + this.branch_name.split(' ').join('_') + "_" + this.date_img + "_1.jpg"

  //     this.request_img.push({
  //       "Name": "Vault/" + this.date_img.slice(0, 6) + "/" + this.branch_name.split(' ').join('_') + "_" + this.date_img + "_1.jpg",
  //       "Image": this.webcamImageArr[0]['imageAsBase64'],
  //       "ImageType": "jpg"
  //     })
  //   }
  //   if (this.webcamImageArr[1]) {

  //     this.image_names += ",Vault/" + this.date_img.slice(0, 6) + "/" + this.branch_name.split(' ').join('_') + "_" + this.date_img + "_2.jpg"

  //     this.request_img.push({
  //       "Name": "Vault/" + this.date_img.slice(0, 6) + "/" + this.branch_name.split(' ').join('_') + "_" + this.date_img + "_2.jpg",
  //       "Image": this.webcamImageArr[1]['imageAsBase64'],
  //       "ImageType": "jpg"
  //     })
  //   }
  //   if (this.webcamImageArr[2]) {

  //     this.image_names += ",Vault/" + this.date_img.slice(0, 6) + "/" + this.branch_name.split(' ').join('_') + "_" + this.date_img + "_3.jpg"

  //     this.request_img.push({
  //       "Name": "Vault/" + this.date_img.slice(0, 6) + "/" + this.branch_name.split(' ').join('_') + "_" + this.date_img + "_3.jpg",
  //       "Image": this.webcamImageArr[2]['imageAsBase64'],
  //       "ImageType": "jpg"
  //     })
  //   }
  //   if (this.webcamImageArr[3]) {

  //     this.image_names += ",Vault/" + this.date_img.slice(0, 6) + "/" + this.branch_name.split(' ').join('_') + "_" + this.date_img + "_4.jpg"

  //     this.request_img.push({
  //       "Name": "Vault/" + this.date_img.slice(0, 6) + "/" + this.branch_name.split(' ').join('_') + "_" + this.date_img + "_4.jpg",
  //       "Image": this.webcamImageArr[3]['imageAsBase64'],
  //       "ImageType": "jpg"
  //     })
  //   }


  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'X-Frame-Options': 'DENY'
  //     })
  //   };
  //   this.http.post(this.image_upload_url, this.request_img, httpOptions)
  //     .catch(error => {
  //       alert("Could not connect to the server. Retry after some time.")
  //       return EMPTY
  //     })
  //     .subscribe(data => {
  //       this.response_img = data
  //       if (this.response_img['IsSuccess']) {
  //         this.callFinalAPI()
  //       }
  //       else {
  //         alert("Could not upload images to the server. Please edit and retry.")
  //       }
  //     });

  // }

  // getUserMaster() {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'X-Frame-Options': 'DENY'
  //     })
  //   };
  //   this.http.post(this.service_name_user_master, {}, httpOptions)
  //     .catch(error => {
  //       alert("Could not connect to the server. Retry after some time.")
  //       return EMPTY
  //     })
  //     .subscribe(data => {
  //       this.response_user_master = data
  //       if (this.response_user_master['status'] && this.response_user_master['status'] == "Success") {
  //         this.emp_id_list = this.response_user_master['emp_id']
  //         this.name_cust_list = this.response_user_master['name_cust']
  //       }
  //       else {
  //         alert('Could not fetch Custodian list from the server.')
  //       }
  //     });
  // }
  // getCustodianData() {
  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'X-Frame-Options': 'DENY'
  //     })
  //   };
  //   this.http.post(this.service_name_custodian, {}, httpOptions)
  //     .catch(error => {
  //       alert("Could not connect to the server. Retry after some time.")
  //       return EMPTY
  //     })
  //     .subscribe(data => {
  //       this.response_custodian = data
  //       if (this.response_custodian['status'] && this.response_custodian['status'] == "Success") {
  //         this.emp_id_list1 = this.response_custodian['emp_id']
  //         this.name_cust_list = this.response_custodian['name_cust']
  //       }
  //       else {
  //         alert('Could not fetch Custodian list from the server.')
  //       }
  //     });
  // }

  // getDemographic() {

  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'X-Frame-Options': 'DENY'
  //     })
  //   };

  //   this.http.post(this.service_name_loc, { 'username': this.access['username'], 'zone': this.access['zone'], 'region': this.access['region'] }, httpOptions)
  //     .catch(error => {
  //       alert("Could not connect to the server. Retry after some time.")
  //       return EMPTY
  //     })
  //     .subscribe(data => {
  //       this.regions = data['regions']
  //       this.locations = data['locations']
  //       this.zones = data['zones']
  //     });
  // }

  // resetButton() {
  //   this.scrollTop()
  //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
  //     this.router.navigate(["/vault"]));
  // }

  // submitButton() {

  //   this.getLocation()

  //   this.checkGeneralData()

  //   this.error_sending = false


  //   if (this.all_cash_lim && this.all_vault_ins && this.all_key_proc && this.all_vault_auth && this.all_frisking && this.all_cmo_proc && this.all_sec_sys && this.all_rec && this.all_repo && this.all_sealed_pass && this.all_phy_cash && this.all_data) {

  //     this.incomplete = false
  //     this.review_mode = true

  //     this.saveLocal()
  //     this.calculateRatings()
  //     this.scrollTop()
  //   }
  //   else {
  //     this.incomplete = true
  //   }
  // }

  // saveLocal() {
  //   this.save_info = [this.switch1, this.switch2, this.switch3, this.switch4, this.switch5, this.switch6, this.switch7, this.switch8, this.switch9, this.switch10, this.switch11, this.switch12, this.switch13, this.switch14, this.switch15, this.switch16, this.switch17, this.switch18, this.switch19, this.switch20, this.switch21, this.switch22, this.switch23, this.branch_name, this.audit_done_by, this.date_of_audit, this.branch_manager, this.vault_incharge, this.name_cust1, this.name_cust2, this.comments, this.all_cash_lim, this.all_vault_ins, this.all_key_proc, this.all_vault_auth, this.all_frisking, this.all_cmo_proc, this.all_sec_sys, this.all_rec, this.all_repo, this.all_sealed_pass, this.all_phy_cash, this.all_data,this.signatureImage_custodian1,this.signatureImage_custodian2,this.signatureImage_auditor, this.access['zone'], this.access['region'], this.access['location']]
  //   localStorage.setItem('CMSAppUserSavedVault', JSON.stringify(this.save_info))
  // }

  // deleteLocal() {
  //   localStorage.removeItem('CMSAppUserSavedVault')
  // }

  // editButton() {
  //   this.scrollTop()
  //   this.review_mode = false
  //   this.confirm_pressed = false
  // }

  // confirmButton() {

  //   this.confirm_pressed = true

  //   if (!this.webcamImageArr[0]) {
  //     this.callFinalAPI()
  //   }
  //   else {
  //     this.uploadImages()
  //   }
  // }

  // callFinalAPI() {

  //   this.request = {
  //     "checklist_type_id": 3,
  //     "username": this.access['username'],
  //     "total_score": this.total_score,
  //     "risk_score": this.risk_score,
  //     "branch_name": this.branch_name,
  //     "audit_done_by": this.audit_done_by,
  //     "date_of_audit": this.date_of_audit,
  //     "branch_manager": this.branch_manager,
  //     "vault_incharge": this.vault_incharge,
  //     "signature_img_custodian1":this.signatureImage_custodian1,
  //     "signature_img_custodian2":this.signatureImage_custodian2,
  //     "signature_img_auditor":this.signatureImage_auditor, 
  //     "is_delete":0,
  //     "name_cust1": this.name_cust1,
  //     "name_cust2": this.name_cust2,
  //     "comments": this.comments,
  //     "f12c1_rs": this.switch1,
  //     "f12c1_rr": this.rating1,
  //     "f13c1_rs": this.switch2,
  //     "f13c1_rr": this.rating2,
  //     "f13c2_rs": this.switch3,
  //     "f13c2_rr": this.rating3,
  //     "f14c1_rs": this.switch4,
  //     "f14c1_rr": this.rating4,
  //     "f14c2_rs": this.switch5,
  //     "f14c2_rr": this.rating5,
  //     "f14c3_rs": this.switch6,
  //     "f14c3_rr": this.rating6,
  //     "f14c4_rs": this.switch7,
  //     "f14c4_rr": this.rating7,
  //     "f15c1_rs": this.switch8,
  //     "f15c1_rr": this.rating8,
  //     "f15c2_rs": this.switch9,
  //     "f15c2_rr": this.rating9,
  //     "f16c1_rs": this.switch10,
  //     "f16c1_rr": this.rating10,
  //     "f17c1_rs": this.switch11,
  //     "f17c1_rr": this.rating11,
  //     "f18c1_rs": this.switch12,
  //     "f18c1_rr": this.rating12,
  //     "f18c2_rs": this.switch13,
  //     "f18c2_rr": this.rating13,
  //     "f18c3_rs": this.switch14,
  //     "f18c3_rr": this.rating14,
  //     "f19c1_rs": this.switch15,
  //     "f19c1_rr": this.rating15,
  //     "f19c2_rs": this.switch16,
  //     "f19c2_rr": this.rating16,
  //     "f19c3_rs": this.switch17,
  //     "f19c3_rr": this.rating17,
  //     "f19c4_rs": this.switch18,
  //     "f19c4_rr": this.rating18,
  //     "f20c1_rs": this.switch19,
  //     "f20c1_rr": this.rating19,
  //     "f20c2_rs": this.switch20,
  //     "f20c2_rr": this.rating20,
  //     "f20c3_rs": this.switch21,
  //     "f20c3_rr": this.rating21,
  //     "f21c1_rs": this.switch22,
  //     "f21c1_rr": this.rating22,
  //     "f22c1_rs": this.switch23,
  //     "f22c1_rr": this.rating23,
  //     "chk_zone": this.access['zone'],
  //     "chk_region": this.access['region'],
  //     "chk_location": this.access['location'],
  //     "lat_stamp": this.lat_stamp,
  //     "long_stamp": this.long_stamp,
  //     "images": this.image_names
  //   }

  //   const httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'X-Frame-Options': 'DENY'
  //     })
  //   };


  //   if (this.server_name) {
  //     this.http.post(this.service_name, this.request, httpOptions)
  //       .catch(error => {
  //         alert("Could not connect to the server. Retry after some time.")
  //         return EMPTY
  //       })
  //       .subscribe(data => {
  //         this.response = data
  //         alert("Submitted checklist ID is"+this.response.checklist_id)
  //         this.serviceCalled()
  //       });
  //   }
  // }

  // serviceCalled() {

  //   if (this.response['status'] && this.response['status'] == "Success") {
  //     this.sent_to_server = true
  //   }
  //   else {

  //     this.sent_to_server = false
  //   }

  //   if (this.sent_to_server) {
  //     this.deleteLocal()
  //     setTimeout(() => {
  //       this.router.navigateByUrl('/', { skipLocationChange: false }).then(() =>
  //         this.router.navigate(["/history"]));
  //     },
  //       2000);
  //   }
  //   else {
  //     this.error_sending = true
  //   }
  // }

  // calculateRatings() {
  //   if (this.switch1) this.rating1 = 1
  //   else this.rating1 = 3
  //   if (this.switch2) this.rating2 = 1
  //   else this.rating2 = 3
  //   if (this.switch3) this.rating3 = 1
  //   else this.rating3 = 3
  //   if (this.switch4) this.rating4 = 1
  //   else this.rating4 = 3
  //   if (this.switch5) this.rating5 = 1
  //   else this.rating5 = 3
  //   if (this.switch6) this.rating6 = 1
  //   else this.rating6 = 2
  //   if (this.switch7) this.rating7 = 1
  //   else this.rating7 = 3
  //   if (this.switch8) this.rating8 = 1
  //   else this.rating8 = 3
  //   if (this.switch9) this.rating9 = 1
  //   else this.rating9 = 3
  //   if (this.switch10) this.rating10 = 1
  //   else this.rating10 = 3
  //   if (this.switch11) this.rating11 = 1
  //   else this.rating11 = 3
  //   if (this.switch12) this.rating12 = 1
  //   else this.rating12 = 3
  //   if (this.switch13) this.rating13 = 1
  //   else this.rating13 = 3
  //   if (this.switch14) this.rating14 = 1
  //   else this.rating14 = 3
  //   if (this.switch15) this.rating15 = 1
  //   else this.rating15 = 3
  //   if (this.switch16) this.rating16 = 1
  //   else this.rating16 = 3
  //   if (this.switch17) this.rating17 = 1
  //   else this.rating17 = 3
  //   if (this.switch18) this.rating18 = 1
  //   else this.rating18 = 3
  //   if (this.switch19) this.rating19 = 1
  //   else this.rating19 = 3
  //   if (this.switch20) this.rating20 = 1
  //   else this.rating20 = 3
  //   if (this.switch21) this.rating21 = 1
  //   else this.rating21 = 3
  //   if (this.switch22) this.rating22 = 1
  //   else this.rating22 = 3
  //   if (this.switch23) this.rating23 = 1
  //   else this.rating23 = 3

  //   this.total_score = this.rating1 + this.rating2 + this.rating3 + this.rating4 + this.rating5 + this.rating6 + this.rating7 + this.rating8 + this.rating9 + this.rating10 + this.rating11 + this.rating12 + this.rating13 + this.rating14 + this.rating15 + this.rating16 + this.rating17 + this.rating18 + this.rating19 + this.rating20 + this.rating21 + this.rating22 + this.rating23
  //   if (this.total_score >= 50) this.risk_score = "High"
  //   else if (this.total_score >= 35) this.risk_score = "Medium"
  //   else if (this.total_score >= 23) this.risk_score = "Low"
  //   else this.risk_score = "None"

  // }

  // checkGeneralData() {

  //   if (this.branch_name && this.audit_done_by && this.date_of_audit && this.branch_manager && this.vault_incharge && this.name_cust1 && this.name_cust2 && this.access['location'] && this.access['region'] && this.access['zone']) {
  //     this.all_data = true
  //   }
  //   else {
  //     this.all_data = false
  //   }
  // }

  scrollTop() {
    var pageTop = document.querySelector('#pagetop');
    pageTop.scrollIntoView();
  }


  // wait(ms: number) {
  //   var start = new Date().getTime();
  //   var end = start;
  //   while (end < start + ms) {
  //     end = new Date().getTime();
  //   }
  // }

  checkIfStarted() {
    if (0) {
      return true
    }
    else {
      return false
    }
  }

  

}
