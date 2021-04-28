export class Branch
{

  userId: string;
  CompanyCode: string;

  addBranchReqchildModels:  Array<addBranchReqchildModels>=[];

}
  export class addBranchReqchildModels{ 
    BranchID: number;
    BranchCode: string;
    BranchName: string;
    Active: boolean;
   
  }
