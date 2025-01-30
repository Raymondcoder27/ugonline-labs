<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, type Ref, ref, watch } from "vue";
import CreateService from "@/tilloperatordomain/apiservices/components/CreateService.vue";
import { useServicesStore } from "@/tilloperatordomain/apiservices/stores";
import type { Service } from "@/tilloperatordomain/apiservices/types";
import EditService from "@/tilloperatordomain/apiservices/components/EditService.vue";
import ServiceSpecificationDetails from "@/tilloperatordomain/apiservices/views/ServiceSpecificationDetails.vue";
import moment from "moment/moment";
import router from "@/router";
import { useProviderStore } from "@/tilloperatordomain/providers/stores";
import CategorySelector from "@/tilloperatordomain/settings/components/CategorySelector.vue";
import { useNotificationsStore } from "@/stores/notifications";
import type { ApiError } from "@/types";
import TableLoader from "@/components/TableLoader.vue";

const store = useServicesStore();
const modalOpen: Ref<boolean> = ref(false);
const categoryModalOpen: Ref<boolean> = ref(false);
const specModalOpen: Ref<boolean> = ref(false);
const editModalOpen: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(16);
const loading: Ref<boolean> = ref(false);
const selectedService: Ref<string> = ref("");
let providerId = ref("");
let status = ref("");
const notify = useNotificationsStore();

const providerStore = useProviderStore();
onMounted(() => {
  loading.value = true;
  store
    .fetchServices(page.value, limit.value)
    .then(() => (loading.value = false))
    .catch((error: ApiError) => {
      loading.value = false;
      notify.error(error.response.data.message);
    });
  if (providerStore.providers == undefined) {
    providerStore
      .fetchProviders(1, 35)
      .then(() => (loading.value = false))
      .catch(() => {
        loading.value = false;
      });
  }
});

function edit(service: Service) {
  localStorage.setItem("service", JSON.stringify(service));
  editModalOpen.value = true;
}

function spec(service: Service) {
  selectedService.value = service.id;
  localStorage.clear();
  localStorage.setItem("service", JSON.stringify(service));
  specModalOpen.value = true;
}

function open(service: Service) {
  router.push({ name: "api-service-details", params: { id: service.id } });
}

function tag(service: Service) {
  selectedService.value = service.id;
  categoryModalOpen.value = true;
}

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

function close() {
  modalOpen.value = false;
  editModalOpen.value = false;
  specModalOpen.value = false;
}

watch(
  () => providerId.value,
  (id: any) => {
    console.log(id);
  },
  { deep: true }
);

// watch state of the modal
watch(
  () => modalOpen.value,
  (isOpen: boolean) => {
    if (!isOpen) {
      // do something if that's something you're interested in
    }
  }
);
</script>

<template>
  
  <div class="min-h-[50vh] shadow-lg bg-white rounded p-2">
    
    <div class="flex">
      <div class="w-full py-1">
        <i
          class="bg-primary-700 border border-primary-800 text-white p-2 rounded-full fa-solid fa-list"
        ></i>
        <label class="text-lg mx-1">Services Registry</label>
      </div>
    </div>
    <div class="flex space-x-2 my-1">
      <div class="flex-grow">
        <div class="flex bg-gray-10 border border-gray-200 rounded px-2 py-3">
          <input
            class="filter-element e-input w-4/12"
            type="text"
            placeholder="Search by Name"
          />
          <select class="filter-element w-2/12 e-select" v-model="providerId">
            <option :value="null">- Select Provider -</option>
            <option
              v-for="(provider, idx) in providerStore.providers"
              :key="idx"
              :value="provider.id"
            >
              {{ provider.name }}
            </option>
          </select>
          <select class="filter-element w-2/12 e-select" v-model="status">
            <option :value="null">- Select Status -</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div class="flex">
        <button
          @click="modalOpen = true"
          class="button btn-sm my-auto"
          type="button"
        >
          <i class="px-1 fa-solid fa-plus"></i> Add Service
        </button>
      </div>
    </div>
    <div class="flex my-1">
      <table class="table">
        <thead>
          <tr class="header-tr">
            <th class="t-header">#</th>
            <th class="t-header">Name</th>
            <th class="t-header">Provider</th>
            <th class="text-center">Access Tier</th>
            <th class="text-center">Availability</th>
            <th class="text-center">Status</th>
            <th class="text-center">Date</th>
            <th class="t-header"></th>
          </tr>
          <tr>
            <th colspan="12">
              <TableLoader v-if="loading" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="body-tr"
            v-for="(service, idx) in store.services"
            :key="idx"
          >
            <td width="10px">{{ idx + 1 }}.</td>
            <td>
              <label
                class="cursor-pointer font-bold hover:text-primary-700 mx-2"
              >
                <span class="hover:underline" @click="open(service)">
                  {{ service.name }}
                </span>
                <i
                  class="fa-solid fa-link p-1 mx-1 text-gray-600 bg-gray-50 hover:text-primary-700"
                  @click="tag(service)"
                ></i>
              </label>
            </td>
            <td>
              <label>{{ service.providerName }}</label>
            </td>
            <td>
              <label>{{ service.accessibilityTier }}</label>
            </td>
            <td class="text-center">
              <i
                :class="
                  service.currentVersionId
                    ? 'text-green-600 fa-solid fa-check'
                    : 'text-red-600 fa-solid fa-times'
                "
              ></i>
            </td>
            <td class="text-center">
              <span>{{ service.status }}</span>
            </td>
            <!-- <td class="text-center">
              <span class="text-xs">{{ convertDateTime(service.createdAt.Time) }}</span>
            </td> -->
            <td class="text-center">
              <i
                class="fa-solid fa-eye p-1 mx-1 text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700"
                @click="open(service)"
              ></i>
              <i
                class="fa-solid fa-pen p-1 mx-1 text-green-600 bg-green-100 border border-green-200 hover:text-green-700"
                @click="edit(service)"
              ></i>
              <i
                class="fa-solid fa-sliders p-1 mx-1 text-primary-700 bg-primary-100 border border-primary-300 hover:text-primary-900"
                @click="spec(service)"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal -->
  <AppModal v-model="modalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <CreateService @cancel="close" />
    <!-- That's also okay -->
  </AppModal>

  <AppModal v-model="categoryModalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <CategorySelector :service-id="selectedService" @cancel="close" />
    <!-- That's also okay -->
  </AppModal>

  <AppModal v-model="specModalOpen" xl6>
    <!-- Put here whatever makes you smile -->
    <ServiceSpecificationDetails :id="selectedService" />
    <!-- That's also okay -->
  </AppModal>

  <AppModal v-model="editModalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <EditService @cancel="close" />
    <!-- That's also okay -->
  </AppModal>
  <!-- /Modal -->
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
