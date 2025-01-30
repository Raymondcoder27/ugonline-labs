import type {GoValueInt, GoValueString, GoValueTime} from "@/branchmanagerdomain/services/types";

export interface GatewayResponseInterface {
    success: boolean
    type: string
    data: Object
    time: number
}

export interface Feature {
    id: string
    label:string
    status:string
    publishedAt: string
    createdAt: string
    updatedAt: string
}

export interface DeadLetter {
    id: string
    messageId: string
    featureId: string
    providerId: string
    retryIdx:number
    createdAt: string
    failedAt: GoValueTime
    succeededAt: GoValueTime
    error: GoValueString
    responseBody: GoValueString
    responseCode: GoValueInt
    responseHeaders:string
}

export interface Webhook {
    id: string
    applicationId:string
    requestId:string
    messageId:string
    featureId:string
    providerId:string
    remoteIp:string
    headers:Object
    method:string
    payload:string
    createdAt: string
    updatedAt: string
    processedAt: string
}

export interface ApplicationRequest {
    id: string
    requestId:string
    endpoint:string
    method:string
    payload:string
    providerId:string,
    headers:[]
    responseBody:GoValueString
    responseCode:GoValueInt
    error:GoValueString
    succeededAt:GoValueTime
    failedAt: GoValueTime
    createdAt: string
}

/**
 * ProviderConfig
 */
export interface ProviderConfig {
    certConfig: CertConfig;
    policy: Policy;
    providerId: string;
    vpnConfig: VpnConfig;
    [property: string]: any;
}

/**
 * CertConfig
 */
export interface CertConfig {
    description?: string;
    key?: string;
    private?: string;
    public?: string;
    type?: string;
    [property: string]: any;
}

/**
 * Policy
 */
export interface Policy {
    pingTimeoutSec?: number;
    protocol?: string;
    requestHeaders?: RequestHeader[];
    requestMethod?: string;
    requestMime?: string;
    requestPayloadLocation?: string;
    requestRetryIntervalSec?: number;
    requestRetryThreshold?: number;
    requestTimeoutSec?: number;
    specificationId?: null | string;
    [property: string]: any;
}

/**
 * RequestHeader
 */
export interface RequestHeader {
    name: string;
    value: string;
    [property: string]: any;
}

/**
 * VpnConfig
 */
export interface VpnConfig {
    backupIps?: string[];
    encryptionAlgo?: string;
    encryptionScheme?: string;
    keepalive?: boolean;
    keepaliveSec?: number;
    lifetime?: string;
    mode?: string;
    peerIp?: string;
    preSharedKey?: string;
    [property: string]: any;
}

export interface GatewayError{
    type:string
    message:string
    code:number
    status:string
    params:Object
}


