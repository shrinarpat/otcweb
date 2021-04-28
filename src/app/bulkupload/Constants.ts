export var select_category = 
        [
                'Manage Branch','Manage ATM', 'Manage Employee','Mapping OF ATM Employee','Daily Activities'
        ]

export var atm_master_col = 
        [
            "Branch Name","ATMID","Bank Name","Address",
            "Pin Code","ATM Lock Serial No"
        ];
       

export var emp_master_col =
        [
                "Branch Name","Emp Code","Emp Name","Reg Mobile Number"
        ]; 

export var branch_master_col =
        [
                "Branch Code","Branch Name"
        ];

export var daily_activity_col =
        [
            "Activity Name","ATM Code","Activity Date"
        ];

export var atm_emp_col =
        [
               "Atm Code","Emp1 Code","Emp2 Code","From Date"
        ]


        export var atm_master_col_apr = 
        [
            "ATMID","Bank Name","Address",
            "Pin Code","ATM Lock Serial No"
        ];
       

export var emp_master_col_apr =
        [
                "Emp Code","Emp Name","Reg Mobile Number"
        ]; 



export var daily_activity_col_apr =
        [
            "Activity Name","ATM Code","Activity Date"
        ];

export var atm_emp_col_apr =
        [
                "Atm Code","Emp1 Code","Emp2 Code","From Date"
        ]



export var dailyactivities = {
        1:"Cash Replacement", 2:"FLM", 3:"SLM",4:"Audit"
}

export var date_month ={
        "JAN":"01","FEB":"02","MAR":"03","APR":"04","MAY":"05","JUN":"06","JUL":"07","AUG":"08","OCT":"10",
        "NOV":"11","DEC":"12"
}


export var daily_activity_data_type =
        [
                {
                        type:"text"
                },
                {
                        type:"numeric"
                },
                {
                        type:"date"
                }
        ]


