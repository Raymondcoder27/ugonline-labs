<script setup lang="ts">
import BarChart from "@/agentadmindomain/analytics/components/BarChart.vue";
import LineChart from "@/agentadmindomain/analytics/components/LineChart.vue";
import PieChart from "@/agentadmindomain/analytics/components/PieChart.vue";
import { useBranchStore } from "@/agentadmindomain/branches/stores";
const branchStore = useBranchStore();

const totalBranches = branchStore.branches?.length || 0;

branchStore.fetchBranches();

import type { Ref } from "vue";
import type { GraphData, Statistic } from "@/agentadmindomain/analytics/types/chart";
import { ref } from "vue";

const providerOnboarding: Ref<Array<GraphData>> = ref([
  {
    data: [
      {
        x: "October",
        y: 0,
      },
      {
        x: "November",
        y: 2,
      },
      {
        x: "December",
        y: 6,
      },
      {
        x: "January",
        y: 8,
      },
    ],
  },
]);

function labelExtractor(data: Statistic[]) {
  let labels = [];
  for (let i = 0; i < data.length; i++) {
    labels.push(data[i].x);
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
              <!-- <p class="text-xl font-bold py-2">16</p> -->
              <p class="text-xl font-bold py-2" style="font-size: 18px">
                {{ totalBranches }}
              </p>
              <!-- <p class="text-xs">Total Providers</p> -->
              <p class="text-xs">Total Branches</p>
            </div>
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">32</p>
              <p class="text-xs">Total tills</p>
            </div>
            <!-- <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">6</p>
              <p class="text-xs">Offline Providers</p>
            </div>
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">11</p>
              <p class="text-xs">Gateway Configured Providers</p>
            </div> -->
          </div>
          <div class="block">
            <div class="flex">
              <div class="w-6/12">
                <LineChart
                  title="Distribution of Till Operator onboarding"
                  :graph-data="providerOnboarding"
                  :is-horizontal="false"
                  :labels="labelExtractor(providerOnboarding[0].data)"
                />
              </div>
              <div class="w-6/12">
                <PieChart
                  title="Distribution of Till Operators by Branch"
                  :data="[22, 14, 18, 13, 9, 6, 4, 8, 17, 4, 5]"
                  :labels="[
                    'Branch 1',
                    'Branch 2',
                    'Branch 3',
                    'Branch 4',
                    'Branch 5',
                    'Branch 6',
                    'Branch 7',
                    'Branch 8',
                    'Branch 9',
                    'Branch 10',
                    'Branch 11',
                  ]"
                />
              </div>
            </div>
            <div class="w-6/12">
              <PieChart
                title="Distribution of Till Operators by Gender"
                :data="[43, 57]"
                :labels="['Male', 'Female']"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.count {
  @apply py-2 text-center border border-gray-100 rounded bg-gray-10 mx-1 shadow;
}
</style>