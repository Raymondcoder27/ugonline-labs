<script setup lang="ts">

import PieChart from "@/tilloperatordomain/analytics/components/PieChart.vue";

import type {Ref} from "vue";
import type {GraphData, Statistic} from "@/tilloperatordomain/analytics/types/chart";
import {ref} from "vue";
import AreaChart from "@/tilloperatordomain/analytics/components/AreaChart.vue";

const revenueByTime: Ref<Array<GraphData>> = ref([
  {
    data: [
      {
        x: 'June',
        y: 40000000
      },
      {
        x: 'July',
        y: 56000000
      },
      {
        x: 'August',
        y: 180000000
      },
      {
        x: 'Sept',
        y: 25000000
      },
      {
        x: 'October',
        y: 22000000
      },
      {
        x: 'November',
        y: 310000000
      },
      {
        x: 'December',
        y: 220000000
      },
      {
        x: 'January',
        y: 28000000
      }
    ]
  }
])

function labelExtractor(data:Statistic[]){
  let labels = []
  for(let i = 0; i < data.length - 1; i++){
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
              <p class="text-xl font-bold py-2">{{Number(6341883900).toLocaleString()}}</p>
              <p class="text-xs">Total Revenue</p>
            </div>
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">{{Number(6274328300).toLocaleString()}}</p>
              <p class="text-xs">Available Revenue</p>
            </div>
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">{{Number(189334600).toLocaleString()}}</p>
              <p class="text-xs">Pending Revenue</p>
            </div>
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">{{Number(67555600).toLocaleString()}}</p>
              <p class="text-xs">Failed Transaction Revenue</p>
            </div>
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">{{Number(5433328300).toLocaleString()}}</p>
              <p class="text-xs">NTR Revenue</p>
            </div>
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">{{Number(908555600).toLocaleString()}}</p>
              <p class="text-xs">Non-NTR Revenue</p>
            </div>
          </div>
          <div class="flex">
            <div class="w-full">
              <AreaChart title="Revenue over time" :graph-data="revenueByTime" :is-horizontal="false" :labels="labelExtractor(revenueByTime[0].data)"/>
            </div>
          </div>
        </div>
      </div>
      <p class="py-5">Services</p>
      <div class="flex">
        <div class="w-full">
          <div class="flex">
            <div class="w-6/12">
              <PieChart title="Transaction Success rate" :data="[6274328300, 67555600, 189334600]" :labels="['Success','Failure','Pending']"/>
            </div>
            <div class="w-6/12">
              <PieChart title="Collection Distribution by source" :data="[5433328300, 908555600]" :labels="['NTR','Non NTR']"/>
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