<script setup lang="ts">
import { ref, type Ref } from "vue";
// import BackofficeAccounts from "@/agentadmindomain/accounts/BackofficeAccounts.vue";
// import UserAccounts from "@/agentadmindomain/accounts/UserAccounts.vue";

import FloatLedgers from "@/agentadmindomain/finances/FloatLedgers.vue";
import FloatManagement from "@/agentadmindomain/finances/FloatAllocation.vue";
import FloatAllocationTabbed from "@/agentadmindomain/finances/FloatAllocationTabbed.vue";
import Transactions from "@/agentadmindomain/finances/Transactions.vue";
import FloatRequests from "@/agentadmindomain/finances/FloatRequests.vue";
import { useBalance } from "@/agentadmindomain/balance/stores";

const balanceStore = useBalance();

balanceStore.fetchTotalBalance();

const totalBalance = balanceStore.totalBalance;

// const availableFloat = balanceStore.availableFloat;
const finalFloat = balanceStore.finalFloat;

const activeTab: Ref<string> = ref("floatrequests");

function select(tab: string) {
  activeTab.value = tab;
}
</script>

<template>
  <div class="flex flex-col w-full shadow-lg bg-white rounded p-2 h-full">
    <div class="flex">
      <div class="w-full py-1">
        <!-- <i class="bg-primary-700 border border-primary-800 text-white p-2 rounded-full fa-solid fa-money-bill"></i> -->
        <i
          class="bg-primary-700 border border-primary-800 text-white p-2 rounded-full fa-solid fa-coins"
        ></i>
        <label class="text-lg mx-1">Finances</label>
      </div>
      <div class="flex">
        <!-- Balance -->
        <!-- <i class="fas fa-wallet"></i> -->

        <span
          class="mt-2 mr-3 text-gray-800 font-semibold rounded-md px-1 py-0.5 text-md flex"
        >
          <!-- <i class="fas fa-wallet px-1 pt-0.5 text-red-700"></i> -->

          <!-- {{ totalBalance.currentBalance.toLocaleString() }}/= -->

          <!-- <span class="px-1">Available Float: {{ availableFloat.toLocaleString() }}/=</span> -->
          <span class="px-1"
            >Available Float:
            <span class="text-gray-500">
              {{ finalFloat.currentFinalFloat.toLocaleString() }}/=
            </span></span
          >

          <span class="px-1"
            >Final Float:
            

          <span class="text-gray-500"
              >{{ totalBalance.currentBalance.toLocaleString() }}/=</span
            ></span
          >
        </span>
      </div>
    </div>
    <div class="flex pt-5">
      <div
        :class="
          activeTab == 'floatrequests' ? 'w-2/12 tab-active' : 'w-2/12 tab'
        "
        @click="select('floatrequests')"
      >
        Float Requests
      </div>
      <div
        :class="
          activeTab == 'floatallocation' ? 'w-2/12 tab-active' : 'w-2/12 tab'
        "
        @click="select('floatallocation')"
      >
        Float Allocation
      </div>
      <div
        :class="
          activeTab == 'transactions' ? 'w-2/12 tab-active' : 'w-2/12 tab'
        "
        @click="select('transactions')"
      >
        Transactions
      </div>
      <div
        :class="
          activeTab == 'floatledgers' ? 'w-2/12 tab-active' : 'w-2/12 tab'
        "
        @click="select('floatledgers')"
      >
        Float Ledger
      </div>

      <!-- <div
        :class="
          activeTab == 'branchbalance' ? 'w-2/12 tab-active' : 'w-2/12 tab'
        "
        @click="select('branchbalance')"
      >
        Branch Balance
      </div> -->
      <!-- <div
        :class="
          activeTab == 'tillbalance' ? 'w-2/12 tab-active' : 'w-2/12 tab'
        "
        @click="select('tillbalance')"
      >
        Till Balance
      </div> -->
    </div>
    <div class="flex flex-grow">
      <div class="w-full">
        <!-- <BackofficeAccounts v-if="activeTab == 'backoffice'" />
        <UserAccounts v-if="activeTab == 'users'" /> -->
        <Transactions v-if="activeTab == 'transactions'" />
        <!-- <FloatManagement v-if="activeTab == 'floatallocation'" /> -->
        <FloatAllocationTabbed v-if="activeTab == 'floatallocation'" />
        <FloatLedgers v-if="activeTab == 'floatledgers'" />
        <FloatRequests v-if="activeTab == 'floatrequests'" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";

.cell {
  @apply w-6/12 px-1 my-2;
}

.cell-full {
  @apply w-full px-1 my-2;
}

.tab {
  @apply cursor-pointer p-2 border-b border-gray-300 text-sm text-center;
}

.tab-active {
  @apply cursor-pointer p-2 border-b-4 border-primary-700 text-sm text-center;
}
</style>
