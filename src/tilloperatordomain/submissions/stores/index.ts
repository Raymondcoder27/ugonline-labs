// domain/billing/stores.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { Transaction, FloatLedger } from "@/tilloperatordomain/billing/types";
import type { Submission } from "@/tilloperatordomain/submissions/types";

export const useSubmissions = defineStore("submissions", () => {
  // Dummy data for testing
  const dummyTransactions: Transaction[] = [
    { id: 1, amount: 100, description: "Sample Transaction 1" },
    { id: 2, amount: 200, description: "Sample Transaction 2" },
    { id: 3, amount: 300, description: "Sample Transaction 3" },
  ];

  const dummyFloatLedgers: FloatLedger[] = [
    { id: 1, name: "Sample FloatLedger 1", balance: 500 },
    { id: 2, name: "Sample FloatLedger 2", balance: 1000 },
    { id: 3, name: "Sample FloatLedger 3", balance: 1500 },
  ];

//   <thead>
//             <tr class="header-tr">
//               <th class="t-header">#</th>
//               <th class="t-header">Service</th>
//               <th class="text-right t-header">Provider</th>
//               <th class="text-right t-header">Fee</th>
//               <th class="t-header">Date</th>
//             </tr>
//           </thead>

  // const dummySubmissions: Submission[] = [
  //   { id: 1, service: "National ID Registration", provider: "NIRA", fee: 100, date: "2021-10-01" },
  //   { id: 2, service: "Company Name Reservation", provider: "URSB", fee: 200, date: "2021-10-02" },
  //   { id: 3, service: "Company Incorporation", provider: "URSB", fee: 300, date: "2021-10-03" },
  //   ];

  // use this to generate new dummy submissions
  // const dummyTransactions: Transaction[] = [
  //   { id: 1, trackingNumber: "TA123456",
  //     service: "Name Reservation", provider: "URSB", till: "Till 001",
  //     fee: 25000, date: "2021-09-01" 
  //   },
  //   { id: 2, trackingNumber: "TB123457",
  //     service: "Create Postal Account", provider: "Posta Uganda",
  //      till: "Till 002", fee: 20000, date: "2021-09-02"
  //     },
  //   { id: 3, trackingNumber: "TC123458",
  //     service: "National ID registration", provider: "NIRA",
  //      till: "Till 003", fee: 35000, date: "2021-09-03" },
  // ];

  const dummySubmissions: Submission[] = [
    { id: 1, trackingNumber: "TA123456",
      service: "Name Reservation", status: "rejected", provider: "URSB", till: "Till 001",
      fee: 25000, date: "2021-09-01" 
    },
    { id: 2, trackingNumber: "TB123457",
      service: "Create Postal Account", status: "draft", provider: "Posta Uganda",
       till: "Till 002", fee: 20000, date: "2021-09-02"
      },
    { id: 3, trackingNumber: "TC123458",
      service: "National ID registration", status: "processing", provider: "NIRA",
       till: "Till 003", fee: 35000, date: "2021-09-03" },
       {
        id: 4, trackingNumber: "TD123459",
        service: "Name Reservation", status: "rejected", provider: "URSB", till: "Till 001",
        fee: 25000, date: "2021-09-01"
       },
       {
        id: 5, trackingNumber: "TE123460",
        service: "Create Postal Account", status: "processing", provider: "Posta Uganda",
         till: "Till 002", fee: 20000, date: "2021-09-02"
        },
      {
        id: 6, trackingNumber: "TF123461",
        service: "National ID registration", status: "submitted", provider: "NIRA",
         till: "Till 003", fee: 35000, date: "2021-09-03"
       },
       {
        id: 7, trackingNumber: "TG123462",
        service: "Name Reservation", status: "rejected", provider: "URSB", till: "Till 001",
        fee: 25000, date: "2021-09-01"
       },
       {
        id: 8, trackingNumber: "TH123463",
        service: "Create Postal Account", status: "queried", provider: "Posta Uganda",
         till: "Till 002", fee: 20000, date: "2021-09-02"
        },
  ];


  // State variables
  const transactions = ref<Transaction[]>(dummyTransactions); // Use dummy data for now
  const totalAmount = ref(600); // Set a test value
  const totalBalance = ref(3000); // Set a test value
  const floatLedgers = ref<FloatLedger[]>(dummyFloatLedgers); // Use dummy data for now
    const submissions = ref<Submission[]>(dummySubmissions); // Use dummy data for now

  // Actions to fetch data
  async function fetchTransactions(filter: any) {
    // Simulate API call
    // const response = await fetch(`/api/transactions?limit=${filter.limit}&page=${filter.page}`);
    // const data = await response.json();
    // Use dummy data for now
    transactions.value = dummyTransactions;
    totalAmount.value = 600;  // Set a test value
    totalBalance.value = 3000; // Set a test value
  }

  async function fetchFloatLedgers(filter: any) {
    // Simulate API call
    // const response = await fetch(`/api/float-ledgers?limit=${filter.limit}&page=${filter.page}`);
    // const data = await response.json();
    // Use dummy data for now
    floatLedgers.value = dummyFloatLedgers;
  }

  async function fetchSubmissions(filter: any) {
    // Simulate API call
    // const response = await fetch(`/api/submissions?limit=${filter.limit}&page=${filter.page}`);
    // const data = await response.json();
    // Use dummy data for now
    submissions.value = dummySubmissions;
  }

  return {
    transactions,
    totalAmount,
    totalBalance,
    floatLedgers,
    submissions,
    fetchTransactions,
    fetchFloatLedgers,
    fetchSubmissions,
  };
});
