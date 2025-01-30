<script setup lang="ts">

import {onMounted, ref, type Ref} from "vue";
import {useGatewayStore} from "@/branchmanagerdomain/gateway/stores";
import moment from "moment";
import AppModal from "@/components/AppModal.vue";
import CallbackPreview from "@/branchmanagerdomain/gateway/components/CallbackPreview.vue";

const loading: Ref<boolean> = ref(false)
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(15);
const previewModalOpen: Ref<boolean> = ref(false);

const selectedRequest:Ref<Object> = ref({})

const props = defineProps({
  providerId:String
})

const store = useGatewayStore()
onMounted(() => {
  fetch()
})

function fetch(){
  loading.value = true
  store.fetchCallbacksByProvider(page.value, limit.value,props.providerId ?? "")
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

function preview(request:Object){
  console.log(request)
  selectedRequest.value = request
  previewModalOpen.value = !previewModalOpen.value
}

function convertDateTime(date:string){
  return moment(date).format("DD-MM-YYYY HH:mm:ss")
}

function close() {
  previewModalOpen.value = false;
}

</script>

<template>
  <div class="bg-white py-5">
    <div class="flex">
      <div class="w-full text-xs">
        <div class="flex">
          <div class="w-1/12">
            <button class="button-sm" @click="fetch">
              <i class="fa-solid fa-refresh mx-1"></i> Refresh
            </button>
          </div>
        </div>
        <table class="table">
          <thead>
          <tr class="header-tr">
            <th class="t-header">Request ID</th>
            <th class="t-header">Remote IP</th>
            <th class="t-header">Method</th>
            <th class="t-header">Processed At</th>
            <th class="t-header">Date</th>
            <th class="text-center"></th>
          </tr>
          </thead>
          <thead v-if="loading">
          <tr>
            <th colspan="12" style="padding: 0">
              <div class="w-full bg-primary-600 h-1 p-0 m-0 animate-pulse"></div>
            </th>
          </tr>
          </thead>
          <tbody v-if="store.callbacks">
            <tr class="body-tr"
                v-for="(callback, idx) in store.callbacks"
                :key="idx">
              <td class="text-xs">
                {{callback.requestId}}
              </td>
              <td class="text-xs">
                {{callback.remoteIp}}
              </td>
              <td class="text-xs">
                <span class="bg-gray-50 p-1 rounded border border-gray-300">{{callback.method}}</span>
              </td>

              <td class="text-xs">
                {{convertDateTime(callback.processedAt)}}
              </td>
              <td class="text-xs">
                {{convertDateTime(callback.createdAt)}}
              </td>
              <td class="text-center">
                <div class="flex">
                  <i class="fa-solid fa-code p-1 mx-1 border border-orange-200 bg-orange-100 text-orange-600 hover:bg-orange-300" @click="preview(callback)"></i>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
          <tr class="body-tr px-5">
            <td class="text-xs text-center bg-gray-100" colspan="12">No callbacks found</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex">
      <div class="w-full">
        <div class="flex" v-if="limit == store.callbacks?.length || page > 1">
          <button v-if="page > 1" class="pagination-button" @click="previous"> <i class="fa-solid fa-arrow-left"></i></button>
          <button v-else class="pagination-button-inert" @click="next"><i class="fa-solid fa-arrow-left"></i></button>
          <div class="w-1/12 text-center my-auto">
            <label class="rounded text-white bg-primary-700 px-3 py-1">{{page}}</label>
          </div>
          <button v-if="limit == store.callbacks?.length" class="pagination-button" @click="next"><i class="fa-solid fa-arrow-right"></i></button>
          <button v-else class="pagination-button-inert" @click="next"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  </div>

  <AppModal v-model="previewModalOpen" xl2>
    <CallbackPreview :request="selectedRequest" @cancel="close"/>
  </AppModal>

</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/widgets.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/forms.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";
</style>@/branchmanager/gateway/stores