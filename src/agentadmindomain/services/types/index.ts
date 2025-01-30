import type {FormSection} from "@/agentadmindomain/composer/types/formtypes";

export interface ServiceResponseInterface {
    success: boolean
    type: string
    data: Object
    time: number
}

export type Service = {
    id: string;
    name: string;
    description: string;
    accessibilityTier:string;
    thumbnail:string;
    featureId: string;
    requirements: string[];
    providerId: string
    providerName: string
    createdAt: GoValueTime;
    status:string
    currentVersionId:string
};


export type ServiceSpecification = {
    id: string;
    providerId:string
    serviceId:string
    feature:GoValueString
    status:string
    submitEndpoint:string
    data:SpecData
    version:string
    createdAt:string
    requestType:GoValueString
    activityStatus:string
}

export type SpecData = {
    form: {
        sections: FormSection[]
    }
}

export type GoValueString = {
    String:string
    Valid:boolean
}

export type GoValueInt = {
    Int32:number
    Valid:boolean
}

export type GoValueTime ={
    Time:string
    Valid:boolean
}

export type CreateService = {
    name: string;
    description: string;
    requirements: string[];
    providerId: string;
};