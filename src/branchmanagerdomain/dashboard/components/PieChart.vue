<script setup lang="ts">

import {onMounted, ref, type Ref} from "vue";

type Option = {
  chart:{
    type: string
  }
  labels : string[]
  responsive: any[]
}
const options:Ref<Option> = ref({
    chart: {
      type: 'donut'
    },
    labels: [],
    responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
    ]
})

const props = defineProps({
  title:String,
  data: Array<Number>,
  labels: Array<string>,
})

onMounted(() => {
   options.value.labels = props.labels || []
})

</script>

<template>
  <div class="flex bg-white border border-gray-200 rounded px-2 m-1">
    <div class="w-full">
      <div class="flex">
        <div class="w-full p-3">
          <label class="font-bold">{{props.title}}</label>
        </div>
      </div>
      <div class="flex">
        <div class="w-full">
          <apexchart style="width: 100%" :options="options" :series="props.data"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>