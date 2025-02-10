import { defineStore } from "pinia";
import { computed, reactive, watchEffect } from "vue";
import { useBilling } from "@/branchmanagerdomain/finances/stores/index";

export interface TotalBalance {
  prevBalance: number;
  currentBalance: number;
}

export const useBalance = defineStore("balance", () => {
  const totalBalance = reactive<TotalBalance>({
    prevBalance: 0,
    currentBalance: 0,
  });

  const finalFloat = reactive<TotalFinalFloat>({
    prevFinalFloat: 0, // Ensure default value is set
    currentFinalFloat: 0, // Ensure default value is set
  });


  const billingStore = useBilling();

  // Computed property to calculate balance dynamically based on approved transactions
  const computedBalance = computed(() => {
    let runningBalance = 0;

    // billingStore.floatRequests.forEach((transaction) => {
      billingStore.floatLedgers.forEach((transaction) => {
      if (transaction.status === "approved" || transaction.status === "edited") {
        runningBalance += transaction.amount;
      }
    });

    return runningBalance;
  });

  // Watch computed balance and update totalBalance whenever it changes
  watchEffect(() => {
    totalBalance.prevBalance = totalBalance.currentBalance;
    totalBalance.currentBalance = computedBalance.value;
    console.log("Updated Balance:", totalBalance);
  });

  async function approveFloatRequest(requestId: any) {
    console.log("Approving float request with id:", requestId);

    const floatRequest = billingStore.floatRequests.find(
      (request) => request.id === requestId
    );

    if (!floatRequest) {
      console.error("Float request not found");
      return;
    }

    // Simulate approval process (Modify store accordingly)
    floatRequest.status = "approved";

    // Balance will be automatically updated via computedBalance
    console.log("Float request approved:", floatRequest);
  }

  async function fetchTotalBalance() {
    console.log("Fetching balance...");
    const fetchedBalance = {
      prevBalance: totalBalance.prevBalance,
      currentBalance: totalBalance.currentBalance,
    };

    console.log("Fetched balance:", fetchedBalance); // Debugging
    totalBalance.prevBalance = fetchedBalance.prevBalance;
    totalBalance.currentBalance = fetchedBalance.currentBalance;
    console.log("Updated balance in store:", totalBalance); // Debugging
  }

  return {
    totalBalance,
    computedBalance,
    approveFloatRequest,
    fetchTotalBalance,
    finalFloat,
  };
});
