<script setup lang="ts">

import BarChart from "@/branchmanagerdomain/analytics/components/BarChart.vue";
import LineChart from "@/branchmanagerdomain/analytics/components/LineChart.vue";
import PieChart from "@/branchmanagerdomain/analytics/components/PieChart.vue";

import type {Ref} from "vue";
import type {GraphData, Statistic} from "@/branchmanagerdomain/analytics/types/chart";
import {ref} from "vue";

const userTypeDistribution: Ref<Array<GraphData>> = ref([
  {
    data: [
      {
        x: 'Public Users',
        y: 60000
      },
      {
        x: 'Backoffice Users',
        y: 485
      },
      {
        x: 'Administrator Users',
        y: 145
      }
    ]
  }
])

const backofficeDistributionByProvider: Ref<Array<GraphData>> = ref([
  {
    data: [
      {
        x: 'URSB',
        y: 40
      },
      {
        x: 'NIRA',
        y: 56
      },
      {
        x: 'Lands',
        y: 18
      },
      {
        x: 'UPF',
        y: 15
      },
      {
        x: 'Agric',
        y: 5
      },
      {
        x: 'MOFA',
        y: 22
      },
      {
        x: 'NWSC',
        y: 11
      },
      {
        x: 'KCCA',
        y: 20
      },
      {
        x: 'UNRA',
        y: 22
      },
      {
        x: 'Gender',
        y: 12
      },
      {
        x:"Posta",
        y:34
      },
      {
        x:"MOIA",
        y:2
      },
      {
        x:"URA",
        y:55
      },
      {
        x:"MAAIF",
        y:5
      },
      {
        x:"UMA",
        y:3
      },
      {
        x:"Public Service",
        y:2
      },
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
              <p class="text-xl font-bold py-2">{{Number(360000).toLocaleString()}}</p>
              <p class="text-xs">Total Users</p>
            </div>
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">{{Number(286).toLocaleString()}}</p>
              <p class="text-xs">Backoffice Administrators</p>
            </div>
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">{{Number(45).toLocaleString()}}</p>
              <p class="text-xs">Administrators</p>
            </div>
          </div>
          <div class="flex">
            <div class="w-6/12">
              <PieChart title="Distribution of Users by Gender" :data="[48, 52]" :labels="['Male','Female']"/>
            </div>
            <div class="w-6/12">
              <PieChart title="Distribution of Users by Identity Documents" :data="[68, 22, 10]" :labels="['National ID','Passport', 'Refugee ID']"/>
            </div>
          </div>
        </div>
      </div>
      <div class="flex">
        <div class="w-full">
          <div class="flex">
            <div class="w-full">
              <BarChart title="Distribution of Backoffice Users by Provider"  :graph-data="backofficeDistributionByProvider" :is-horizontal="false"
                        :labels="labelExtractor(backofficeDistributionByProvider[0].data)"/>
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
</style>@/branchmanager/analytics/types/chart