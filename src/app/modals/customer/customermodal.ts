export class NewCustomer {
    UserID: string ;
    CompanyDetails: CompanyDetails;
}
    
export class CompanyDetails{
    CompanyID:number;
    CompanyCode: string;
    CompanyName: string;
    StartDate: string;
    EndDate: string;
    total_atm_count: number;
    ContactPersonName: string;
    ContactPersonPhone: string;
    ContactPersonEmail: string;
    CMSExecutive: string;
    CompanyLogo: string;
    MasterApproval: boolean;
    TransactionApproval: boolean;
    UserName:string;
    UserEmail:string;
    EmpName:string;
    RegMobileNumber:string;
    EmpCode:string;
    Active: boolean;
}