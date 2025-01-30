<script setup lang="ts">

import {onMounted, ref, type Ref} from "vue";
import {useGatewayStore} from "@/branchmanagerdomain/gateway/stores";
import moment from "moment/moment";
import CreateServiceProvider from "@/branchmanagerdomain/entities/views/CreateServiceProvider.vue";
import AppModal from "@/components/AppModal.vue";
import PayloadPreview from "@/branchmanagerdomain/gateway/components/PayloadPreview.vue";

const loading: Ref<boolean> = ref(false)
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(12);
const modalOpen: Ref<boolean> = ref(false);
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
  store.fetchRequestsByProvider(page.value, limit.value, props.providerId ?? "")
      .then(() => (loading.value = false))
      .catch(() => {
        loading.value = false
      })
}
function close() {
  modalOpen.value = false;
  previewModalOpen.value = false;
}

function convertDateTime(date:string){
  return moment(date).format("DD-MM-YYYY HH:mm:ss")
}

function open(request:Object){
  console.log(request)
}

function preview(request:Object){
  console.log(request)
  selectedRequest.value = request
  previewModalOpen.value = !previewModalOpen.value
}

function next(){
  page.value += 1
  fetch()
}

function previous(){
  page.value -= 1
  fetch()
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
        <table class="table" v-if="store.requests">
          <thead>
          <tr class="header-tr">
            <th class="t-header">Request ID</th>
            <th class="t-header">Endpoint</th>
            <th class="t-header">Method</th>
            <th class="text-center">Response Code</th>
            <th class="text-center">Status</th>
            <th class="text-center">DLQ</th>
            <th class="text-center">Date</th>
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
          <tbody>
          <tr class="body-tr"
              v-for="(request, idx) in store.requests"
              :key="idx">
            <td class="text-xs">
              <label @click="open(request)" class="cursor-pointer hover:underline hover:text-primary-700"> {{request.requestId}} <i class="cursor-pointer text-primary-700 hover:text-primary-900 fa-solid fa-copy text-sm"></i></label>
            </td>
            <td class="text-xs">
              {{request.endpoint}}
            </td>
            <td class="text-xs">
              {{request.method}}
            </td>
            <td class="text-xs text-center">
              <span class="font-mono text-green-600" v-if="request.responseCode.Int32 > 199 && request.responseCode.Int32 < 204">{{request.responseCode.Int32}}</span>
              <span class="font-mono text-red-600" v-else>{{request.responseCode.Int32}}</span>
            </td>
            <td class="text-xs text-center">
              <label v-if="request.succeededAt.Valid" class="pill pill-active">Submitted</label>
              <label v-else-if="request.failedAt.Valid" class="pill pill-danger">Failed</label>
              <label v-else class="pill pill-inert">Pending</label>
            </td>
            <td class="text-xs text-center">
              <label v-if="request.error.Valid" class="pill pill-active">Yes</label>
              <label v-else class="pill pill-inert">No</label>
            </td>
            <td class="text-center text-xs">{{ convertDateTime(request.createdAt) }}</td>
            <td class="text-center">
              <div class="flex">
                <i class="fa-solid fa-eye p-1 border border-blue-200 bg-blue-100 text-blue-600 hover:bg-blue-300" @click="preview(request)"></i>
                <i class="fa-solid fa-code p-1 mx-1 border border-orange-200 bg-orange-100 text-orange-600 hover:bg-orange-300" @click="preview(request)"></i>
              </div>
            </td>
          </tr>
          </tbody>
          <tbody v-if="store.requests.length == 0">
          <tr class="body-tr px-5">
            <td class="text-xs text-center bg-gray-100" colspan="12">No outgoing requests found</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex">
      <div class="w-full">
        <div class="flex" v-if="limit == store.requests?.length || page > 1">
          <button v-if="page > 1" class="pagination-button" @click="previous"> <i class="fa-solid fa-arrow-left"></i></button>
          <button v-else class="pagination-button-inert" @click="next"><i class="fa-solid fa-arrow-left"></i></button>
          <div class="px-5 text-center my-auto">
            <label class="rounded text-white bg-primary-700 px-3 py-1">{{page}}</label>
          </div>
          <button v-if="limit == store.requests?.length" class="pagination-button" @click="next"><i class="fa-solid fa-arrow-right"></i></button>
          <button v-else class="pagination-button-inert" @click="next"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  </div>
  <AppModal v-model="previewModalOpen" xl6>
    <PayloadPreview :request="selectedRequest" @cancel="close"/>
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