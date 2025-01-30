import type { Account } from "@/types";
import { AccountVerificationTypes } from "../constants";

export interface AccountResponseInterface<T> {
    success: boolean
    type: string
    data: T
    time: number
}

export interface AccountsData {
    data: Account[]
    pages: number
}

export type TAccountVerificationType = (typeof AccountVerificationTypes)[number]
export interface IResendVerificationPayload {
    purpose: TAccountVerificationType | ""
    username: string
}