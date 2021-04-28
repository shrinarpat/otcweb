export class DailyActivityModal {
    UserID: number;
    DailyActivity:Array<DailyActivity>=[]

   
}
export class DailyActivity {
      CompanyID:number
      ATMID: string;
      ATMCode:number;
      TransDate: string;
      TRTYPE: string;  
      ActivityId: number;
      ActivityName:string
    //   ToDate: string;
      CompanyName: string
}