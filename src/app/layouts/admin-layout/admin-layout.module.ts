import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";

import { LbdModule } from "../../lbd/lbd.module";
import { NguiMapModule } from "@ngui/map";

import { AdminLayoutRoutes } from "./admin-layout.routing";

import { HomeComponent } from "../../home/home.component";
import { UserComponent } from "../../branch/user.component";
import { TablesComponent } from "../../reports/tables.component";
import { TypographyComponent } from "../../atm/typography.component";
import { IconsComponent } from "../../route/icons.component";
import { MapsComponent } from "../../vault/maps.component";
import { NotificationsComponent } from "../../login/notifications.component";
import { UpgradeComponent } from "../../upgrade/upgrade.component";
import { HistoryComponent } from "../../history/history.component";
import { PasswordComponent } from "../../password/password.component";
import { PositivePipe } from "../../positive.pipe";

import { UiSwitchModule } from "ngx-ui-switch";
import { NgxPaginationModule } from "ngx-pagination";
import { Ng2AutoCompleteModule } from "ng2-auto-complete";
import { WebcamModule } from "ngx-webcam";
import { TabsModule } from "ngx-tabset";

import { ConfirmDeactivateGuard1 } from "../../branch/user.component";
import { ConfirmDeactivateGuard2 } from "../../atm/typography.component";
import { ConfirmDeactivateGuard3 } from "../../route/icons.component";
import { ConfirmDeactivateGuard4 } from "../../vault/maps.component";
import { RegisterComponent } from "app/register/register.component";
import { RegforceComponent } from "app/regforce/regforce.component";
import { ForgetPasswordComponent } from "../../forget-password/forget-password.component";
import { DrilldownComponent } from "app/drilldown/drilldown.component";
import { EmployeeMasterComponent } from "app/employee-master/employee-master.component";
import { BulkuploadComponent } from "app/bulkupload/bulkupload.component";
import { SignaturePadModule } from "angular2-signaturepad";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { HotTableModule } from "ng2-handsontable";
import { TenantonboardComponent } from "../../tenantonboard/tenantonboard.component";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { ForgetPasswordDetailsComponent } from "../../forget-password-details/forget-password-details.component";
import { OtpComponent } from "../../otp/otp.component";
import { NgOtpInputModule } from "ng-otp-input";
// import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

//services
import { BranchServiceService } from "../../services/branch/branch-service.service";
import { LoginServiceService } from "../../services/login/login-service.service";

@NgModule({
  imports: [
    WebcamModule,
    NgxPaginationModule,
    UiSwitchModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    LbdModule,
    TabsModule.forRoot(),
    Ng2AutoCompleteModule,
    SignaturePadModule,
    HotTableModule,
    NgOtpInputModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot(),
    NgSelectModule,

    // ConfirmationPopoverModule.forRoot({
    //   confirmButtonType: 'danger', // set defaults here
    // }),
    NguiMapModule.forRoot({
      apiUrl: "https://maps.google.com/maps/api/js?key=YOUR_KEY_HERE",
    }),
  ],
  declarations: [
    HistoryComponent,
    HomeComponent,
    ForgetPasswordComponent,
    UserComponent,
    TablesComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    ForgetPasswordDetailsComponent,
    OtpComponent,
    NotificationsComponent,
    UpgradeComponent,
    RegisterComponent,
    RegforceComponent,
    PasswordComponent,
    DrilldownComponent,
    EmployeeMasterComponent,
    BulkuploadComponent,
    PositivePipe,
    TenantonboardComponent,
  ],
  providers: [
    ConfirmDeactivateGuard1,
    ConfirmDeactivateGuard2,
    ConfirmDeactivateGuard3,
    ConfirmDeactivateGuard4,
    LoginServiceService,
    BranchServiceService,
  ],
})
export class AdminLayoutModule {}
