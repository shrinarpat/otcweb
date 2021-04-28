export class AtmMaster {
   
    UserId: number;
    CompanyCode: string;

    AtmMasterModel:  Array<ATMMasterModel>=[];
      
    
}

export class ATMMasterModel {
            ATMID: string ;
            ATMCode: string;
            Latitude: number;
            Longitude:number;
            BranchID: string;
            Location: string;
            PinCode: number;
            Active: boolean;
            ZoneCode: string;
            FencingRadius: Number;
            ATMLockSerialNo: string;
            Address: string;
            BankName: string;
            CompanyID:number;
            CompanyName: string;
            BranchName:string;

}