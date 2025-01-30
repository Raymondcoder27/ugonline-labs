<script setup lang="ts">
import { ref, type Ref } from "vue";
import BackofficeAccounts from "@/tilloperatordomain/accounts/BackofficeAccounts.vue";
import UserAccounts from "@/tilloperatordomain/accounts/UserAccounts.vue";

const activeTab: Ref<string> = ref("backoffice")

function select(tab: string) {
  activeTab.value = tab
}

</script>

<template>
  <div class="flex flex-col w-full shadow-lg bg-white rounded p-2 h-full">
    <div class="flex">
      <div class="w-full py-1">
        <i class="bg-primary-700 border border-primary-800 text-white p-2 rounded-full fa-solid fa-users"></i>
        <label class="text-lg mx-1">System Accounts</label>
      </div>
    </div>
    <div class="flex pt-5">
      <div :class="(activeTab == 'backoffice') ? 'w-1/12 tab-active' : 'w-1/12 tab'" @click="select('backoffice')">
        Backoffice</div>
      <div :class="(activeTab == 'users') ? 'w-2/12 tab-active' : 'w-2/12 tab'" @click="select('users')">Public Users
      </div>
    </div>
    <div class="flex flex-grow">
      <div class="w-full">
        <BackofficeAccounts v-if="activeTab == 'backoffice'" />
        <UserAccounts v-if="activeTab == 'users'" />
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

.tab{
  @apply cursor-pointer p-2 border-b border-gray-300 text-sm text-center;
}

.tab-active{
  @apply cursor-pointer p-2 border-b-4 border-primary-700 text-sm text-center;
}

</style>
