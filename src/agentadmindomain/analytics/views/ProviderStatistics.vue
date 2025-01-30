<script setup lang="ts">

import BarChart from "@/agentadmindomain/analytics/components/BarChart.vue";
import LineChart from "@/agentadmindomain/analytics/components/LineChart.vue";
import PieChart from "@/agentadmindomain/analytics/components/PieChart.vue";

import type {Ref} from "vue";
import type {GraphData, Statistic} from "@/agentadmindomain/analytics/types/chart";
import {ref} from "vue";

const providerOnboarding: Ref<Array<GraphData>> = ref([
  {
    data: [
      {
        x: 'October',
        y: 0
      },
      {
        x: 'November',
        y: 2
      },
      {
        x: 'December',
        y: 6
      },
      {
        x: 'January',
        y: 8
      }
    ]
  }
])

function labelExtractor(data:Statistic[]){
  let labels = []
  for(let i = 0; i < data.length; i++){
    labels.push(data[i].x)
  }
  return labels;
}

</script>

<template>
  <div class="flex px-2">
    <div class="w-full border-r border-gray-200 px-2">
      <div class="flex">
        <div class="w-full">
          <div class="flex my-2">
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">16</p>
              <p class="text-xs">Total Providers</p>
            </div>
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">10</p>
              <p class="text-xs">Online Providers</p>
            </div>
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">6</p>
              <p class="text-xs">Offline Providers</p>
            </div>
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">11</p>
              <p class="text-xs">Gateway Configured Providers</p>
            </div>
          </div>
          <div class="flex">
            <div class="w-6/12">
              <LineChart title="Distribution of Provider onboarding" :graph-data="providerOnboarding" :is-horizontal="false"
                         :labels="labelExtractor(providerOnboarding[0].data)"/>
            </div>
            <div class="w-6/12">
              <PieChart title="Distribution of Providers by Type" :data="[78, 22]" :labels="['Government','Private']"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.count{
  @apply py-2 text-center border border-gray-100 rounded bg-gray-10 mx-1 shadow;
}
</style>