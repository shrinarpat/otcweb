import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/home', title: 'Home', icon: 'pe-7s-home', class: '' },
  { path:'/tenantonboard', title:' Add Customer ', icon:'pe-7s-add-user',class:''},
  { path: '/branch', title: ' Manage Branch  ', icon: 'pe-7s-culture', class: '' },
  { path: '/atm', title: ' Manage ATM ', icon: 'pe-7s-cash', class: '' },
  { path: '/empoyemaster', title: ' Manage Employee ',  icon:'pe-7s-smile', class: '' },
  { path: '/atmmap', title: 'Mapping of ATM-Employee', icon: 'pe-7s-timer', class: '' },
  { path: '/tranapprove', title: 'Approvals', icon: 'pe-7s-car', class: '' },
  { path: '/fieldemp', title: 'Field Employees', icon: 'pe-7s-safe', class: '' },
  { path: '/dailyactivity', title:  'Daily Activities of ATM', icon: 'pe-7s-news-paper', class: '' },
   //{ path: '/staff', title: 'Staff Roles',  icon:'pe-7s-id', class: '' },
   { path: '/bulkupload', title: 'Bulk Upload',  icon:'pe-7s-rocket', class: '' }
 
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  menuItems: any[];

  login_token: any
  access: any
  toggleButton: any
  task:string='LOGIN';

  constructor(private router: Router) { }

  ngOnInit() {

    this.login_token = localStorage.getItem('CMSAppUserLogin');
    if (this.login_token) {
      this.task='LOGOUT'
      this.access = JSON.parse(this.login_token);
      console.log("--",this.access)
      
      this.access['home'] = true
      if(this.access['Entity']['atm_emp_mapping']!='NoAccess'){
        this.access['atmmap'] = true

      }
      if(this.access['Entity']['atm_master']!='NoAccess'){
        this.access['atm'] = true;

      }
      if(this.access['Entity']['branch_master']!='NoAccess'){
        this.access['branch'] = true

      }
      if(this.access['Entity']['daily_activity_master']!='NoAccess'){
        this.access['dailyactivity'] = true;

      }
      if(this.access['Entity']['transaction_approval_master']!='NoAccess'){
        this.access['tranapprove'] = true;

      }
      if(this.access['Entity']['company_master']!='NoAccess'){
        this.access['tenantonboard']=true;

      }
      if(this.access['Entity']['field_emp_master']!='NoAccess'){
        this.access['empoyemaster']=true;

      }
      if(this.access['Entity']['user_master']!='NoAccess'){
        this.access['staff'] = true;

      }
      if(this.access['Entity']['bulk_upload']!='NoAccess'){
        this.access['bulkupload'] = true;

      }
      // this.access['branch'] = true
      // this.access['atm'] = true;
      // this.access['empoyemaster']=true; field_emp_master
      // this.access['atmmap'] = true
      // this.access['tranapprove'] = true;
      // // this.access['fieldemp'] = true
      // this.access['dailyactivity'] = true;
      // this.access['staff'] = true;  user_master:
      // this.access['bulkupload'] = true;
      // this.access['tenantonboard']=true;
    }

    this.menuItems = ROUTES.filter(menuItem => menuItem);

  }

  showItem(menuItem: any) {

    var link_item = menuItem.path.substr(1)

    if (this.access[link_item]) {
      return true
    }
    else {
      return false
    }
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };


  sidebarClose() {
    this.toggleButton = document.getElementsByClassName('navbar-toggle')[0];
    const body = document.getElementsByTagName('body')[0];
    this.toggleButton.classList.remove('toggled');
    body.classList.remove('nav-open');
  };

}
