<script setup lang="ts">
import ProviderStatisticsBarChart from "@/agentadmindomain/dashboard/views/ProviderStatisticsBarChart.vue";
// import LineChart from "@/agentadmindomain/dashboard/components/LineChart.vue";
// import PieChart from "@/agentadmindomain/dashboard/components/PieChart.vue";

import GatewayStatistics from "@/agentadmindomain/dashboard/views/ServiceStatusPieChart.vue";
import { type Ref, ref } from "vue";
// import ProviderStatistics from "@/agentadmindomain/dashboard/views/ProviderStatistics.vue";
// import ServicesStatistics from "@/agentadmindomain/dashboard/views/ServicesStatistics.vue";
import ApplicationsLineGraph from "@/agentadmindomain/dashboard/views/ApplicationsLineGraph.vue";
// import RevenueStatistics from "@/agentadmindomain/dashboard/views/RevenueStatistics.vue";
// import UserStatistics from "@/agentadmindomain/dashboard/views/UserStatistics.vue";

// import type { Ref } from "vue";
import type { GraphData, Statistic } from "@/agentadmindomain/dashboard/types/chart";
import ServiceStatusPieChart from "@/agentadmindomain/dashboard/views/ServiceStatusPieChart.vue";
// import { ref } from "vue";

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

const activeTab: Ref<string> = ref("providers");

function select(tab: string) {
  activeTab.value = tab;
}
</script>

<template>
  <div class="flex">
    <div class="w-3/12 py-3 text-xs">
      <div
        :class="activeTab == 'providers' ? 'tab-active' : 'tab'"
        @click="select('providers')"
      >
        <div class="w-full py-2 my-auto">
          <label class="p-3">Distribution by Provider</label>
          <i
            class="fa-solid fa-handshake float-right px-2 py-1"
            v-if="activeTab == 'providers'"
          ></i>
        </div>
      </div>
      <div
        :class="activeTab == 'services' ? 'tab-active' : 'tab'"
        @click="select('services')"
      >
        <div class="w-full py-2">
          <label class="p-3">Service Applications Line Graph</label>
          <i
            class="fa-solid fa-chart-area float-right px-1 py-1"
            v-if="activeTab == 'services'"
          ></i>
        </div>
      </div>
      <div
        :class="activeTab == 'serviceStatusPieChart' ? 'tab-active' : 'tab'"
        @click="select('serviceStatusPieChart')"
      >
        <div class="w-full py-2">
          <label class="p-3">Piechart showing Service by Status</label>
          <i
            class="fa-solid fa-chart-pie float-right px-2 py-1"
            v-if="activeTab == 'serviceStatusPieChart'"
          ></i>
        </div>
      </div>
      <!-- <div :class="(activeTab == 'revenue') ? 'tab-active' : 'tab'" @click="select('revenue')">
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
        </div> -->
    </div>
    <div class="w-10/12 py-1">
      <ProviderStatisticsBarChart v-if="activeTab == 'providers'" />
      <!-- <ServicesStatistics v-if="activeTab == 'services'"/> -->
      <ApplicationsLineGraph v-if="activeTab == 'services'" />
      <ServiceStatusPieChart v-if="activeTab == 'serviceStatusPieChart'" />
      <RevenueStatistics v-if="activeTab == 'revenue'" />
      <UserStatistics v-if="activeTab == 'users'" />
    </div>
  </div>
  <div class="flex px-2">
    <div class="w-full border-r border-gray-200 px-2">
      <div class="flex">
        <div class="w-full">
          <!-- <div class="flex my-2">
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">60</p>
              <p class="text-xs">Total Services</p>
            </div>
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">50</p>
              <p class="text-xs">Active</p>
            </div>
            <div class="w-2/12 count">
              <p class="text-xl font-bold py-2">10</p>
              <p class="text-xs">Inactive</p>
            </div>
          </div> -->
        </div>
      </div>
      <!-- <div class="flex">
        <div class="w-full">
          <ServicesByProvidersBarChart
            title="Distribution of Services by Provider"
            :graph-data="serviceDistributionByProvider"
            :is-horizontal="false"
            :labels="labelExtractor(serviceDistributionByProvider[0].data)"
          />
        </div>
      </div>

      <div class="flex">
        <div class="w-full">
          <ServicesByProvidersBarChart
            title="Distribution of Service Applications by provider"
            :graph-data="applicationDistributionByProvider"
            :is-horizontal="false"
            :labels="labelExtractor(applicationDistributionByProvider[0].data)"
          />
        </div>
      </div> -->
      <div class="flex">
        <div class="w-full">
          <div class="flex">
            <div class="w-6/12">
              <LineChart
                title="Distribution of Service Applications"
                :graph-data="serviceApplicationsDistribution"
                :is-horizontal="false"
                :labels="
                  labelExtractor(serviceApplicationsDistribution[0].data)
                "
              />
            </div>
            <div class="w-9/12">
              <PieChart
                title="Distribution of Service by Status"
                :data="[45, 35, 18]"
                :labels="['Active', 'Inactive', 'Other']"
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
.tab-active {
  @apply flex border-2 border-gray-300 rounded-r cursor-pointer bg-gray-400 text-white font-bold;
}

.tab {
  @apply flex border border-gray-100 rounded-r cursor-pointer;
}

.tab:hover {
  @apply bg-gray-400 text-white cursor-pointer;
}
</style>