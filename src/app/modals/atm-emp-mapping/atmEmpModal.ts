export class AtmEmpMapping {
    UserId: number;
    AtmEmployeeData: Array<AtmEmployeeData>=[]
}

export class AtmEmployeeData {
    atmId: string;
    // Employee1Id:number;
    // Employee2Id: number;
    AtmCode: number;
    Emp1Code: string;
    Emp2Code: string;
    CompanyCode: string;
    FromDate: string
    BranchCode:string

}