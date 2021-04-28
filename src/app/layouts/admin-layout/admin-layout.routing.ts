import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import {ForgetPasswordComponent} from '../../forget-password/forget-password.component'
import { UserComponent } from '../../branch/user.component';
import { TablesComponent } from '../../reports/tables.component';
import { TypographyComponent } from '../../atm/typography.component';
import { IconsComponent } from '../../route/icons.component';
import { MapsComponent } from '../../vault/maps.component';
import { NotificationsComponent } from '../../login/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { HistoryComponent } from '../../history/history.component'


import { ConfirmDeactivateGuard1 } from '../../branch/user.component';
import { ConfirmDeactivateGuard2 } from '../../atm/typography.component';
import { ConfirmDeactivateGuard3 } from '../../route/icons.component';
import { ConfirmDeactivateGuard4 } from '../../vault/maps.component';
import { RegisterComponent } from 'app/register/register.component';
import { RegforceComponent } from 'app/regforce/regforce.component';
import { PasswordComponent } from '../../password/password.component';
import { DrilldownComponent } from 'app/drilldown/drilldown.component';
import {  EmployeeMasterComponent } from 'app/employee-master/employee-master.component';
import {BulkuploadComponent} from 'app/bulkupload/bulkupload.component';
import { TenantonboardComponent } from 'app/tenantonboard/tenantonboard.component';
import { ForgetPasswordDetailsComponent } from '../../forget-password-details/forget-password-details.component';
import { OtpComponent } from '../../otp/otp.component';


export const AdminLayoutRoutes: Routes = [
    { path: 'home', component: DrilldownComponent },
    {path:'forgetpassword',component:ForgetPasswordComponent},
    {path:'forgetpassworddetails',component:ForgetPasswordDetailsComponent},
    {path:'otp',component:OtpComponent},
    { path: 'staff', component: HomeComponent },
    { path: 'branch', component: UserComponent, canDeactivate:[ConfirmDeactivateGuard1] },
    { path: 'dailyactivity', component: TablesComponent },
    { path: 'atm', component: TypographyComponent, canDeactivate:[ConfirmDeactivateGuard2] },
    { path: 'tranapprove',  component: IconsComponent, canDeactivate:[ConfirmDeactivateGuard3] },
    { path: 'fieldemp',  component: MapsComponent, canDeactivate:[ConfirmDeactivateGuard4] },
    { path: 'login',  component: NotificationsComponent },
    { path: 'upgrade', component: UpgradeComponent },
    { path: 'atmmap', component: HistoryComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'regforce', component: RegforceComponent },
    { path: 'password', component: PasswordComponent },
    { path: 'drilldown', component: DrilldownComponent },
    { path: 'empoyemaster', component: EmployeeMasterComponent },
    { path: 'bulkupload', component:BulkuploadComponent },
    { path:'tenantonboard',component:TenantonboardComponent}
];
