<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import FloatLedgers from "@/branchmanagerdomain/finances/FloatLedgers.vue";
import FloatManagement from "@/branchmanagerdomain/finances/FloatAllocation.vue";
import Transactions from "@/branchmanagerdomain/finances/Transactions.vue";
import FloatRequests from "@/branchmanagerdomain/finances/FloatRequests.vue";
import { useBalance } from "@/branchmanagerdomain/balance/stores";

import HomeTab from "@/branchmanagerdomain/dashboard/components/HomeTab.vue";
import UserStatistics from "@/branchmanagerdomain/dashboard/views/UserStatistics.vue";
import TillStatistics from "@/branchmanagerdomain/dashboard/views/TillStatistics.vue";
import ServicesStatistics from "@/branchmanagerdomain/dashboard/views/ServicesStatistics.vue";
import RevenueStatistics from "@/branchmanagerdomain/dashboard/views/RevenueStatistics.vue";
import { useServicesStore } from "@/branchmanagerdomain/services/stores";
import { useTillStore } from "@/branchmanagerdomain/tills/stores";
import { useAccounts } from "@/branchmanagerdomain/accounts/stores";
import { useBilling } from "@/branchmanagerdomain/finances/stores";
// import { useBalance } from "@/branchmanagerdomain/balance/stores";

const tillStore = useTillStore();
const billingStore = useBilling();
const servicesStore = useServicesStore();
const accountStore = useAccounts();
tillStore.fetchTills();
// servicesStore.fetchSubscribedServices();
accountStore.fetchTillOperators();
accountStore.fetchBackofficeAccounts();
const totalServiceSubscriptions = servicesStore.subscribedServices?.length || 0;
const totalTransactions = billingStore.transactions?.length || 0;
const totalBranches = tillStore.tills?.length || 0;
const totalTillOperators = accountStore.tillOperatorAccounts?.length || 0;
const totalBackOfficeAccounts = accountStore.backofficeAccounts?.length || 0;

// Call the fetch function on mounted
const balanceStore = useBalance();

balanceStore.fetchTotalBalance();

const totalBalance = balanceStore.totalBalance;

const activeTab: Ref<string> = ref("branches");

function select(tab: string) {
  activeTab.value = tab;
}

onMounted(async () => {
  await balanceStore.fetchTotalBalance();
  // console.log("Balance after fetching:", balanceStore.totalBalance); // Debugging
  // forceUpdate.value += 1; // Trigger re-render
  console.log("Balance after fetching:", balanceStore.totalBalance);
});
</script>
<template>
  <!-- <div class="flex flex-col w-full shadow-lg bg-white rounded h-screen"> -->
  <div class="flex flex-col bg-white shadow-lg rounded p-1 h-[86vh]">
    <!-- Tabs -->
    <div class="flex border-b-2 border-primary gap-1">
      <!-- Services Tab -->
      <!-- <div
        :class="activeTab == 'services' ? 'tab-active' : 'tab'"
        @click="select('services')"
        class="cursor-pointer flex items-center justify-center flex-grow text-sm hover:bg-gray-100"
      >
        <i class="fa-solid fa-cogs mr-2"></i>
        <span>Services</span>
    
      </div> -->

      <!-- Branches Tab -->
      <div
        :class="activeTab == 'branches' ? 'tab-active' : 'tab'"
        @click="select('branches')"
        class="cursor-pointer flex items-center justify-center flex-grow text-sm hover:bg-gray-100"
      >
        <i class="fa-solid fa-code-branch mr-2"></i>
        <span>Tills</span>
        <!-- <p class="text-xl font-bold mt-1">4</p> -->
        <!-- <p class="text-xl font-bold ml-2">{{ totalBranches }}</p> -->
      </div>

      <!-- Tills Tab -->
      <!-- <div
          :class="activeTab == 'tills' ? 'tab-active' : 'tab'"
          @click="select('tills')"
          class="cursor-pointer flex items-center justify-center flex-grow p-2 text-sm hover:bg-gray-100"
        >
          <i class="fa-solid fa-cash-register mr-2"></i>
          <span>Tills</span>
          <p class="text-xl font-bold mt-1">19</p>
        </div> -->

      <!-- Users Tab -->
      <div
        :class="activeTab == 'users' ? 'tab-active' : 'tab'"
        @click="select('users')"
        class="cursor-pointer flex items-center justify-center flex-grow text-sm hover:bg-gray-100"
      >
        <i class="fa-solid fa-users mr-2 py-2"></i>
        <span>Users</span>
        <!-- <p class="text-xl font-bold mt-1">2</p> -->
        <!-- <p class="text-xl font-bold ml-2">{{ totalBackOfficeAccounts }}</p> -->
      </div>

      <!-- Providers Tab -->
      <!-- <div
          :class="activeTab == 'providers' ? 'tab-active' : 'tab'"
          @click="select('providers')"
          class="cursor-pointer flex items-center justify-center flex-grow p-2 text-sm hover:bg-gray-100"
        >
          <i class="fa-solid fa-handshake mr-2"></i>
          <span>Providers</span>
          <p class="text-xl font-bold mt-1">3</p>
        </div> -->

      <!-- Revenue Tab -->
      <div
        :class="activeTab == 'revenue' ? 'tab-active' : 'tab'"
        @click="select('revenue')"
        class="cursor-pointer flex items-center justify-center flex-grow text-sm hover:bg-gray-100"
      >
        <i class="fa-solid fa-coins mr-2"></i>
        <span>Finances</span>
        <!-- <p class="text-xl font-bold mt-1">41</p> -->
        <!-- <p class="text-xl font-bold ml-2">
          {{ totalBalance.currentBalance.toLocaleString() }}/=
        </p> -->
      </div>
    </div>

    <!-- Tab Content -->
    <div class="max-h-[80vh] max-w-[78vw] flex flex-col overflow-y-auto">
      <div class="">
        <HomeTab v-if="activeTab == 'hometab'" />
        <UserStatistics v-if="activeTab == 'users'" />
        <TillStatistics v-if="activeTab == 'branches'" />
        <!-- <div class="bg-white text-xs rounded-md text-center mb-2 h-[86vh]"> -->
        <ServicesStatistics v-if="activeTab == 'services'" />
        <!-- </div> -->
        <!-- <div class="bg-white text-xs rounded-md text-center mb-2 h-[86vh]"> -->
        <RevenueStatistics class="" v-if="activeTab == 'revenue'" />
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<style scoped>
.tab-active {
  @apply flex border-2 border-primary-700 cursor-pointer bg-primary text-white font-bold rounded-t-xl;
}
/* 
.tab{
  @apply flex border border-gray-10 cursor-pointer;
} */
.tab {
  @apply flex items-center justify-center flex-grow cursor-pointer bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-t-xl;
  transition: background-color 0.1s ease, color 0.2s ease;
}

.tab:hover {
  @apply bg-gray-50 text-gray-600 rounded-t-xl;
}
</style>
<!-- @/branchmanager/balance/stores@/branchmanager/services/stores@/branchmanager/tills/stores@/branchmanager/accounts/stores@/branchmanagerdomain/finances/stores -->