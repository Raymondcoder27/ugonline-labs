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

// types/account.ts
export interface IAccount {
    firstName: string;
    lastName: string;
    middleNames?: string;
    username: string;
    phone: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    role: string;
    createdAt: string;
    blockedAt?: string;
    activatedAt?: string;
  }
  

export type Transaction = {
    id: string;
    branchName: string;
    manager: string;
    transactionType: string;
    status: string;
    date: string;
    amount: number;
  };

export interface FloatLedger {
  id: string;
  date: string;
  description: string;
  amount: number;
  balance: number;
  createdAt: string; 
}

export interface FloatRequest {
  id: number;
  requestDate: string;
  amount: number;
  status: string;
  requesterName: string;
  till: string;
  approvedBy: string | null;
  createdAt: string; 
}

//float assignment
export interface FloatAllocation {
  // id: string;
  id: number;
  dateAssigned: string;
  amount: number;
  status: string;
  assignedTo: string;
  assignedBy: string;
  createdAt: string; 
}

export interface FloatManagement {
  id: string;
  totalAmount: number;
  usedAmount: number;
  availableAmount: number;
}

export interface BillingResponse<T> {
  success: boolean;
  type: string;
  data: T;
  time: number;
}

export interface AccountsData {
  data: Account[];
  pages: number;
}

export interface BackofficeUser {
    id: number;
    username: string;
    fullName: string;
    role: string;
    branch: string;
    status: string;
    dateAssigned: string;
  }

// export interface BranchManager {
//     id: number;
//     username: string;
//     fullName: string;
//     role: string;
//     branch: string;
//     status: string;
//     dateAssigned: string;
//   }

export interface TillOperator {
  id: number;
  username: string;
  fullName: string;
  role: string;
  branch: string;
  status: string;
  dateAssigned: string;
}

  // const dummyFloatRequests: FloatRequest[] = [
  //   { id: 1, requestDate: "2021-09-01", amount: 10000000, status: "Pending", branch: "Branch 1", approvedBy: null },
  //   { id: 2, requestDate: "2021-09-02", amount: 20000000, status: "Approved", branch: "Branch 2", approvedBy: "Manager One" },
  //   { id: 3, requestDate: "2021-09-03", amount: 30000000, status: "Rejected", branch: "Branch 3", approvedBy: null },
  //   { id: 4, requestDate: "2021-09-04", amount: 40000000, status: "Pending", branch: "Branch 4", approvedBy: null },
  // ];

  export interface FloatRequest {
    id: number;
    date: string;
    amount: number;
    status: string;
    till: string;
    approvedBy: string | null;
  }

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
  

