// billing/types/index.ts

// Define the basic account and transaction types
import { Account } from "@/types";
import { AccountVerificationTypes } from "../constants";

// Billing-related types
// export interface Transaction {
//   id: string;
//   date: string;
//   description: string;
//   amount: number;
//   balance: number;
//   createdAt: string; 
// }

  export type TotalBalance = {
    amount: number;
  };


export type TAccountVerificationType = (typeof AccountVerificationTypes)[number];

export interface IResendVerificationPayload {
  purpose: TAccountVerificationType | "";
  username: string;
}

export type IGoFilter = {
    limit: number;
    offset: number;
    page: number;
    sort: Array<{
      field: string;
      order: string;
    }>;
    filter: Array<{
      field: string;
      operand: string;
      operator: string;
    }>;
  };


  // types/resendVerification.ts
export interface IResendVerificationPayload {
    purpose: string;
    username: string;
  }
  
  export type TAccountVerificationType = "change-password" | "email-verification";
  

