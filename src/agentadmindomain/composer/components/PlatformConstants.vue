<script setup lang="ts">

import {ref} from "vue";
const emit = defineEmits(['selectedConstant'])
let constants = ref([
  {
    name:"Administrative Units",
    specificationId:"",
    specification:"",
    createdAt:"10-12-1990",
    version:{
      major:1,
      minor:2
    }
  },
  {
    name:"Countries",
    specificationId:"",
    specification:"",
    createdAt:"10-12-1990",
    version:{
      major:1,
      minor:16
    }
  },
  {
    name:"Nationalities",
    specificationId:"",
    specification:"",
    createdAt:"10-12-1990",
    version:{
      major:2,
      minor:2
    }
  }
])

function use(constant:Object){
  emit('selectedConstant', constant)
}

</script>

<template>
  <div class="flex py-5">
    <div class="w-10/12 mx-auto">
      <div class="flex cursor-pointer hover:bg-gray-10" v-for="(constant, idx) in constants" :key="idx" @click="use(constant)">
        <div class="w-full border border-gray-100">
          <div class="flex">
            <div class="w-1/12 border border-gray-100 rounded-sm">
              <i class="fa-solid fa-file text-xl p-3 text-gray-600"></i>
            </div>
            <div class="w-10/12 pl-2 my-auto">
              <label class="mt-5">{{constant.name}}</label>
            </div>
            <div class="w-1/12 float-right p-1">
              <label class="float-right px-2 border border-gray-200 rounded-sm text-xs my-auto">v{{constant.version.major}}.{{constant.version.minor}}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>