<script setup lang="ts">

import BarChart from "@/tilloperatordomain/analytics/components/BarChart.vue";

import type {Ref} from "vue";
import type {GraphData, ProviderRegistrationStatistic, Statistic} from "@/tilloperatordomain/analytics/types/chart";
import {onMounted, ref, watch} from "vue";
import {useGatewayReportsStore} from "@/tilloperatordomain/analytics/stores";
import moment from "moment/moment";
import AreaChart from "@/tilloperatordomain/analytics/components/AreaChart.vue";

const store = useGatewayReportsStore()
const loading: Ref<boolean> = ref(false)
const data: Ref<Array<GraphData>> = ref([
  {
    data: [
      {
        x: 'Data 1',
        y: 40
      },
      {
        x: 'Data 2',
        y: 56
      },
      {
        x: 'Data 3',
        y: 18
      },
      {
        x: 'Data 4',
        y: 25
      },
      {
        x: 'Data 5',
        y: 22
      },
      {
        x: 'Data 6',
        y: 31
      },
      {
        x: 'Data 7',
        y: 22
      },
      {
        x: 'Data 8',
        y: 28
      }
    ]
  }
])
const xComp: Ref<string> = ref("date");
const yComp: Ref<string> = ref("requests");

onMounted(() => {
  fetchProvidersByConfigurationDate()
  fetchRequestComparison(xComp.value, yComp.value)
})

function fetchProvidersByConfigurationDate(){
  store.fetchProviderByRegistrations()
      .then(() => (loading.value = false))
      .catch((error:any) => {
        loading.value = false
        alert(JSON.stringify(error))
      })
}

function fetchRequestComparison(x:string, y:string){
  store.fetchRequestComparison(x, y)
      .then(() => (loading.value = false))
      .catch((error:any) => {
        loading.value = false
        alert(JSON.stringify(error))
      })
}

function generateProvidersRegistrationGraphData(results:ProviderRegistrationStatistic[]){
  let data:Array<Statistic> = []
  for(let i = 0; i < results.length; i++){
    data[i] = {
      x: convertDate(results[i].date),
      y: results[i].providers,
    }
  }
  return data;
}

function labelExtractor(data:Statistic[]){
  let labels = []
  for(let i = 0; i < data.length; i++){
    labels.push(data[i].x)
  }
  return labels;
}

function convertDate(date:string){
  return moment(date).format("DD-MM-YYYY")
}

watch(
    () => xComp,
    () => {
      fetchRequestComparison(xComp.value, yComp.value)
    },
    { deep: true }
);

watch(
    () => yComp,
    () => {
      fetchRequestComparison(xComp.value, yComp.value)
    },
    { deep: true }
);

</script>

<template>
  <div class="flex px-2">
    <div class="w-full border-r border-gray-200 px-2">
      <div class="flex">
        <div class="w-full">
          <div class="flex">
            <div class="w-2/12 mr-1">
              <label class="font-bold text-xs">X Axis Comparator</label>
              <select v-model="xComp" class="form-element e-select">
                <option value="date">Date</option>
                <option value="status">Status</option>
              </select>
            </div>
            <div class="w-2/12">
              <label class="font-bold text-xs">Y Axis Comparator</label>
              <select v-model="yComp" class="form-element e-select">
                <option value="percentage">Percentage</option>
                <option value="requests">Request Count</option>
              </select>
            </div>
          </div>
          <div class="flex">
            <div class="w-full text-center">
              <span class="lds-ring mx-auto" v-if="loading">
                  <div></div><div></div><div></div><div></div>
              </span>
            </div>
          </div>
          <div class="flex">
            <div class="w-full" v-if="store.requestComparison">
              <AreaChart title="Request Comparator"  :graph-data="[{data: store.requestComparison}]" :is-horizontal="false" :labels="labelExtractor(store.requestComparison)"/>
            </div>
          </div>
        </div>
      </div>
      <div class="flex">
        <div class="w-full" v-if="store.providersByRegistration">
          <BarChart title="Providers Configuration by date" :graph-data="[{data: generateProvidersRegistrationGraphData(store.providersByRegistration)}]"
                    :is-horizontal="false"
                    :labels="labelExtractor(generateProvidersRegistrationGraphData(store.providersByRegistration))"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
.count{
  @apply py-2 text-center border border-gray-100 rounded bg-gray-10 mx-1 shadow;
}
</style>