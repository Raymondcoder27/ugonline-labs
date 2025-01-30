// domain/billing/stores.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import moment from "moment";
import api from "@/config/api";
import type { Transaction, FloatLedger, FloatRequest, RequestFloat } from "@/tilloperatordomain/billing/types";

export const useBilling = defineStore("billing", () => {
  // Dummy data for testing
  const dummyTransactions: Transaction[] = [
    { id: 1, amount: 100, description: "Sample Transaction 1" },
    { id: 2, amount: 200, description: "Sample Transaction 2" },
    { id: 3, amount: 300, description: "Sample Transaction 3" },
  ];

  // const dummyFloatLedgers: FloatLedger[] = [
  //   { id: 1, name: "Sample FloatLedger 1", balance: 500 },
  //   { id: 2, name: "Sample FloatLedger 2", balance: 1000 },
  //   { id: 3, name: "Sample FloatLedger 3", balance: 1500 },


  // ];


  const dummyFloatLedgers: FloatLedger[] = [
    //15000000 recharge
    { id: 1, description: "Recharge", amount: 15000000, balance: 15000000, status: "success", date: "2021-09-01", },
    { id: 1, description: "Service fee", amount: -25000, balance: 5000000, status: "success", date: "2021-09-01", },
    { id: 2, description: "Recharge", amount: 500000, balance: 5500000, status: "success", date: "2021-09-02", },
    { id: 3, description: "Service fee", amount: -40000, balance: 5460000, status: "pending", date: "2021-09-03", },
    { id: 4, description: "Service fee", amount: -30000, balance: 5430000, status: "failed", date: "2021-09-04", },
  ];

  // dummy float requests
  const dummyFloatRequests: FloatRequest[] = [
    { id: 1, requestDate: "2021-09-01", amount: 15000000, status: "pending", branchId: 1 },
    { id: 2, requestDate: "2021-09-02", amount: 500000, status: "approved", branchId: 2 },
    { id: 3, requestDate: "2021-09-03", amount: 40000, status: "rejected", branchId: 3 },
    { id: 4, requestDate: "2021-09-04", amount: 30000, status: "pending", branchId: 4 },
  ];

  // State variables
  const transactions = ref<Transaction[]>(dummyTransactions); // Use dummy data for now
  const totalAmount = ref(600); // Set a test value
  const totalBalance = ref(3000); // Set a test value
  const floatLedgers = ref<FloatLedger[]>(dummyFloatLedgers); // Use dummy data for now

  // const allocateFloatFromRequestToLocalStorage = JSON.parse(localStorage.getItem('allocateFloatFromRequestToLocalStorage') || '0');

  // if (allocateFloatFromRequestToLocalStorage) {
  //   floatLedgers.value = allocateFloatFromRequestToLocalStorage;
  // }


  // Actions to fetch data
  // async function fetchTransactions(filter: any) {
  //   // Simulate API call
  //   // const response = await fetch(`/api/transactions?limit=${filter.limit}&page=${filter.page}`);
  //   // const data = await response.json();
  //   // Use dummy data for now
  //   transactions.value = dummyTransactions;
  //   totalAmount.value = 600;  // Set a test value
  //   totalBalance.value = 3000; // Set a test value
  // }

  async function fetchTransactions(filter: any) {
    const filteredData = dummyTransactions.filter(transaction => {
      return (!filter.filter[0].operand || transaction.description.includes(filter.filter[0].operand)) &&
        (!filter.filter[1].operand || transaction.amount > Number(filter.filter[1].operand)) &&
        (!filter.filter[2].operand || transaction.balance > Number(filter.filter[2].operand)) &&
        (!filter.fromDate || moment(transaction.date).isAfter(moment(filter.fromDate))) &&
        (!filter.toDate || moment(transaction.date).isBefore(moment(filter.toDate)));
    });


    transactions.value = filteredData;
    console.log("Filtered transactions:", filteredData);
  }



  // async function fetchFloatLedgers(filter: any) {
  //   // Simulate API call
  //   // const response = await fetch(`/api/float-ledgers?limit=${filter.limit}&page=${filter.page}`);
  //   // const data = await response.json();
  //   // Use dummy data for now
  //   floatLedgers.value = dummyFloatLedgers;
  // }

  // async function fetchFloatLedgers(filter: any) {
  //   // Simulate filtering with dummy data
  //   const filteredData = dummyFloatLedgers.filter(item => {
  //     // Example: filter by status
  //     return !filter.status || item.status === filter.status;
  //   }).slice(0, filter.limit || dummyFloatLedgers.length);

  //   floatLedgers.value = filteredData;
  // }

  async function fetchFloatLedgers(filter: any) {
    console.log("Fetching Float Ledgers with filter:", filter);

    const filteredData = dummyFloatLedgers.filter(item => {
      // Filter logic...
    });

    const limitedData = filteredData.slice(0, filter.limit || dummyFloatLedgers.length);
    floatLedgers.value = limitedData;
    console.log("Filtered float ledgers:", limitedData);
    return limitedData;  // Add this return to make the data available for use
  }




  // allocate float function, push to the float allocation array
  //  function allocateFloat(payload: AllocateFloat) {
  //   floatAllocations.value.push({
  //     id: floatAllocations.value.length + 1,
  //     dateAssigned: new Date().toISOString(),
  //     amount: payload.amount,
  //     status: "Allocated",
  //     branch: payload.branchId,
  //   })
  // }

  //first make float requests array with statuses: pending, approved, rejected
  const floatRequests = ref<FloatRequest[]>(dummyFloatRequests);

  const floatRequest = ref<FloatRequest | null>(null);

  //fetch float requests
  async function fetchFloatRequests() {
    // Simulate API call
    // const response = await fetch(`/api/float-requests?limit=${filter.limit}&page=${filter.page}`);
    // const data = await response.json();
    // Use dummy data for now
    floatRequests.value = dummyFloatRequests;
  }

  // allocate float function, push to the float allocation array
  //  function allocateFloat(payload: AllocateFloat) {
  //   floatAllocations.value.push({
  //     id: floatAllocations.value.length + 1,
  //     dateAssigned: new Date().toISOString(),
  //     amount: payload.amount,
  //     status: "Allocated",
  //     branch: payload.branchId,
  //   })
  // }

  // request float function, push to the float requests array
  // function requestFloat(payload: RequestFloat) {
  //   floatRequests.value.push({
  //     id: floatRequests.value.length + 1,
  //     requestDate: new Date().toISOString(),
  //     amount: payload.amount,
  //     status: "pending",
  //     // status: "success",
  //     // tillId: payload.tillId,
  //           tillId: "Till 1",
  //     description: "Till " + payload.tillId,
  //   })
  //   //save to localstorage
  //   floatRequestToBranchManagerLocalStorage.value.push({
  //     id: floatRequests.value.length + 1,
  //     requestDate: new Date().toISOString(),
  //     amount: payload.amount,
  //     status: "success",
  //     // tillId: payload.tillId,
  //     tillId: "Till 1",
  //     branch: "Branch 1"
  //   })
  //   saveFloatRequestToLocalStorage();
  // }


  const requestFloat = async (payload: RequestFloat) => {
    return api.post("/till-operator/request-float", payload)
      .then((response: AxiosResponse<ApiResponse<any>>) => {
        floatRequest.value = response.data.data
        console.log("Request Float response:", floatRequest);
        //push the request to the float requests array
        // floatRequests.value.push({
        //   id: floatRequests.value.length + 1,
        //   requestDate: new Date().toISOString(),
        //   amount: payload.amount,
        //   status: "pending",
        //   // status: "success",
        //   // tillId: payload.tillId,
        //         tillId: "Till 1",
        //   description: "Till " + payload.tillId,
        // })
        // floatRequests.value = response.data.data
      })
  }

  // using the api
  // async function requestFloat(payload: RequestFloat) {
  //   // Simulate API call
  //   // const response = await fetch(`/till-operator/request-float`, {
  //     const response = await api.post(`/till-operator/request-float`, {
  //     method: "POST",
  //     body: JSON.stringify(payload),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   });
  //   const data = await response.json();
  //   console.log("Request Float response:", data);
  // }

  const floatRequestToBranchManagerLocalStorage = ref<FloatRequest[]>([]);

  const saveFloatRequestToLocalStorage = () => {
    localStorage.setItem('floatRequestToBranchManagerLocalStorage', JSON.stringify(floatRequestToBranchManagerLocalStorage.value))
  }

  // adjust float ledgers with float request
  function adjustFloatLedger(payload: RequestFloat) {
    floatLedgers.value.push({
      id: floatLedgers.value.length + 1,
      date: new Date().toISOString(),
      description: payload.description,
      amount: payload.amount,
      balance: totalBalance.value + payload.amount,
      status: "pending",
      // status: "success",
    })
  }


  return {
    transactions,
    totalAmount,
    totalBalance,
    floatLedgers,
    floatRequests,
    requestFloat,
    adjustFloatLedger,
    fetchFloatRequests,
    fetchTransactions,
    fetchFloatLedgers,
  };
});
