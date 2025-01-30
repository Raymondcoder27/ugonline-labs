export interface ProviderResponseInterface {
    success: boolean
    type: string
    data: Object
    time: number
}

export interface ServiceProvider {
    id: string;
    name: string;
    displayName: string;
    providerType: string;
    displayLogo: string;
    information: string;
    inquiryEmail:string;
    inquiryPhoneNumber:string;
    physicalAddress:string;
    activityStatus:string
    createdAt: string;
    updatedAt: string;
}

export interface CreateServiceProvider {
    name: string;
    displayLogo:File | null
    displayName: string;
    providerType:string;
    physicalAddress: string;
    inquiryEmail: string;
    inquiryPhoneNumber: string;
    username:string;
}