<script setup lang="ts">

import {useGatewayStore} from "@/branchmanagerdomain/gateway/stores";
import {onMounted, ref, type Ref} from "vue";
import moment from "moment";

const loading: Ref<boolean> = ref(false)
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(15);

const props = defineProps({
  providerId:String
})

const store = useGatewayStore()
onMounted(() => {
  fetch()
})

function fetch(){
  loading.value = true
  store.fetchFeaturesByProvider(page.value, limit.value, props.providerId ?? "")
      .then(() => (loading.value = false))
      .catch(() => {
        loading.value = false
      })
}

function next(){
  page.value += 1
  fetch()
}

function previous(){
  page.value -= 1
  fetch()
}

function convertDateTime(date:string){
  return moment(date).format("DD-MM-YYYY HH:mm:ss")
}

</script>

<template>
  <div class="bg-white py-5">
    <div class="flex">
      <div class="w-full text-xs">
        <table class="table">
          <thead>
          <tr class="header-tr">
            <th class="t-header">ID</th>
            <th class="t-header">Label</th>
            <th class="text-center">Online Status</th>
            <th class="text-center">Publish Status</th>
            <th class="text-center">Date</th>
          </tr>
          </thead>
          <thead v-if="loading">
          <tr>
            <th colspan="12" style="padding: 0">
              <div class="w-full bg-primary-600 h-1 p-0 m-0 animate-pulse"></div>
            </th>
          </tr>
          </thead>
          <tbody v-if="store.features">
          <tr class="body-tr"
              v-for="(feature, idx) in store.features"
              :key="idx">
            <td class="text-xs">
              {{feature.id}}
            </td>
            <td class="text-xs">
              <span class="font-bold uppercase">{{feature.label}}</span>
            </td>
            <td class="text-xs text-center">
              {{feature.status}}
            </td>
            <td class="text-xs text-center">
              <label v-if="feature.publishedAt" class="bg-green-500 text-white rounded p-1">PUBLISHED<i class="mx-1 fa-solid fa-check"></i></label>
              <label v-else class="border border-gray-100 rounded p-1">PENDING</label>
            </td>

            <td class="text-center text-xs">{{ convertDateTime(feature.publishedAt) }}</td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr class="body-tr px-5">
            <td class="text-xs text-center bg-gray-100" colspan="12">No features found</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex">
      <div class="w-full">
        <div class="flex" v-if="limit == store.features?.length || page > 1">
          <button v-if="page > 1" class="pagination-button" @click="previous"> <i class="fa-solid fa-arrow-left"></i></button>
          <button v-else class="pagination-button-inert" @click="next"><i class="fa-solid fa-arrow-left"></i></button>
          <div class="w-1/12 text-center my-auto">
            <label class="rounded text-white bg-primary-700 px-3 py-1">{{page}}</label>
          </div>
          <button v-if="limit == store.features?.length" class="pagination-button" @click="next"><i class="fa-solid fa-arrow-right"></i></button>
          <button v-else class="pagination-button-inert" @click="next"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/forms.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";
</style>@/branchmanager/gateway/stores