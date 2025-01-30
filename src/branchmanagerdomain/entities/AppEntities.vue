<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { useProviderStore } from "@/branchmanagerdomain/entities/stores";
import {onMounted, type Ref, ref, watch} from "vue";
import CreateServiceProvider from "@/branchmanagerdomain/entities/views/CreateServiceProvider.vue";
import moment from "moment";
import coa from "@/assets/images/coa_gs.png"
import EditServiceProvider from "@/branchmanagerdomain/entities/views/EditServiceProvider.vue";
import type {ServiceProvider} from "@/branchmanagerdomain/entities/types";
import router from "@/router";
import {useCommonsStore} from "@/stores/commons";
import type {ApiError} from "@/types";
import TableLoader from "@/components/TableLoader.vue";


const store = useProviderStore();
const commons = useCommonsStore();
const modalOpen: Ref<boolean> = ref(false);
const viewModalOpen: Ref<boolean> = ref(false);
const editModalOpen: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(16);
const loading: Ref<boolean> = ref(false)
function open(provider:ServiceProvider) {
  router.push({name:"provider-details", params:{id:provider.id}})
}

function edit(provider:ServiceProvider) {
  localStorage.setItem("provider", JSON.stringify(provider))
  editModalOpen.value = true;
}
function close() {
  modalOpen.value = false;
  viewModalOpen.value = false;
  editModalOpen.value = false;
}

onMounted(() => {
  fetch()
})

function fetch(){
  loading.value = true
  store.fetchProviders(page.value, limit.value)
      .then(() => (loading.value = false))
      .catch((error:ApiError) => {
        loading.value = false
        alert(JSON.stringify(error.response.data.message))
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
function convertDate(date:string){
  return moment(date).format("DD-MM-YYYY")
}

// watch state of the modal
watch(
  () => modalOpen.value,
  (isOpen: boolean) => {
    if (!isOpen) {
      // do something if that's something you're interested in
    }
  },
);
</script>

<template>
  <div class="w-full shadow-lg bg-white rounded p-2">
    <div class="flex">
      <div class="w-full py-1 text-primary-700 ">
        <i class="bg-primary-100 border border-primary-200 p-2 rounded-full fa-solid fa-bank"></i>
        <label class="text-lg mx-1">Entities</label>
      </div>
    </div>
    <div class="flex justify-between my-1">
      <div class="flex flex-col">
        <div class="grid grid-cols-5">
          <input class="filter-element e-input" type="text" placeholder="Search by Name" />
          <select class="filter-element e-select">
            <option value="">- Select Type -</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
          </select>
          <select class="filter-element e-select">
            <option :value="null">- Select Status -</option>
            <option value="true">Online</option>
            <option value="false">Offline</option>
          </select>
        </div>
      </div>
      <div class="flex">
        <button @click="modalOpen = true" class="button btn-sm my-auto" type="button">
          <i class="px-1 fa-solid fa-plus"></i> Add Provider
        </button>
      </div>
    </div>
    <div class="flex my-1">
      <div class="w-full">
        <div class="flex">
          <div class="w-full">
            <table class="table">
              <thead>
              <tr class="header-tr">
                <!-- <th class="t-header">#</th> -->
                <th class="t-header">Name</th>
                <th class="t-header">Display Name</th>
                <th class="t-header">Type</th>
                <th class="t-header">Email</th>
                <th class="t-header">Phone</th>
                <th class="t-header">Address</th>
                <th class="text-center">Status</th>
                <th class="text-center">Date</th>
                <th class="t-header"></th>
              </tr>
              </thead>
              <thead v-if="loading">
                <tr>
                  <th colspan="12" style="padding: 0">
                    <div class="w-full bg-primary-300 h-1 p-0 m-0 animate-pulse"></div>
                  </th>
                </tr>
              </thead>
              <tbody v-if="store.providers">
              <tr class="body-tr" v-for="(provider, idx) in store.providers" :key="idx">
                <!-- <td width="10px">{{ idx + 1 }}.</td> -->
                <td>
                  <div class="flex">
                    <img v-if="provider.displayLogo" :src="provider.displayLogo" class="avi rounded-full" alt="thumb" />
                    <img v-else-if="provider.providerType == 'GOVERNMENT'" class="avi rounded-full" :src="coa"/>
                    <i v-else class="fa-solid fa-bank rounded-full w-6 h-6 cursor-pointer border border-blue-300"></i>
                    <label class="font-bold hover:text-primary-700 mx-2" @click="open(provider)">
                      {{ provider.name }}
                    </label>
                  </div>
                </td>
                <td>
                  <span class="text-primary-900 font-bold">{{provider.displayName }}</span>
                </td>
                <td>
                  <span class="uppercase">{{provider.providerType }}</span>
                </td>
                <td>
                  <p class="text-xs">
                    {{ provider.inquiryEmail }}
                  </p>
                </td>
                <td>
                  <p class="text-xs">
                    {{ provider.inquiryPhoneNumber }}
                  </p>
                </td>
                <td>
                  <span class="text-xs">{{provider.physicalAddress }}</span>
                </td>
                <td class="text-center">
                  <span :class="commons.activityStatusStyling(provider.activityStatus)">{{provider.activityStatus}}</span>
                </td>
                <td class="text-center">{{ convertDate(provider.createdAt) }}</td>
                <td class="text-center">
                  <div class="flex">
                    <i class="fa-solid fa-eye px-1 text-gray-600 hover:text-primary-700" @click="open(provider)"></i>
                    <i class="fa-solid fa-pen px-1 text-gray-600 hover:text-primary-700" @click="edit(provider)"></i>
                  </div>
                </td>
              </tr>
              </tbody>
              <tbody v-if="!store.providers">
              <tr>
                <td class="bg-gray-50 text-center" colspan="12">
                  <p>No providers found</p>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="flex">
          <div class="w-full">
            <div class="flex" v-if="limit == store.providers?.length || page > 1">
              <button v-if="page > 1" class="pagination-button" @click="previous"> <i class="fa-solid fa-arrow-left"></i></button>
              <button v-else class="pagination-button-inert" @click="next"><i class="fa-solid fa-arrow-left"></i></button>
              <div class="w-1/12 text-center my-auto">
                <label class="rounded text-white bg-primary-700 px-3 py-1">{{page}}</label>
              </div>
              <button v-if="limit == store.providers?.length" class="pagination-button" @click="next"><i class="fa-solid fa-arrow-right"></i></button>
              <button v-else class="pagination-button-inert" @click="next"><i class="fa-solid fa-arrow-right"></i></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <AppModal v-model="modalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <CreateServiceProvider @cancel="close"/>
    <!-- That's also okay -->
  </AppModal>

  <AppModal v-model="editModalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <EditServiceProvider @cancel="close"/>
    <!-- That's also okay -->
  </AppModal>
  <!-- /Modal -->
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";

/* HTML: <div class="loader"></div> */
.loader {
  padding: 0;
  width: 100%;
  height: 5px;
  background: #6c8004;
  animation: l2 2s linear infinite;
}

.provider-thumbnail-no-thumb{
  width: 25px;
  height: 25px;
  @apply text-center rounded-full my-auto;
}

@keyframes l2 {to{background-size: 100% 3px}}
</style>
@/branchmanager/entities/stores@/branchmanager/entities/types