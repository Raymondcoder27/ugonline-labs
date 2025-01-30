// domain/billing/stores.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/config/api";
import type { Transaction, FloatLedger, BackofficeUser, TillOperator, FloatAllocation, FloatRequest } from "@/branchmanagerdomain/finances/types";
import type { AllocateFloat } from "@/types";

export const useBilling = defineStore("billing", () => {
  // Dummy data for testing

  // use this for dummy transactions
  // <tr class="text-left">
  //           <!-- <th>#</th> -->
  //           <th>Tracking Number</th>
  //           <th>Service</th>
  //           <th>Provider</th>
  //           <th>Till</th>
  //           <!-- <th>Transaction Type</th> -->
  //           <th>Fee</th>
  //           <!-- <th>Status</th> -->
  //           <th>Date</th>
  //           <!-- <th>Actions</th> -->
  //         </tr>

  const dummyTransactions: Transaction[] = [
    {
      id: 1, trackingNumber: "TA123456",
      service: "Company Name Reservation", provider: "URSB", till: "Till 001",
      fee: 25000, date: "2021-09-01", status: "success", transactionID: "123456",
    },
    {
      id: 2, trackingNumber: "TB123457",
      service: "Create Postal Account", provider: "Posta Uganda",
      till: "Till 002", fee: 20000, date: "2021-09-02", status: "failed", transactionID: "123456",
    },
    {
      id: 3, trackingNumber: "TC123458",
      service: "National ID registration", provider: "NIRA",
      till: "Till 003", fee: 35000, date: "2021-09-03", status: "pending", transactionID: "123456",
    },
  ];


  // use this for dummy float requests
  // <th class="text-left">Date</th>
  // <th class="text-left">Name</th>
  // <th class="text-left"> till</th>
  // <th class="text-left">Amount</th>
  // <th class="text-left">Actions</th>

  const dummyFloatRequests: FloatRequest[] = [
    { id: 1, requestDate: "2021-09-01", amount: 12000000, status: "pending", till: "Till 1", approvedBy: null, requesterName: "", createdAt: "" },
    { id: 4, requestDate: "2021-09-04", amount: 10000000, status: "pending", till: "Till 4", approvedBy: null, requesterName: "", createdAt: "" },
    { id: 2, requestDate: "2021-09-02", amount: 18000000, status: "approved", till: "Till 2", approvedBy: "Manager One", requesterName: "", createdAt: "", date: "" },
    { id: 3, requestDate: "2021-09-03", amount: 9000000, status: "rejected", till: "Till 3", approvedBy: null, requesterName: "", createdAt: "" },
  ];

  const dummyFloatLedgers: FloatLedger[] = [
    { id: 1, date: "2021-09-01", description: "Recharge", amount: 20000000, balance: 20000000 },
    // { id: 2, date: "2021-09-02", description: "Till 1", amount: -20000000, balance: 300000000 },
  ];

  const dummyBackofficeUsers: BackofficeUser[] = [
    { id: 1, username: "admin1", fullName: "Jack Mwebe", role: "Administrator", till: "Till 1", status: "Active" },
    { id: 2, username: "manager1", fullName: "Katamba Johnson", role: "Manager", till: "Till 2", status: "Active" },
    { id: 3, username: "admin2", fullName: "Kasule Ronald", role: "Administrator", till: "Till 3", status: "Inactive" },
  ];

  // dummy  till manager data
  const dummyTillOperators: TillOperator[] = [
    { id: 1, username: "manager1", fullName: "Manager User One", role: "Manager", till: "Till 1", status: "Active" },
    { id: 2, username: "manager2", fullName: "Manager User Two", role: "Manager", till: "Till 2", status: "Active" },
    { id: 3, username: "manager3", fullName: "Manager User Three", role: "Manager", till: "Till 3", status: "Inactive" },
  ];

  // dummy float assignment data
  const dummyFloatAllocations: FloatAllocation[] = [
    { id: 1, dateAssigned: "2021-09-01", amount: 10000000, status: "Allocated", till: "Till 1" },
    { id: 2, dateAssigned: "2021-09-02", amount: 21000000, status: "pending", till: "Till 2" },
    { id: 3, dateAssigned: "2021-09-03", amount: 17000000, status: "failed", till: "Till 3" },
  ];


  // State variables
  const transactions = ref<Transaction[]>(dummyTransactions); // Use dummy data for now
  const totalAmount = ref(600); // Set a test value
  const totalBalance = ref(3000); // Set a test value
  const floatLedgers = ref<FloatLedger[]>(dummyFloatLedgers); // Use dummy data for now
  const backofficeUsers = ref<BackofficeUser[]>(dummyBackofficeUsers);
  const tillOperators = ref<TillOperator[]>(dummyTillOperators);
  const floatAllocations = ref<FloatAllocation[]>(dummyFloatAllocations);
  const floatRequests = ref<FloatRequest[]>(dummyFloatRequests);
  // const floatRequests = ref<FloatRequest[]>([]);


  // const floatRequests = JSON.parse(localStorage.getItem('floatRequestToBranchManagerLocalStorage') || '[]');

  // if (floatRequests) {
  //   floatRequests.value = floatRequests;
  // }


  // Actions to fetch data
  async function fetchTransactions(filter: any) {
    // Simulate API call
    // const response = await fetch(`/api/transactions?limit=${filter.limit}&page=${filter.page}`);
    // const data = await response.json();
    // Use dummy data for now
    transactions.value = dummyTransactions;
    // totalAmount.value = 600;  // Set a test value
    // totalBalance.value = 300000000; // Set a test value
  }

  async function fetchFloatLedgers(filter: any) {
    // Simulate API call
    // const response = await fetch(`/api/float-ledgers?limit=${filter.limit}&page=${filter.page}`);
    // const data = await response.json();
    // Use dummy data for now
    floatLedgers.value = dummyFloatLedgers;
  }

  async function fetchBackofficeUsers(filter: any) {
    // Simulate API call
    // You can adjust this based on the filtering criteria or paging
    backofficeUsers.value = dummyBackofficeUsers;
  }

  async function fetchTillOperators(filter: any) {
    // Simulate API call
    // You can adjust this based on the filtering criteria or paging
    tillOperators.value = dummyTillOperators;
  }

  async function fetchFloatAllocations(filter: any) {
    // Simulate API call
    // You can adjust this based on the filtering criteria or paging
    floatAllocations.value = dummyFloatAllocations;
  }

  // async function fetchFloatRequests(filter: any) {
  //   // Simulate API call
  //   // You can adjust this based on the filtering criteria or paging
  //   floatRequests.value = dummyFloatRequests;
  // }

  // using the api

  const fetchFloatRequests = async () => {
    return api.get("/till-operator/float-requests")
      .then((response: AxiosResponse<ApiResponse<any>>) => {
        floatRequests.value = response.data.data
      })
  }

  // function submit() {
  //   let payload = {
  //     amount: form.firstName,
  //     tillId: form.tillId,
  //   };
  //   loading.value = true;
  //   store
  //     .allocateFloat(payload)
  //     .then(() => {
  //       loading.value = false;
  //       notify.success(`Float assigned to ${form.tillId}.`);
  //       emit("cancel");
  //     })
  //     .catch(() => {
  //       loading.value = false;
  //     });
  // }

  // allocate float function, push to the float allocation array
  function allocateFloat(payload: AllocateFloat) {
    floatAllocations.value.push({
      id: floatAllocations.value.length + 1,
      dateAssigned: new Date().toISOString(),
      amount: payload.amount,
      status: "Allocated",
      till: payload.tillId,
    })
    //save to localstorage
    // saveTransactionsToLocalStorage();
  }

  const tillOperatorFloatBalance = ref(0);

  // const saveTransactionsToLocalStorage = () => {
  //   localStorage.setItem('tillOperatorFloatBalance', JSON.stringify(floatAllocations.value))
  // }

  // const savedFloatManagerBalance = JSON.parse(localStorage.getItem('tillOperatorFloatBalance') || '0');

  // if (savedFloatManagerBalance) {
  //   tillOperatorFloatBalance.value = savedFloatManagerBalance;
  // }


  // pass in the requestId
  // const approveFloatRequest = (requestId: any) => {
  //   store.approveFloatRequest(requestId);
  //   store.fetchFloatRequests();
  //   balanceStore.approveFloatRequest(requestId);
  //   store.reduceFloatLedger(requestId); 
  //   store.allocateFloat(requestId);
  //   console.log(`float request with id ${requestId} approved`);
  // };

  // allocate float based on approved float request
  function allocateFloatFromRequest(requestId: any) {
    const floatRequest = floatRequests.value.find((request) => request.id === requestId);
    if (floatRequest) {
      floatAllocations.value.push({
        id: floatAllocations.value.length + 1,
        dateAssigned: new Date().toISOString(),
        amount: floatRequest.amount,
        status: "Allocated",
        till: floatRequest.till,
      });


      // allocateFloatFromRequestToLocalStorage.value.push({
      //   id: allocateFloatFromRequestToLocalStorage.value.length + 1,
      //   dateAssigned: new Date().toISOString(),
      //   status: "Allocated",
      //   payload: floatRequest.amount,
      //    tillId: floatRequest.till,
      // })
      // saveFloatRequestToLocalStorage();
    }
    //save to localstorage
    // allocateFloatFromRequestToLocalStorage.value.push({
    //   id: allocateFloatFromRequestToLocalStorage.value.length + 1,
    //   dateAssigned: new Date().toISOString(),
    //   status: "Allocated",
    //   payload: floatRequest.amount,
    //    status: "Allocated",
    //    tillId: floatRequest.till,
    // })
    // saveFloatRequestToLocalStorage();
  }

  // const allocateFloatFromRequestToLocalStorage = ref<FloatRequest[]>([]);

  // const saveFloatRequestToLocalStorage = () => {
  //   localStorage.setItem('allocateFloatFromRequestToLocalStorage', JSON.stringify(allocateFloatFromRequestToLocalStorage.value))
  // }
  // allocate float allocation to float ledger array
  function adjustFloatLedger(payload: AllocateFloat) {
    floatLedgers.value.push({
      id: floatLedgers.value.length + 1,
      date: new Date().toISOString(),
      // description: "Till " + payload.tillId,
      description: payload.tillId,
      amount: -payload.amount,
      // balance: totalBalance.value + payload.amount,
    })
  }

  //   const allocateFloatFromRequestToLocalStorage = ref<FloatRequest[]>([]);

  // const saveFloatRequestToLocalStorage = () => {
  //   localStorage.setItem('allocateFloatFromRequestToLocalStorage', JSON.stringify(allocateFloatFromRequestToLocalStorage.value))
  // }

  async function reduceFloatLedger(requestId: any) {
    //  This is local storage 

    // end of local storage

    console.log("Approving float request with ID:", requestId);
    // Simulate API call
    // const response = await fetch(`/api/float-requests/${requestId}/approve`, {
    //   method: "POST",
    // });
    // const data = await response.json();

    // use request in floatledgers array id to figure out amount 
    const floatRequest = floatRequests.value.find(
      (request) => request.id === requestId
    );
    if (!floatRequest) {
      console.error("Float request not found");
      return;
    }
    floatLedgers.value.push({
      id: floatLedgers.value.length + 1,
      date: new Date().toISOString(),
      description: floatRequest.till,
      amount: -floatRequest.amount,
      // balance: 300000000 - floatRequest.amount,
    });
  }


  // const rejectFloatRequest = (requestId: any) => {
  //   store.rejectFloatRequest(requestId);
  //   store.fetchFloatRequests();
  //   console.log(`float request with id ${requestId} rejected`);
  // };



  // const approveFloatRequest = (requestId: any) => {
  //   store.approveFloatRequest(requestId);
  // };

  // const rejectFloatRequest = (requestId: any) => {
  //   store.rejectFloatRequest(requestId);
  // };

  // approve float request using passed in Id and set status to approved
  // function approveFloatRequest(requestId: any) {
  //   const floatRequest = floatRequests.value.find((request) => request.id === requestId);
  //   if (floatRequest) {
  //     floatRequest.status = "Approved";
  //     floatRequest.approvedBy = "Manager One";
  //   }
  // }

  // approve float request using passed in Id and set status to approved and modify the floatrequests array
  // function approveFloatRequest(requestId: any) {
  //   console.log("changing status")
  //   const floatRequest = floatRequests.value.find((request) => request.id === requestId);
  //   if (floatRequest) {
  //     floatRequest.status = "approved";
  //     //change the float request in the api too
  //     // floatRequest.approvedBy = "Manager One";
  //   }
  // }

  // //approve the float request using the api
  async function approveFloatRequest(requestId: any) {
    console.log("Request ID:", requestId); // Debugging
    // return api.post(`/branch-manager/approve-float-request/${requestId}`)
    return api.post("/branch-manager/approve-float-request/" + requestId)
      .then((response: AxiosResponse<ApiResponse<any>>) => {
        console.log("Approve Float Request response:", response.data);
        // const responseData = response.data
        // floatRequests.value = responseData
        // fetchFloatRequests();
        // fetchFloatLedgers();
        // fetchFloatAllocations();
      })
  }

  //approve the float request using the api
  //   async function approveFloatRequest(requestId: any) {
  //     console.log("Request ID:", requestId); // Debugging
  //     // return api.post(`/branch-manager/approve-float-request/${requestId}`)
  //     return api.post("/branch-manager/approve-float-request/"+requestId)
  //         .then((response: AxiosResponse<ApiResponse<any>>) => {
  //             console.log("Approve Float Request response:", response.data);
  //             fetchFloatRequests();
  //             // fetchFloatLedgers();
  //             // fetchFloatAllocations();
  //         })
  // }

  // reject float request using passed in Id and set status to rejected
  function rejectFloatRequest(requestId: any) {
    const floatRequest = floatRequests.value.find((request) => request.id === requestId);
    if (floatRequest) {
      floatRequest.status = "rejected";
    }
  }

  return {
    transactions,
    totalAmount,
    totalBalance,
    floatLedgers,
    backofficeUsers,
    tillOperators,
    floatAllocations,
    floatRequests,
    tillOperatorFloatBalance,
    reduceFloatLedger,
    approveFloatRequest,
    adjustFloatLedger,
    rejectFloatRequest,
    fetchFloatRequests,
    fetchTransactions,
    fetchFloatLedgers,
    fetchBackofficeUsers,
    fetchTillOperators,
    fetchFloatAllocations,
    allocateFloat,
    allocateFloatFromRequest,
  };
});
