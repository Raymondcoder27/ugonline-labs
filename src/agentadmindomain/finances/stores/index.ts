// domain/billing/stores.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { Transaction, FloatLedger, BackofficeUser, BranchManager, FloatAllocation, FloatRequest } from "@/agentadmindomain/finances/types";
import type { AllocateFloat } from "@/types";
import api from "@/config/api";

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

  // const dummyTransactions: Transaction[] = [
  //   { id: 1, trackingNumber: "TA123456",
  //     service: "Company Name Reservation", provider: "URSB", till: "Till 001",
  //     fee: 25000, date: "2021-09-01", status: "success" 
  //   },
  //   { id: 2, trackingNumber: "TB123457",
  //     service: "Create Postal Account", provider: "Posta Uganda",
  //      till: "Till 002", fee: 20000, date: "2021-09-02", status: "failed"
  //     },
  //   { id: 3, trackingNumber: "TC123458",
  //     service: "National ID registration", provider: "NIRA",
  //      till: "Till 003", fee: 35000, date: "2021-09-03", status: "pending" },
  // ];

  const dummyTransactions: Transaction[] = [
    {
      id: 1, trackingNumber: "TA123456",
      service: "Company Name Reservation", provider: "URSB", till: "Till 001", transactionID: "TR23183",
      fee: 25000, date: "2021-09-01", status: "success"
    },
    {
      id: 2, trackingNumber: "TB123457",
      service: "Create Postal Account", provider: "Posta Uganda", transactionID: "TR43512",
      till: "Till 002", fee: 20000, date: "2021-09-02", status: "failed"
    },
    {
      id: 3, trackingNumber: "TC123458",
      service: "National ID registration", provider: "NIRA", transactionID: "TR00984",
      till: "Till 003", fee: 35000, date: "2021-09-03", status: "pending"
    },
  ];


  // use this for dummy float requests
  // <th class="text-left">Date</th>
  // <th class="text-left">Name</th>
  // <th class="text-left">Branch</th>
  // <th class="text-left">Amount</th>
  // <th class="text-left">Actions</th>

  const dummyFloatRequests: FloatRequest[] = [
    { id: 1, requestDate: "2021-09-01", amount: 10000000, status: "pending", branch: "Branch 1", approvedBy: null },
    { id: 4, requestDate: "2021-09-04", amount: 40000000, status: "pending", branch: "Branch 4", approvedBy: null },
    { id: 2, requestDate: "2021-09-02", amount: 20000000, status: "approved", branch: "Branch 2", approvedBy: "Manager One" },
    { id: 3, requestDate: "2021-09-03", amount: 30000000, status: "rejected", branch: "Branch 3", approvedBy: null },
  ];

  const dummyFloatLedgers: FloatLedger[] = [
    { id: 1, date: "2021-09-01", description: "Recharge", amount: 285000000, balance: 285000000 },
    // { id: 2, date: "2021-09-02", description: "Branch 1", amount: -20000000, balance: 300000000 },
  ];

  const dummyBranchFloatLedgers: FloatLedger[] = [
    { id: 1, date: "2021-09-01", description: "Recharge", amount: 115000000, balance: 115000000, createdAt: "" },
    { id: 2, date: "2021-09-02", description: "Till 1", amount: -10000000, balance: 1050000000, createdAt: "" },
  ];

  const dummyBackofficeUsers: BackofficeUser[] = [
    { id: 1, username: "admin1", fullName: "Jack Mwebe", role: "Administrator", branch: "Branch 1", status: "Active" },
    { id: 2, username: "manager1", fullName: "Katamba Johnson", role: "Manager", branch: "Branch 2", status: "Active" },
    { id: 3, username: "admin2", fullName: "Kasule Ronald", role: "Administrator", branch: "Branch 3", status: "Inactive" },
  ];

  // dummy branch manager data
  const dummyBranchManagers: BranchManager[] = [
    { id: 1, username: "manager1", fullName: "Manager User One", role: "Manager", branch: "Branch 1", status: "Active" },
    { id: 2, username: "manager2", fullName: "Manager User Two", role: "Manager", branch: "Branch 2", status: "Active" },
    { id: 3, username: "manager3", fullName: "Manager User Three", role: "Manager", branch: "Branch 3", status: "Inactive" },
  ];

  // dummy float assignment data
  const dummyFloatAllocations: FloatAllocation[] = [
    { id: 1, dateAssigned: "2021-09-01", amount: 20000000, status: "Allocated", branch: "Branch 1" },
    { id: 2, dateAssigned: "2021-09-02", amount: 21000000, status: "pending", branch: "Branch 2" },
    { id: 3, dateAssigned: "2021-09-03", amount: 37000000, status: "failed", branch: "Branch 3" },
  ];


  // State variables
  const transactions = ref<Transaction[]>(dummyTransactions); // Use dummy data for now
  const totalAmount = ref(600); // Set a test value
  const totalBalance = ref(3000); // Set a test value
  const floatLedgers = ref<FloatLedger[]>(dummyFloatLedgers); // Use dummy data for now
  // const floatLedgers = ref<FloatLedger[]>([]);
  // const branchFloatLedgers = ref<FloatLedger[]>(dummyBranchFloatLedgers)
  const branchFloatLedgers = ref<FloatLedger[]>([])
  const backofficeUsers = ref<BackofficeUser[]>(dummyBackofficeUsers);
  const branchManagers = ref<BranchManager[]>(dummyBranchManagers);
  const floatAllocations = ref<FloatAllocation[]>(dummyFloatAllocations);
  const floatRequests = ref<FloatRequest[]>(dummyFloatRequests);


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

  // async function fetchFloatLedgers(filter: any) {
  //   // Simulate API call
  //   // const response = await fetch(`/api/float-ledgers?limit=${filter.limit}&page=${filter.page}`);
  //   // const data = await response.json();
  //   // Use dummy data for now
  //   floatLedgers.value = dummyFloatLedgers;
  // }

  // async function fetchFloatLedgers() {
  //   const { data } = await api.get("/agent-admin-float-ledgers");
  //   floatLedgers.value = data.data;
  //   console.log("Float Ledgers:", floatLedgers.value);
  // }
  async function fetchFloatLedgers() {
    try {
      const { data } = await api.get("/agent-admin-float-ledgers");
  
      if (data.data && data.data.length > 0) {
        floatLedgers.value = [...dummyFloatLedgers, ...data.data]; // Keep dummy data first
      } else {
        console.warn("API returned empty float ledgers, keeping only dummy data.");
        floatLedgers.value = dummyFloatLedgers; // Fallback to dummy data
      }
  
      console.log("Float Ledgers:", floatLedgers.value);
    } catch (error) {
      console.error("Error fetching float ledgers:", error);
      floatLedgers.value = dummyFloatLedgers; // Use dummy data if API call fails
    }
  }
  

  // async function fetchBranchFloatLedgers(filter: any) {
  //   // Simulate API call
  //   // const response = await fetch(`/api/float-ledgers?limit=${filter.limit}&page=${filter.page}`);
  //   // const data = await response.json();
  //   // Use dummy data for now
  //   branchFloatLedgers.value = dummyBranchFloatLedgers;
  // }

  async function fetchBranchFloatLedgers() {
    const { data } = await api.get("/branch7-manager-float-ledgers");
    floatLedgers.value = data.data;
    console.log("Float Ledgers:", floatLedgers.value);
  }

  async function fetchBackofficeUsers(filter: any) {
    // Simulate API call
    // You can adjust this based on the filtering criteria or paging
    backofficeUsers.value = dummyBackofficeUsers;
  }

  async function fetchBranchManagers(filter: any) {
    // Simulate API call
    // You can adjust this based on the filtering criteria or paging
    branchManagers.value = dummyBranchManagers;
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


  async function fetchFloatRequests() {
    const { data } = await api.get("/branch7-manager-float-requests");
    floatRequests.value = data.data;
    console.log("Float Requests:", floatRequests.value);
  }

  // function submit() {
  //   let payload = {
  //     amount: form.firstName,
  //     branchId: form.branchId,
  //   };
  //   loading.value = true;
  //   store
  //     .allocateFloat(payload)
  //     .then(() => {
  //       loading.value = false;
  //       notify.success(`Float assigned to ${form.branchId}.`);
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
      branch: payload.branchId,
    })
    //save to localstorage
    // saveTransactionsToLocalStorage();
  }

  const branchManagerFloatBalance = ref(0);

  // const saveTransactionsToLocalStorage = () => {
  //   localStorage.setItem('branchManagerFloatBalance', JSON.stringify(floatAllocations.value))
  // }

  // const savedFloatManagerBalance = JSON.parse(localStorage.getItem('branchManagerFloatBalance') || '0');

  // if (savedFloatManagerBalance) {
  //   branchManagerFloatBalance.value = savedFloatManagerBalance;
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
        branch: floatRequest.branch,
      });


      // allocateFloatFromRequestToLocalStorage.value.push({
      //   id: allocateFloatFromRequestToLocalStorage.value.length + 1,
      //   dateAssigned: new Date().toISOString(),
      //   status: "Allocated",
      //   payload: floatRequest.amount,
      //    branchId: floatRequest.branch,
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
    //    branchId: floatRequest.branch,
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
      // description: "Branch " + payload.branchId,
      description: payload.branchId,
      amount: -payload.amount,
      // balance: totalBalance.value + payload.amount,
    })
  }

  //   const allocateFloatFromRequestToLocalStorage = ref<FloatRequest[]>([]);

  // const saveFloatRequestToLocalStorage = () => {
  //   localStorage.setItem('allocateFloatFromRequestToLocalStorage', JSON.stringify(allocateFloatFromRequestToLocalStorage.value))
  // }

  // pass in the requestId
  // const approveFloatRequest = (requestId: any) => {
  //   store.approveFloatRequest(requestId);
  //   store.fetchFloatRequests();
  //   balanceStore.approveFloatRequest(requestId);
  //   store.reduceFloatLedger(requestId); 
  //   console.log(`float request with id ${requestId} approved`);
  // };

  // async function reduceFloatLedger(requestId: any) {
  //   //  This is local storage 
  //   // end of local storage

  //   console.log("Approving float request with ID:", requestId);
  //   // Simulate API call
  //   // const response = await fetch(`/api/float-requests/${requestId}/approve`, {
  //   //   method: "POST",
  //   // });
  //   // const data = await response.json();

  //   // use request in floatledgers array id to figure out amount 
  //   const floatRequest = floatRequests.value.find(
  //     (request) => request.id === requestId
  //   );
  //   if (!floatRequest) {
  //     console.error("Float request not found");
  //     return;
  //   }
  //   floatLedgers.value.push({
  //     id: floatLedgers.value.length + 1,
  //     date: new Date().toISOString(),
  //     description: floatRequest.branch,
  //     amount: -floatRequest.amount,
  //     // balance: 300000000 - floatRequest.amount,
  //   });
  // }
  async function reduceFloatLedger(requestId: string) {
    try {
      console.log("Reducing float ledger for request ID:", requestId);

      // Step 1: Find the corresponding float request
      const floatRequest = floatRequests.value.find(request => request.id === requestId);

      if (!floatRequest) {
        console.error("Float request not found for ID:", requestId);
        return;
      }

      // Step 2: Create a new Float Ledger Entry with reduced amount
      const { data } = await api.post(`/agent-admin-float-ledgers`, {
        requestId: floatRequest.id,
        date: new Date().toISOString(),
        description: floatRequest.description,
        amount: -floatRequest.amount, // Negative to indicate reduction
        status: "approved",
        branch: floatRequest.branch,
        approvedBy: "Admin One",
      });

      // Step 3: Update local state with new ledger entry
      floatLedgers.value.push(data.data);
      console.log("Float ledger reduced successfully:", data.data);

    } catch (error) {
      console.error("Error reducing float ledger:", error);
    }
  }

  async function approveFloatRequest(requestId: string) {
    try {
      // Step 1: Find the float request
      const floatRequest = floatRequests.value.find(request => request.id === requestId);

      if (!floatRequest) {
        console.error("Float request not found for ID:", requestId);
        return;
      }

      // Step 2: Approve the Float Request
      const { data } = await api.put(`/branch7-manager-float-requests/${requestId}`, {
        status: "approved",
        approvedBy: "Manager One",
        amount: floatRequest.amount,
        branch: floatRequest.branch,
        description: floatRequest.description,
        ledgerId: floatRequest.ledgerId, // Retain the ledger link
      });

      floatRequest.status = "approved";
      console.log("Float request approved successfully:", data);

      // Step 3: Approve the Float Ledger Record using `ledgerId`
      if (floatRequest.ledgerId) {
        // Retrieve the existing ledger entry to keep all fields
        const ledgerEntry = floatLedgers.value.find(ledger => ledger.id === floatRequest.ledgerId);

        if (ledgerEntry) {
          await api.put(`/branch7-manager-float-ledgers/${floatRequest.ledgerId}`, {
            ...ledgerEntry, // Retain all original fields
            status: "approved", // Only update status
          });

          console.log("Float ledger record approved:", ledgerEntry);
        } else {
          console.error("Ledger entry not found for ID:", floatRequest.ledgerId);
        }
      } else {
        console.error("Ledger ID not found in float request!");
      }

    } catch (error) {
      console.error("Error approving float request:", error);
    }
  }




  // reject float request using passed in Id and set status to rejected
  // function rejectFloatRequest(requestId: any) {
  //   const floatRequest = floatRequests.value.find((request) => request.id === requestId);
  //   if (floatRequest) {
  //     floatRequest.status = "rejected";
  //   }
  // }

  async function rejectFloatRequest(requestId: string) {
    try {
      // Find the float request by ID
      const floatRequest = floatRequests.value.find(request => request.id === requestId);

      if (!floatRequest) {
        console.error("Float request not found for ID:", requestId);
        return;
      }

      // Send the API request with all required data
      const { data } = await api.put(`/branch7-manager-float-requests/${requestId}`, {
        status: "rejected",
        approvedBy: "Manager One",
        amount: floatRequest.amount, // Retrieve amount from the found request
        // till: floatRequest.till,     // Retrieve till from the found request
        branch: floatRequest.branch,     // Retrieve till from the found request
        description: floatRequest.description,
        ledgerId: floatRequest.ledgerId
      });

      //approve the record's status in the float ledger too
      // api.put("/till-operator17-float-ledgers/" + requestId, {
      //   status: "approved",
      //   amount: floatRequest.amount,
      //   till: floatRequest.till,
      // });

      // Update local state after successful API call
      floatRequest.status = "rejected";
      if (floatRequest.ledgerId) {
        // Retrieve the existing ledger entry to keep all fields
        const ledgerEntry = floatLedgers.value.find(ledger => ledger.id === floatRequest.ledgerId);

        if (ledgerEntry) {
          await api.put(`/branch7-manager-float-ledgers/${floatRequest.ledgerId}`, {
            ...ledgerEntry, // Retain all original fields
            status: "rejected", // Only update status
          });

          console.log("Float ledger record rejected:", ledgerEntry);
        } else {
          console.error("Ledger entry not found for ID:", floatRequest.ledgerId);
        }
      } else {
        console.error("Ledger ID not found in float request!");
      }

      console.log("Float request rejected:", data);
    } catch (error) {
      console.error("Error rejecting float request:", error);
    }
  }


  //edit float request amount and allocated the new amount inserted in the form
  async function editFloatRequest(requestId: any, payload: any) {
    try {
      const floatRequest = floatRequests.value.find((request) => request.id === requestId);
      if (!floatRequest) {
        console.error("Float request not found for ID:", requestId);
        return;
      }

      const { data } = await api.put("/branch7-manager-float-requests/" + requestId, {
        amount: payload.amount,
        branch: payload.branch,
        // status: "request edited",
        status: "edited",
        description: payload.description,
        approvedBy: "Manager One",
        ledgerId: floatRequest.ledgerId,
      });
      floatRequests.value = data.data;
      console.log("Float Requests:", floatRequests.value);
      if (floatRequest.ledgerId) {
        // Retrieve the existing ledger entry to keep all fields
        const ledgerEntry = floatLedgers.value.find(ledger => ledger.id === floatRequest.ledgerId);

        if (ledgerEntry) {
          await api.put(`/branch7-manager-float-ledgers/${floatRequest.ledgerId}`, {
            ...ledgerEntry, // Retain all original fields
            status: "edited", // Only update status
            amount: payload.amount,
          });

          console.log("Float ledger record edited:", ledgerEntry);
        } else {
          console.error("Ledger entry not found for ID:", floatRequest.ledgerId);
        }
      } else {
        console.error("Ledger ID not found in float request!");
      }
    } catch (error) {
      console.error("Error editing float request:", error);
    }
  }

  return {
    transactions,
    totalAmount,
    totalBalance,
    floatLedgers,
    backofficeUsers,
    branchManagers,
    floatAllocations,
    floatRequests,
    branchManagerFloatBalance,
    reduceFloatLedger,
    approveFloatRequest,
    adjustFloatLedger,
    rejectFloatRequest,
    editFloatRequest,
    fetchFloatRequests,
    fetchTransactions,
    fetchFloatLedgers,
    fetchBranchFloatLedgers,
    fetchBackofficeUsers,
    fetchBranchManagers,
    fetchFloatAllocations,
    // allocateFloat,
    // allocateFloatFromRequest,
  };
});
