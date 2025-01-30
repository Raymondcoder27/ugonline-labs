<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, type Ref, ref, watch, computed } from "vue";
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
import ministryThumbnail from "@/assets/images/ministry.png";
import ursbThumbnail from "@/assets/images/ursb.png";

import { useBalance } from "@/tilloperatordomain/balance/stores";

const balanceStore = useBalance();

onMounted(() => {
  balanceStore.fetchTotalBalance();
  // fetchServices();
});

const store = useServicesStore();
const modalOpen: Ref<boolean> = ref(false);
const categoryModalOpen: Ref<boolean> = ref(false);
const specModalOpen: Ref<boolean> = ref(false);
const editModalOpen: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(10);
const loading: Ref<boolean> = ref(false);
const selectedService: Ref<string> = ref("");
let providerId = ref("");
let status = ref("");
const notify = useNotificationsStore();
const services: Ref<any[]> = ref([]);

function fetchServices() {
  loading.value = true;
  // Fetch the services based on the page and limit
  const startIndex = (page.value - 1) * limit.value;
  const endIndex = startIndex + limit.value;
  services.value = store.services.slice(startIndex, endIndex);
  loading.value = false;
}

// Go to the next page
function next() {
  page.value += 1;
  fetchServices();
}

// Go to the previous page
function previous() {
  page.value -= 1;
  fetchServices();
}

const paginatedServices = computed(() => {
  const start = (page.value - 1) * limit.value;
  const end = start + limit.value;
  return store.services?.slice(start, end); // Adjust according to your page & limit
});

// Computed property to map services to their providers
// const servicesWithProviders = computed(() => {
//   return store.services.map((service) => {
//     const provider = providerStore.providers.find(
//       (p) => p.id === service.providerId
//     );
//     return {
//       ...service,
//       providerLogo: provider?.displayLogo,
//       providerType: provider?.providerType,
//     };
//   });
// });

const servicesWithProviders = computed(() => {
  if (!store.services || !Array.isArray(store.services)) return []; // Ensure services is an array

  return store.services.map((service) => {
    const provider = providerStore.providers?.find(
      (p) => p.id === service.providerId
    );
    return {
      ...service,
      providerLogo: provider?.displayLogo || "", // Fallback for logo
      providerType: provider?.providerType || "Unknown", // Fallback for type
    };
  });
});

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
  <!-- Styled Search Bar -->
  <div
    class="flex px-4 py-3 shadow-md w-full justify-between items-center bg-white"
  >
    <!-- <div
      class="w-1/3 bg-white rounded-full flex items-center justify-center border border-gray-50 px-4 focus:ring-2 focus:ring-red-500"
    > -->
    <div
      class="w-1/3 bg-white rounded-md flex items-center justify-center border border-gray-50 px-4 focus:ring-2 focus:ring-red-500"
    >
      <input
        type="text"
        placeholder="Search by Service Name or Provider"
        class="w-full text-sm border-none outline-none bg-white"
      />
      <i class="fas fa-search p-2 cursor-pointer text-gray-500 text-lg"></i>

      <!-- <button
      class="ml-4 px-6 py-2 bg-red-700 text-white rounded-md text-sm hover:bg-primary-600 transition duration-300 ease-in-out"
      @click="search"
    >
      Search
    </button> -->
    </div>
    <div class="font-semibold text-gray-500 text-sm mr-5">
      <!-- BALANCE: 15,000,000/= -->
      {{ balanceStore.totalBalance.currentBalance.toLocaleString() }}/=
    </div>
  </div>
  <div class="rounded p-2">
    <div class="flex justify-end items-center">
      <!-- Previous Button -->
      <button
        class="text-md text-red-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{ 'opacity-50 cursor-not-allowed': page <= 1 }"
        :disabled="page <= 1"
        @click="previous"
      >
        <i class="fa-solid fa-arrow-left text-md"></i>
      </button>

      <!-- Page Number Display -->
      <span class="mx-4 text-lg font-semibold text-red-600">{{ page }}</span>

      <!-- Next Button -->
      <button
        class="mr-5 text-md text-red-600 focus:outline-none font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        :class="{
          'opacity-50 cursor-not-allowed': services?.length < limit,
        }"
        :disabled="services.length < limit"
        @click="next"
      >
        <i class="fa-solid fa-arrow-right text-md"></i>
      </button>
    </div>

    <!-- Service Cards Section -->
    <div class="grid grid-cols-4 gap-3 p-1">
      <!-- <div
      v-for="service in store.services"
      :key="service.id"
      @click="serviceForm(service)"
      class="service service-active border border-gray-200 bg-white hover:shadow-lg rounded transform transition duration-300 ease-in-out hover:scale-105 hover:cursor-pointer hover:bg-white"
    > -->
      <div
        v-for="service in servicesWithProviders"
        :key="service.id"
        @click="open(service)"
        class="service service-active border p-2 bg-white hover:shadow-lg rounded transform transition duration-300 ease-in-out hover:scale-105 hover:cursor-pointer hover:bg-white"
      >
        <div class="flex justify-between items-center">
          <!-- <img :src="service.thumbnail" alt="" class="w-7 h-7 object-cover" /> -->
          <img
            v-if="service.providerLogo"
            :src="service.providerLogo"
            class="avi rounded-full"
            alt="thumb"
          />
          <!-- <img v-else-if="service.providerType == 'GOVERNMENT'" class="avi rounded-full" :src="coa"/> -->
          <img
            v-else-if="
              service.providerName === 'Uganda Registration Services Bureau'
            "
            :src="ursbThumbnail"
          />
          <!-- <i v-else class="fa-solid fa-bank rounded-full w-6 h-6 cursor-pointer border border-blue-300"></i> -->
          <img
            v-else
            class="fa-solid fa-bank rounded-full w-6 h-6 cursor-pointer border"
            :src="ministryThumbnail"
          />
          <p class="font-bold text-xs text-gray-700">
            {{ service.providerName }}
          </p>

          <!-- <p class="font-bold text-xs text-gray-700">{{ service.providerName }}</p> -->
        </div>
        <hr class="my-2" />
        <p class="font-bold text-xs text-gray-700">{{ service.name }}</p>
        <p class="font-bold text-gray-700 my-1">{{ service.service }}</p>
        <p class="font-semibold text-xs">
          {{ service.description }}
        </p>
        <!-- <table class="text-sm text-gray-600">
          <tbody>
            <tr>
              <td class="font-semibold">{{ service.description }}</td>
            </tr>
          </tbody>
        </table> -->
        <!-- <p class="font-bold text-xs text-gray-600 bg-gray-100 rounded-md w-1/3 text-center">PENDING</p> -->
      </div>
    </div>

    <!-- <div class="flex">
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
            <option v-for="(provider, idx) in providerStore.providers" :key="idx" :value="provider.id">{{provider.name}}</option>
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
              <TableLoader v-if="loading"/>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="body-tr"
            v-for="(service, idx) in paginatedServices"
            :key="idx"
          >
            <td width="10px">{{ idx + 1 }}.</td>
            <td>
              <label class=" cursor-pointer font-bold hover:text-primary-700 mx-2" >
                <span class="hover:underline" @click="open(service)">
                  {{ service.name }}
                </span>
                <i class="fa-solid fa-link p-1 mx-1 text-gray-600 bg-gray-50 hover:text-primary-700"  @click="tag(service)"></i>
              </label>
            </td>
            <td>
              <label>{{ service.providerName}}</label>
            </td>
            <td>
              <label>{{ service.accessibilityTier}}</label>
            </td>
            <td class="text-center">
              <i
                :class="
                  service.currentVersionId
                    ? 'text-green-600 fa-solid fa-check'
                    : 'text-red-600 fa-solid fa-times'"
              ></i>
            </td>
            <td class="text-center">
              <span>{{service.status}}</span>
            </td>
            <td class="text-center">
              <span class="text-xs">{{ convertDateTime(service.createdAt.Time) }}</span>
            </td>
            <td class="text-center">
              <i class="fa-solid fa-eye p-1 mx-1 text-blue-600 bg-blue-100 border border-blue-200  hover:text-blue-700"  @click="open(service)"></i>
              <i class="fa-solid fa-pen p-1 mx-1 text-green-600 bg-green-100 border border-green-200 hover:text-green-700"  @click="edit(service)"></i>
              <i class="fa-solid fa-sliders p-1 mx-1 text-primary-700 bg-primary-100 border border-primary-300 hover:text-primary-900"  @click="spec(service)"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->
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
