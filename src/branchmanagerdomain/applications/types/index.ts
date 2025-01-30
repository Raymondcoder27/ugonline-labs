// import {s} from "vitest/dist/types-198fd1d9";


export type ClientApplication = {
    id: string
    serviceName: string
    userId: string
    providerName: string
    trackingNo: string
    status: string
    username: string
    createdAt: string
    paymentInfo:{
        payment_ref:string
    },
    data:object
};

export type ApplicationStatistics = {
    awaitingPayment: number,
    completed: number,
    paymentConfirmed: number,
    paymentFailed: number,
    paymentProcessing: number,
    pending: number,
    sent: number,
    submitted: number,
    total: number

}

