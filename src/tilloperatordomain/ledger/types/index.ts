export interface GraphData {
   data:Statistic[]
}

export interface Statistic {
    x:string
    y:number
}

export interface ProviderRegistrationStatistic {
    date:string
    providers:number
}

export interface FloatRequest {
    id:number
    requestDate:string
    amount:number
    status:string
    branchId:number
    tillId: string
    balance:number
}

export interface RequestFloat {
    amount:number
    till:string
    description:string
    // branch:string
}