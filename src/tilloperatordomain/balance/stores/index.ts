import { defineStore } from "pinia";
import api from "@/config/api";
import { ref, reactive } from "vue";

export interface TotalBalance {
  prevBalance: number;
  currentBalance: number;
}

export const useBalance = defineStore("balance", () => {
  // Initial dummy data for total balance

  const totalBalance = reactive<TotalBalance>({
    prevBalance: 0,
    currentBalance: 15405000, // Initial balance
  });

  // Increase the total balance and update the "prev" value
  async function increaseTotalBalance(amount: number) {
    totalBalance.prev = totalBalance.current;
    totalBalance.current += amount;
  }

  // balanceStore.updateTotalBalance(payload.amount, payload.status)
  // don't update balance unless the status has been set to approved by the admin from the api
  // async function updateTotalBalance(payload: {
  //   id: string;
  //   amount: number;
  //   status: "pending" | "approved";
  // }) {
  //   if (payload.status === "pending") {
  //     // The float request is pending approval; no change to the balance.
  //     console.log("Float request is pending approval. No balance update performed.");
  //     return;
  //   }

  //   if (payload.status === "approved") {
  //     // On approval, update the balance.
  //     totalBalance.prevBalance = totalBalance.currentBalance;
  //     totalBalance.currentBalance += payload.amount;
  //     console.log(`Balance updated: increased by ${payload.amount}.`);
  //   }
  // }

  const tillOperatorBalance = ref(0);

  async function updateTotalBalance(payload: {
    tillId: string;
    amount: number;
    description: string;
    status: "pending" | "approved" | "rejected" | "failed";
  }) {
    if (payload.status === "pending") {
      // The float request is pending approval; no change to the balance.
      console.log("Float request is pending approval. No balance update performed.");
      // return;
      //post that float request to the api
      // const {data} = await api.post("/till-operator2-float-request-amount", payload.amount);
      const { data } = await api.post("/till-operator2-float-request-amount", {
        tillId: payload.tillId,
        // amount: payload.amount,
        amount: totalBalance.currentBalance,
        description: payload.description
      });
      console.log("Float request has been posted to the api");
      tillOperatorBalance.value = data.data;

      //set the balance to the current balance
      totalBalance.prevBalance = totalBalance.currentBalance;
      //no change to the balance
      totalBalance.currentBalance = totalBalance.prevBalance;
      // totalBalance.currentBalance += payload.amount;
      // console.log(`Balance updated: increased by ${payload.amount}.`);
      console.log(`Balance updated: no change to the balance.`);
    }

    if (payload.status === "approved") {
      // On approval, update the balance.

      //post that float request to the api
      const { data } = await api.post("/till-operator2-float-request-amounts", {
        tillId: payload.tillId,
        amount: payload.amount,
        description: payload.description
      });
      console.log("Float request has been posted to the api");
      tillOperatorBalance.value = data.data;

      totalBalance.prevBalance = totalBalance.currentBalance;
      // totalBalance.currentBalance += payload.amount;
      //update the balance to the new amount from the api
      totalBalance.currentBalance = tillOperatorBalance.value;
      console.log(`Balance updated: increased by ${payload.amount}.`);
    }
  }

  

  // Decrease the total balance and update the "prev" value
  async function decreaseTotalBalance(amount: number) {
    totalBalance.prev = totalBalance.current;
    totalBalance.current -= amount;
  }

  // Fetch the total balance (Simulate API call)
  //  async function fetchTotalBalance() {
  //   // Simulate fetching updated balance data
  //   const fetchedBalance = {
  //     prevBalance: totalBalance.prev,
  //     currentBalance: totalBalance.current, // Example fetched balance
  //   };
  //   Object.assign(totalBalance, fetchedBalance);
  // }

  async function fetchTotalBalance() {
    console.log("Fetching balance...");
    const fetchedBalance = {
      prevBalance: totalBalance.prevBalance, // Setting previous balance to the current value
      currentBalance: totalBalance.currentBalance, // Example of updating balance to a new value
    };

    console.log("Fetched balance:", fetchedBalance); // Debugging
    totalBalance.prevBalance = fetchedBalance.prevBalance;
    totalBalance.currentBalance = fetchedBalance.currentBalance;
    console.log("Updated balance in store:", totalBalance); // Debugging
  }



  return {
    totalBalance,
    fetchTotalBalance,
    increaseTotalBalance,
    decreaseTotalBalance,
    updateTotalBalance,
  };
});
