<script setup lang="ts">

import {onMounted, ref, type Ref} from "vue";
import {useGatewayStore} from "@/branchmanagerdomain/gateway/stores";
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
  store.fetchDlqByProvider(page.value, limit.value,props.providerId ?? "")
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
            <th class="t-header">MessageID</th>
            <th class="t-header">Feature</th>
            <th class="text-center">HttpCode</th>
            <th class="t-header">Body</th>
            <th class="t-header">Error</th>
            <th class="text-center">Status</th>
            <th class="text-center">Retries</th>
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
          <tbody v-if="store.dlq">
          <tr class="body-tr"
              v-for="(letter, idx) in store.dlq"
              :key="idx">
            <td class="text-xs">
              {{letter.messageId}}
            </td>
            <td class="text-xs">
              {{letter.featureId}}
            </td>
            <td class="text-xs text-center">
              <span v-if="letter.responseCode.Int32 > 200 && letter.responseCode.Int32 < 300" class="text-green-700">
                {{letter.responseCode.Int32}}
              </span>
              <span v-else class="text-red-700">
                {{letter.responseCode.Int32}}
              </span>
            </td>
            <td class="text-xs">
              <span v-if="letter.responseBody.Valid">
                {{letter.responseBody.String}}
              </span>
              <span v-else>
                No body
              </span>
            </td>
            <td class="text-xs">
              <span v-if="letter.error.Valid">
                {{letter.error.String}}
              </span>
              <span v-else>
                No error
              </span>
            </td>
            <td class="text-xs text-center">
              <span v-if="letter.succeededAt.Valid" class="pill pill-active">Success</span>
              <span v-else-if="letter.failedAt.Valid" class="pill pill-danger">Failed</span>
              <span v-else class="pill pill-inert">None</span>
            </td>
            <td class="text-xs text-center">
              <span class="pill pill-idle">{{letter.retryIdx}}</span>
            </td>
            <td class="text-xs text-center">
              {{convertDateTime(letter.createdAt)}}
            </td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr class="body-tr px-5">
            <td class="text-xs text-center bg-gray-100" colspan="12">No dead letters found</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex">
      <div class="w-full">
        <div class="flex" v-if="limit == store.dlq?.length || page > 1">
          <button v-if="page > 1" class="pagination-button" @click="previous"> <i class="fa-solid fa-arrow-left"></i></button>
          <button v-else class="pagination-button-inert" @click="next"><i class="fa-solid fa-arrow-left"></i></button>
          <div class="w-1/12 text-center my-auto">
            <label class="rounded text-white bg-primary-700 px-3 py-1">{{page}}</label>
          </div>
          <button v-if="limit == store.dlq?.length" class="pagination-button" @click="next"><i class="fa-solid fa-arrow-right"></i></button>
          <button v-else class="pagination-button-inert" @click="next"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/widgets.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/forms.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";
</style>@/branchmanager/gateway/stores