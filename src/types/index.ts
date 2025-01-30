// import {s} from "vitest/dist/types-198fd1d9";
import { FilterOperatorTypeList, FilterSortDirectionList, Themes } from "@/constants";

export type SideMenuLink = {
  name: string;
  label: string;
  iconClass?: string;
  children?: SideMenuLink[];
};

export type TopMenuLink = {
  name: string;
  label: string;
  iconClass?: string;
  children?: SideMenuLink[];
};

export type AllocateTillOperator = {
  id: number;
  dateAssigned: string;
  till: string;
  manager: string;
  status: string;
}

export interface AccountResponse {
  createdAt: string
  emailVerified: boolean
  firstName: string
  id: string
  lastName: string
  phone: string
  phoneVerified: string
  role: string
  username: string
}

export interface Account {
  id: string;
  firstName: string;
  lastName: string;
  middleNames: string;
  middleName: string;
  idType: string;
  email: string;
  role: string;
  username: string
  emailVerified: boolean
  phoneVerified: boolean
  phone: string;
  status: string;
  createdAt: string;
  activatedAt: string;
  blockedAt: string;
}

export interface CreateAccount {
  firstName: string;
  lastName: string;
  middleName: string;
  role: string;
  username: string;
  phone: string;
}

// // allocate float interface
export interface AllocateFloat {
  firstName: string;
  branchId: string | null;
}


// AddManager
export interface AddManager {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  branchId: string | null;
}

export interface ManagerAccount {
  id: string;
  name: string;
  status: string;
  firstName: string;
  lastName: string;
  middleNames: string;
  username: string;
  email: string;
  branchName: string;
  branch: string;
  phone: string;
  role: string;
  createdAt: string;
  // emailVerified: boolean;
  phoneVerified: boolean;
  activatedAt: string;
}

export interface TillOperatorAccount {
  id: string;
  name: string;
  status: string;
  firstName: string;
  lastName: string;
  middleNames: string;
  username: string;
  email: string;
  branchName: string;
  branch: string;
  phone: string;
  role: string;
  createdAt: string;
  // emailVerified: boolean;
  phoneVerified: boolean;
  activatedAt: string;
}




export interface BackOfficeAccount {
  id: string;
  status: string;
  firstName: string;
  lastName: string;
  middleNames: string;
  username: string;
  email: string;
  phone: string;
  role: string;
  createdAt: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  activatedAt: string;
}

// AllocateManager type
export interface AssignManager {
  // branchId: string | null;
  managerId: string | null;
}


export interface ApiSuccess {
  status: number
  data: Object
  config: ApiConfig
}
export interface ApiError {
  code: string
  name: string
  message: string
  request: ApiRequest
  response: ApiResponse
  config: ApiConfig
}

export type APIResponse<T> = {
  success: boolean
  content: T;
  status?: number;
}

export interface ApiResponse {
  data: {
    data: Object
    message: string
    status: number
  }
}
export interface ApiRequest {
  response: string
  responseText: string
  responseURL: string
  status: number
}

export interface ApiConfig {
  baseURL: string
  data: string
}

export type TTheme = (typeof Themes)[number]

export type TGoFilterOperatorType = (typeof FilterOperatorTypeList)[number]

export interface IGoFilterOption {
  field: string
  operator: TGoFilterOperatorType
  operand: string | number
  caseSensitive?: boolean
}

export type TGoFilterSortType = (typeof FilterSortDirectionList)[number]

export interface TGoSortOption {
  field: string
  order: TGoFilterSortType
}

export interface IGoFilter {
  limit?: number
  offset?: number
  page?:number
  sort?: TGoSortOption[]
  filter?: IGoFilterOption[]
}

export interface IErrorResponse {
  type: string
  message: string
  code: string
  status: number
  data?: any[]
  fields?: any
}