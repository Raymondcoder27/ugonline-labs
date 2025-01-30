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