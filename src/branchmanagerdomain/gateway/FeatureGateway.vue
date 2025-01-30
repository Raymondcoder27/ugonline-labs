<script setup lang="ts">
import Features from "@/branchmanagerdomain/gateway/Features.vue";
import DeadLetters from "@/branchmanagerdomain/gateway/DeadLetters.vue";
import {ref, type Ref} from "vue";
import Callbacks from "@/branchmanagerdomain/gateway/Callbacks.vue";
import OutgoingRequests from "@/branchmanagerdomain/gateway/OutgoingRequests.vue";

const activeTab: Ref<string> = ref("features")

function select(tab:string){
  activeTab.value = tab
}
</script>

<template>
  <div class="w-full shadow-lg bg-white rounded p-2">
    <div class="flex">
      <div class="w-full py-1">
        <i class="bg-primary-700 border border-primary-800 text-white p-2 rounded-full fa-solid fa-cloud"></i>
        <label class="text-lg mx-1">Feature Gateway</label>
      </div>
    </div>
    <div class="flex pt-5">
      <div :class=" (activeTab == 'features') ? 'w-1/12 tab-active' : 'w-1/12 tab'" @click="select('features')">Features</div>
      <div :class="(activeTab == 'outgoing-applications') ? 'w-2/12 tab-active' :'w-2/12 tab'" @click="select('outgoing-applications')">Outgoing Requests</div>
      <div :class="(activeTab == 'callbacks') ? 'w-1/12 tab-active' :'w-1/12 tab'" @click="select('callbacks')">Callbacks</div>
      <div :class="(activeTab == 'dead-letters') ? 'w-1/12 tab-active' :'w-1/12 tab'" @click="select('dead-letters')">Dead letters</div>
    </div>
    <div class="flex">
      <div class="w-full">
        <Features v-if="activeTab == 'features'"/>
        <OutgoingRequests v-if="activeTab == 'outgoing-applications'"/>
        <Callbacks v-if="activeTab == 'callbacks'"/>
        <DeadLetters v-if="activeTab == 'dead-letters'"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";

.tab{
  @apply cursor-pointer p-2 border-b border-gray-300 text-sm text-center;
}

.tab-active{
  @apply cursor-pointer p-2 border-b-4 border-primary-700 text-sm text-center;
}
</style>
