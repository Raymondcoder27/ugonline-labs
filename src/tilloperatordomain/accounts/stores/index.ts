import type { Account, AccountResponse, IGoFilter, IErrorResponse } from "@/types";
import { defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
import api from "@/config/api";
import type { AccountResponseInterface, AccountsData, IResendVerificationPayload } from "@/tilloperatordomain/accounts/types";
import { useGoRequest } from "@/composables/go-request";
import { useNotificationsStore } from "@/stores/notifications";
import { AxiosError } from "axios";
import { useCommonsStore } from "../../../stores/commons";

export const useAccounts = defineStore("user-management", () => {
  const response: Ref<AccountResponse | undefined> = ref();
  const userAccounts: Ref<Account[]> = ref([]);
  const backofficeAccounts: Ref<Account[]> = ref([]);


  let accounts: Account[];
  accounts = [
    {
      id: "d70f633c-3d01-11ee-be56-0242ac120002",
      firstName: "Isaac",
      lastName: "Abok",
      middleName: "Odongo",
      idType: "NATIONAL_ID",
      idNumber: "CM90011001DVJE",
      departmentId: "d70f633c-3d01-11ee-be56-6742ac120002",
      email: "jondoe@mailinator.com",
      phone: "0772100090",
      status: "active",
      createdAt: "10-10-2022",
    },
    {
      id: "d70f633c-3d01-11ee-be56-0242ac120002",
      firstName: "Julius",
      lastName: "Pilus",
      middleName: "Madieci",
      idType: "NATIONAL_ID",
      idNumber: "CM90011001DVJE",
      departmentId: "d70f633c-3d01-11ee-be56-6742ac120002",
      email: "jondoe@mailinator.com",
      phone: "0772100090",
      status: "active",
      createdAt: "10-10-2022",
    },
    {
      id: "d70f633c-3d01-11ee-be56-0242ac120002",
      firstName: "Jackson",
      lastName: "Rubinganaho",
      middleName: "",
      idType: "NATIONAL_ID",
      idNumber: "CM90011001DVJE",
      departmentId: "d70f633c-3d01-11ee-be56-6742ac120002",
      email: "jondoe@mailinator.com",
      phone: "0772100090",
      status: "active",
      createdAt: "10-10-2022",
    },
    {
      id: "d70f633c-3d01-11ee-be56-0242ac120002",
      firstName: "Stephen",
      lastName: "Barungi",
      middleName: "",
      idType: "NATIONAL_ID",
      idNumber: "CM90011001DVJE",
      departmentId: "d70f633c-3d01-11ee-be56-6742ac120002",
      email: "jondoe@mailinator.com",
      phone: "0772100090",
      status: "active",
      createdAt: "10-10-2022",
    },
    {
      id: "d70f633c-3d01-11ee-be56-0242ac120002",
      firstName: "Johnson",
      lastName: "Bizimana",
      middleName: "",
      idType: "NATIONAL_ID",
      idNumber: "CM90011001DVJE",
      departmentId: "d70f633c-3d01-11ee-be56-6742ac120002",
      email: "jondoe@mailinator.com",
      phone: "0772100090",
      status: "pending",
      createdAt: "10-10-2022",
    },
    {
      id: "d70f633c-3d01-11ee-be56-0242ac120002",
      firstName: "Donald",
      lastName: "Robinson",
      middleName: "Jack",
      idType: "NATIONAL_ID",
      idNumber: "CM90011001DVJE",
      departmentId: "d70f633c-3d01-11ee-be56-6742ac120002",
      email: "jondoe@mailinator.com",
      phone: "0772100090",
      status: "active",
      createdAt: "10-10-2022",
    },
    {
      id: "d70f633c-3d01-11ee-be56-0242ac120002",
      firstName: "Andrew",
      lastName: "Muyingo",
      middleName: "Steven",
      idType: "NATIONAL_ID",
      idNumber: "CM90011001DVJE",
      departmentId: "d70f633c-3d01-11ee-be56-6742ac120002",
      email: "jondoe@mailinator.com",
      phone: "0772100090",
      status: "active",
      createdAt: "10-10-2022",
    },
    {
      id: "d70f633c-3d01-11ee-be56-0242ac120002",
      firstName: "Morientes",
      lastName: "Calabasis",
      middleName: "Rujo",
      idType: "NATIONAL_ID",
      idNumber: "CM90011001DVJE",
      departmentId: "d70f633c-3d01-11ee-be56-6742ac120002",
      email: "jondoe@mailinator.com",
      phone: "0772100090",
      status: "pending",
      createdAt: "10-10-2022",
    },
    {
      id: "d70f633c-3d01-11ee-be56-0242ac120002",
      firstName: "June",
      lastName: "Alabaster",
      middleName: "",
      idType: "NATIONAL_ID",
      idNumber: "CM90011001DVJE",
      departmentId: "d70f633c-3d01-11ee-be56-6742ac120002",
      email: "jondoe@mailinator.com",
      phone: "0772100090",
      status: "pending",
      createdAt: "10-10-2022",
    },
    {
      id: "d70f633c-3d01-11ee-be56-0242ac120002",
      firstName: "Halima",
      lastName: "Nanteza",
      middleName: "",
      idType: "NATIONAL_ID",
      idNumber: "CM90011001DVJE",
      departmentId: "d70f633c-3d01-11ee-be56-6742ac120002",
      email: "jondoe@mailinator.com",
      phone: "0772100090",
      status: "blocked",
      createdAt: "10-10-2022",
    },
  ];


  const request = useGoRequest()
  const notify = useNotificationsStore()
  const commons = useCommonsStore()

  const createAccount = async (payload: any) => {
    return api.post<AccountResponseInterface<AccountResponse>>(`/auth/admin/users`, payload)
      .then((response: any) => {
        response.value = response.data
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        commons.formatError(error)
      })
  }

  const fetchUserAccounts = async (filter: IGoFilter) => {
    return api.get<AccountResponseInterface<AccountsData>>(`/auth/admin/users${request.prepareQuery(filter, "?role=public")}`)
      .then((response: any) => {
        userAccounts.value = response.data.data
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        commons.formatError(error)
      })
  }

  const fetchBackofficeAccounts = async (filter: IGoFilter) => {
    return api.get<AccountResponseInterface<AccountsData>>(`/auth/admin/users${request.prepareQuery(filter, "?role=admin")}`)
      .then((response: any) => {
        backofficeAccounts.value = response.data.data
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        commons.formatError(error)
      })
  }

  const resendAccountVerification = async (payload: IResendVerificationPayload) => {
    return api.post<AccountResponseInterface<AccountResponse>>(`/auth/resend-verification`, payload)
      .then((response: any) => {
        response.value = response.data.data
        if (payload.purpose === "email") {
          notify.success(`An account verification email has been sent to ${payload.username.toLowerCase()}`)
        } else if (payload.purpose === "phone") {
          notify.success(`An OTP has been sent to the phone number associated with ${payload.username.toLowerCase()}`)
        } else if (payload.purpose === "change-password") {
          notify.success(`A password reset email has been sent to ${payload.username.toLowerCase()}`)
        }
      })
      .catch((error: AxiosError<IErrorResponse>) => {
        commons.formatError(error)
      })
  }

  return { response, userAccounts, backofficeAccounts, createAccount, fetchBackofficeAccounts, fetchUserAccounts, resendAccountVerification };
})
