<script setup lang="ts">

import GatewayStatistics from "@/agentadmindomain/analytics/views/GatewayStatistics.vue";
import {type Ref, ref} from "vue";
import ProviderStatistics from "@/agentadmindomain/analytics/views/ProviderStatistics.vue";
import ServicesStatistics from "@/agentadmindomain/analytics/views/ServicesStatistics.vue";
import RevenueStatistics from "@/agentadmindomain/analytics/views/RevenueStatistics.vue";
import UserStatistics from "@/agentadmindomain/analytics/views/UserStatistics.vue";

const activeTab:Ref<string> = ref("providers")

function select(tab:string){
  activeTab.value = tab
}
</script>

<template>
  <div class="w-full shadow-lg bg-white rounded">
    <div class="flex p-2">
      <div class="w-full py-1">
        <i class="bg-primary-700 border border-primary-800 text-white p-2 rounded-full fa-solid fa-chart-line"></i>
        <label class="text-lg mx-1">Data Analytics</label>
      </div>
    </div>

    <div class="flex">
      <div class="w-2/12 py-1">
        <div :class="(activeTab == 'providers') ? 'tab-active' : 'tab'" @click="select('providers')">
          <div class="w-full py-1 my-auto">
            <label class="p-3">Providers</label>
            <i class="fa-solid fa-chart-area float-right px-2 py-1" v-if="activeTab == 'providers'"></i>
          </div>
        </div>
        <div :class="(activeTab == 'services') ? 'tab-active' : 'tab'" @click="select('services')">
          <div class="w-full py-1">
            <label class="p-3">Services Registry</label>
            <i class="fa-solid fa-chart-area float-right px-2 py-1" v-if="activeTab == 'services'"></i>
          </div>
        </div>
        <div :class="(activeTab == 'gateway') ? 'tab-active' : 'tab'" @click="select('gateway')">
          <div class="w-full py-1">
            <label class="p-3">Gateway</label>
            <i class="fa-solid fa-chart-area float-right px-2 py-1" v-if="activeTab == 'gateway'"></i>
          </div>
        </div>
        <div :class="(activeTab == 'revenue') ? 'tab-active' : 'tab'" @click="select('revenue')">
          <div class="w-full py-1">
            <label class="p-3">Revenue</label>
            <i class="fa-solid fa-chart-area float-right px-2 py-1" v-if="activeTab == 'revenue'"></i>
          </div>
        </div>
        <div :class="(activeTab == 'users') ? 'tab-active' : 'tab'" @click="select('users')">
          <div class="w-full py-1">
            <label class="p-3">Users</label>
            <i class="fa-solid fa-chart-area float-right px-2 py-1" v-if="activeTab == 'users'"></i>
          </div>
        </div>
      </div>
      <div class="w-10/12 py-1">
        <ProviderStatistics v-if="activeTab == 'providers'"/>
        <ServicesStatistics v-if="activeTab == 'services'"/>
        <GatewayStatistics v-if="activeTab == 'gateway'"/>
        <RevenueStatistics v-if="activeTab == 'revenue'"/>
        <UserStatistics v-if="activeTab == 'users'"/>
      </div>
    </div>



  </div>
</template>

<style scoped>
.tab-active{
  @apply flex border-2 border-primary-700 rounded-r cursor-pointer bg-primary text-white font-bold;
}

.tab{
  @apply flex border border-gray-100 rounded-r cursor-pointer;
}

.tab:hover{
  @apply bg-primary text-white;
}
</style>