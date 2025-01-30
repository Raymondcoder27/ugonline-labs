<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useBranchStore } from "@/branchmanagerdomain/tills/stores";
import { useBilling } from "@/branchmanagerdomain/finances/stores";
import { useServicesStore } from "@/branchmanagerdomain/services/stores";
import { useAccounts } from "@/branchmanagerdomain/accounts/stores";
import { useBalance } from "@/branchmanagerdomain/balance/stores";

// const totalServiceSubscriptions = ref(0);

// onMounted(() => {
// store.fetchDashboardData();
// branchStore.fetchBranches();
// billingStore.fetchFloatRequests();
// servicesStore.fetchSubscribedServices();
// accountStore.fetchManagerAccounts();
// accountStore.fetchBackofficeAccounts();
// balanceStore.fetchBalance();
// });

// const store = useDashboard();
const branchStore = useBranchStore();
const billingStore = useBilling();
const servicesStore = useServicesStore();
const accountStore = useAccounts();
const balanceStore = useBalance();

// const fetch = () => {
branchStore.fetchBranches();
billingStore.fetchFloatRequests();
servicesStore.fetchSubscribedServices();
accountStore.fetchManagerAccounts();
accountStore.fetchBackofficeAccounts();
balanceStore.fetchTotalBalance();
// };

const totalServiceSubscriptions = servicesStore.subscribedServices?.length || 0;

// const totalFloatRequests = billingStore.floatRequests?.length || 0;

const pendingFloatRequests = billingStore.floatRequests?.filter(
  (request) => request.status === "pending"
)?.length || 0;

const totalTransactions = billingStore.transactions?.length || 0;

const totalBalance = balanceStore.totalBalance;

const totalBranches = branchStore.branches?.length || 0;

const totalBranchManagers = accountStore.managerAccounts?.length || 0;

const totalBackOfficeAccounts = accountStore.backofficeAccounts?.length || 0;

// const store = useDashboard();
const page = ref(1);
const limit = ref(15);

// onMounted(async () => {
//   try {
//     await Promise.all([
//       branchStore.fetchBranches(),
//       billingStore.fetchFloatRequests(),
//       servicesStore.fetchSubscribedServices(),
//       accountStore.fetchManagerAccounts(),
//       accountStore.fetchBackofficeAccounts(),
//     ]);
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// });

// onMounted(() => {
//   balanceStore.fetchTotalBalance();
//   console.log("Balance after fetching:", balanceStore.totalBalance);
// });

// const forceUpdate = ref(0);

// Call the fetch function on mounted
onMounted(async () => {
  await balanceStore.fetchTotalBalance();
  // console.log("Balance after fetching:", balanceStore.totalBalance); // Debugging
  // forceUpdate.value += 1; // Trigger re-render
  console.log("Balance after fetching:", balanceStore.totalBalance);
});
</script>

<template>
  <div class="grid grid-cols-8 py-2">
    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">79</p> -->
        <p class="text-xs font-bold py-2" style="font-size: 18px;">{{ totalServiceSubscriptions }}</p>
        <!-- <p class="text-xl font-bold py-2">{{ servicesStore.servicesSubscribed?.length || 0 }}</p> -->
        <p class="text-xs">Service Subscriptions</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">4</p> -->
        <p class="text-xs font-bold py-2" style="font-size: 18px;">{{ totalBranches }}</p>

        <p class="text-xs">Branches</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">3</p> -->
        <!-- <p class="text-xl font-bold py-2">{{ accountStore.branchManagers.length }}</p> -->
        <p class="text-xs font-bold py-2" style="font-size: 18px;">{{ totalBranchManagers }}</p>
        <p class="text-xs">Branch Managers</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">17</p> -->
        <p class="text-xs font-bold py-2" style="font-size: 18px;">{{ totalBackOfficeAccounts }}</p>
        <p class="text-xs">BackOffice Accounts</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xs font-bold py-2" style="font-size: 18px;">17</p>
        <!-- <p class="text-xl font-bold py-2">{{ store.tills }}</p> -->
        <p class="text-xs">Tills</p>
      </div>
    </div>

    <!-- <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">17</p>
        <p class="text-xs">Agents</p>
      </div>
    </div> -->

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">4</p> -->
        <!-- <p class="text-xl font-bold py-2">{{ billingStore.floatRequests.length }}</p> -->
        <p class="text-xs font-bold py-2" style="font-size: 18px;">{{ pendingFloatRequests }}</p>
        <p class="text-xs">Pending Float Requests</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">123</p> -->
        <!-- <p class="text-xl font-bold py-2">{{ billingStore.serviceTransactions.length }}</p> -->
        <p class="text-xs font-bold py-2" style="font-size: 18px;">{{ totalTransactions }}</p>
        <p class="text-xs">Service Transactions</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">130,400,000/=</p> -->
        <!-- <p class="text-xl font-bold py-2" style="font-size: 30px;">{{ totalBalance.current}}/=</p> -->
        <p class="text-xs font-bold py-2 px-2" style="font-size: 18px;">{{ totalBalance.currentBalance.toLocaleString() }}/=</p>
        
        <p class="text-xs">Balance</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.count {
  @apply py-2 text-center border border-gray-100 rounded bg-white mx-1 shadow;
}
</style>
<!-- @/branchmanager/tills/stores@/branchmanagerdomain/finances/stores@/branchmanager/services/stores@/branchmanager/accounts/stores@/branchmanager/balance/stores -->