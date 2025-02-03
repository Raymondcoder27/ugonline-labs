import { defineStore } from "pinia";
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
  };
});
