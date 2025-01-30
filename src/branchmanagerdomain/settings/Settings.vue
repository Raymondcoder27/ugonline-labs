<script setup lang="ts">
import {ref, type Ref} from "vue";
import ServiceCategories from "@/branchmanagerdomain/settings/views/ServiceCategories.vue";
import AccessibilityTiers from "@/branchmanagerdomain/settings/views/AccessibilityTiers.vue";

const activeTab: Ref<string> = ref("service-categories")

function select(tab:string){
  activeTab.value = tab
}
</script>

<template>
  <div class="w-full shadow-lg bg-white rounded p-2">
    <div class="flex">
      <div class="w-full py-1">
        <i class="bg-primary-700 border border-primary-800 text-white p-2 rounded-full fa-solid fa-cogs"></i>
        <label class="text-lg mx-1">Settings</label>
      </div>
    </div>
    <div class="flex pt-5">
      <div :class=" (activeTab == 'service-categories') ? 'w-2/12 tab-active' : 'w-2/12 tab'" @click="select('service-categories')">Service Categories</div>
      <div :class="(activeTab == 'accessibility-tiers') ? 'w-2/12 tab-active' :'w-2/12 tab'" @click="select('accessibility-tiers')">Accessibility Tiers</div>
    </div>
    <div class="flex">
      <div class="w-full">
        <ServiceCategories v-if="activeTab == 'service-categories'"/>
        <AccessibilityTiers v-if="activeTab == 'accessibility-tiers'"/>
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
