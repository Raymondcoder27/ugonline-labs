<script setup lang="ts">

import type {GraphData} from "@/agentadmindomain/analytics/types/chart";
import {onMounted, ref, type Ref} from "vue";

type Option = {
  chart:{
    type: string
  }
  labels : string[]
  colors : string[]
  plotOptions: {
    bar:{
      horizontal:boolean
    }
  }
}

const options:Ref<Option> = ref( {
  chart: {
    type: 'line'
  },
  labels:[],
  colors: ['#a8c226'],
  plotOptions: {
    bar: {
      horizontal: true
    }
  }
})

const props = defineProps({
  title:String,
  graphData: Array<GraphData>,
  isHorizontal:Boolean,
  labels: Array<string>
})

onMounted(() => {
  options.value.plotOptions.bar.horizontal = props.isHorizontal
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
          <apexchart style="width: 100%" :options="options" :series="props.graphData"/>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>