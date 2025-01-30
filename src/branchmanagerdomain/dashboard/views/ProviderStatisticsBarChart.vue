<script setup lang="ts">
import BarChart from "@/branchmanagerdomain/analytics/components/BarChart.vue";
import LineChart from "@/branchmanagerdomain/analytics/components/LineChart.vue";
import PieChart from "@/branchmanagerdomain/analytics/components/PieChart.vue";

import { useServicesStore } from "@/branchmanagerdomain/services/stores";

const servicesStore = useServicesStore();

const totalServices = servicesStore.subscribedServices?.length || 0;

import type { Ref } from "vue";
import type { GraphData, Statistic } from "@/branchmanagerdomain/analytics/types/chart";
import { ref } from "vue";

const data: Ref<Array<GraphData>> = ref([
  {
    data: [
      {
        x: "Data 1",
        y: 40,
      },
      {
        x: "Data 2",
        y: 56,
      },
      {
        x: "Data 3",
        y: 18,
      },
      {
        x: "Data 4",
        y: 25,
      },
      {
        x: "Data 5",
        y: 22,
      },
      {
        x: "Data 6",
        y: 31,
      },
      {
        x: "Data 7",
        y: 22,
      },
      {
        x: "Data 8",
        y: 28,
      },
    ],
  },
]);
const serviceDistributionByProvider: Ref<Array<GraphData>> = ref([
  {
    data: [
      {
        x: "URSB",
        y: 9,
      },
      {
        x: "NIRA",
        y: 5,
      },
      {
        x: "Lands",
        y: 2,
      },
      {
        x: "UPF",
        y: 5,
      },
      {
        x: "Agric",
        y: 5,
      },
      {
        x: "MOFA",
        y: 3,
      },
      {
        x: "NWSC",
        y: 3,
      },
      {
        x: "KCCA",
        y: 14,
      },
      {
        x: "UNRA",
        y: 0,
      },
      {
        x: "Gender",
        y: 2,
      },
      {
        x: "Posta",
        y: 4,
      },
      {
        x: "MOIA",
        y: 4,
      },
      {
        x: "URA",
        y: 8,
      },
      {
        x: "MAAIF",
        y: 0,
      },
      {
        x: "UMA",
        y: 0,
      },
      {
        x: "Public Service",
        y: 3,
      },
    ],
  },
]);
const applicationDistributionByProvider: Ref<Array<GraphData>> = ref([
  {
    data: [
      {
        x: "URSB",
        y: 34500,
      },
      {
        x: "NIRA",
        y: 14500,
      },
      {
        x: "Lands",
        y: 8220,
      },
      {
        x: "UPF",
        y: 8456,
      },
      {
        x: "Agric",
        y: 9005,
      },
      {
        x: "MOFA",
        y: 1300,
      },
      {
        x: "NWSC",
        y: 30440,
      },
      {
        x: "KCCA",
        y: 24992,
      },
      {
        x: "UNRA",
        y: 3200,
      },
      {
        x: "Gender",
        y: 2010,
      },
      {
        x: "Posta",
        y: 8332,
      },
      {
        x: "MOIA",
        y: 33050,
      },
      {
        x: "URA",
        y: 44890,
      },
      {
        x: "MAAIF",
        y: 4491,
      },
      {
        x: "UMA",
        y: 445,
      },
      {
        x: "Public Service",
        y: 3280,
      },
    ],
  },
]);
const serviceApplicationsDistribution: Ref<Array<GraphData>> = ref([
  {
    data: [
      {
        x: "October",
        y: 0,
      },
      {
        x: "November",
        y: 500,
      },
      {
        x: "December",
        y: 2032,
      },
      {
        x: "January",
        y: 105,
      },
    ],
  },
]);

function labelExtractor(data: Statistic[]) {
  let labels = [];
  for (let i = 0; i < data.length - 1; i++) {
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
            <!-- <div class="w-2/12 count"> -->
            <div class="count w-2/12">
              <!-- <p class="text-xl font-bold py-2">60</p> -->
              <!-- <p class="text-xl font-bold py-2">8</p> -->
              <p class="text-xl font-bold py-2">
                {{ totalServices }}
              </p>
              <p class="text-xs">Total Services</p>
            </div>
            <!-- <div class="w-2/12 count"> -->
            <div class="count w-[130px]">
              <!-- <p class="text-xl font-bold py-2">50</p> -->
              <p class="text-xl font-bold py-2">7</p>
              <p class="text-xs">Active</p>
            </div>
            <!-- <div class="w-2/12 count"> -->
            <div class="count w-[130px]">
              <!-- <p class="text-xl font-bold py-2">10</p> -->
              <p class="text-xl font-bold py-2">1</p>
              <p class="text-xs">Inactive</p>
            </div>
          </div>
        </div>
      </div>
      <div class="flex">
        <div class="w-full">
          <BarChart
            title="Distribution of Services by Provider"
            :graph-data="serviceDistributionByProvider"
            :is-horizontal="false"
            :labels="labelExtractor(serviceDistributionByProvider[0].data)"
          />
        </div>
      </div>

      <div class="flex">
        <div class="w-full">
          <BarChart
            title="Distribution of Service Applications by provider"
            :graph-data="applicationDistributionByProvider"
            :is-horizontal="false"
            :labels="labelExtractor(applicationDistributionByProvider[0].data)"
          />
        </div>
      </div>
      <div class="flex">
        <div class="w-full">
          <div class="flex">
            <!-- <div class="w-6/12">
              <LineChart
                title="Distribution of Service Applications"
                :graph-data="serviceApplicationsDistribution"
                :is-horizontal="false"
                :labels="
                  labelExtractor(serviceApplicationsDistribution[0].data)
                "
              />
            </div>
            <div class="w-6/12">
              <PieChart
                title="Distribution of Service by Status"
                :data="[45, 35, 18]"
                :labels="['Active', 'Inactive', 'Other']"
              />
            </div> -->
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
<!-- @/branchmanager/services/stores@/branchmanager/analytics/types/chart -->