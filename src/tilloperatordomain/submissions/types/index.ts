// billing/types/index.ts

// Define the basic account and transaction types
import { Account } from "@/types";
import { AccountVerificationTypes } from "../constants";

// <thead>
//             <tr class="header-tr">
//               <th class="t-header">#</th>
//               <th class="t-header">Service</th>
//               <th class="text-right t-header">Provider</th>
//               <th class="text-right t-header">Fee</th>
//               <th class="t-header">Date</th>
//             </tr>
//           </thead>

export interface Submission {
  id: string;
  service: string;
  provider: string;
  fee: number;
  date: string;
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
  id: string;
  requestDate: string;
  amount: number;
  status: string;
  requesterName: string;
  approvedBy: string | null;
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

