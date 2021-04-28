export class EmployeeEdit {
  UserId: number;
  EmployeeData: Array<UserDetails> = [];
}

export class UserDetails {
  EmpID: number;
  BranchID: number;
  BranchCode: string;
  CompanyID: number;
  Active: boolean;
  EmpCode: string;
  RegMobileNumber: string;
  EmpName: string;
  DeRegister: boolean;
}

export class EmployeeAdd {
  UserId: number;
  EmployeeData: Array<UserData> = [];
}

export class UserData {
  EmpName: string;
  EmpCode: string;
  BranchID: number;
  BranchCode: string;
  RegMobileNumber: string;
  CompanyID: number;
  CompanyCode: string;
  IsUser: boolean;
  RoleTypeId: number;
  UserName: string;
  UserEmail: string;
}
