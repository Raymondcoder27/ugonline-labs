<script setup lang="ts">
import { ref, watch, reactive, onMounted, computed, type Ref } from "vue";
import { useDebounceFn } from "@vueuse/core";
import ServiceForm from "@/tilloperatordomain/services/components/ServiceForm.vue";
import AppModal from "@/components/AppModal.vue";
import { useServicesStore } from "@/tilloperatordomain/services/stores";
import { IGoFilter } from "@/types";
import { useBalance } from "@/tilloperatordomain/balance/stores";

const balanceStore = useBalance();

const store = useServicesStore();

const serviceFormModalOpen: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(8);
const loading: Ref<boolean> = ref(false);
const services: Ref<any[]> = ref([]);

function serviceForm(id: string) {
  // Logic to open the modal or start the process
  // console.log(`Assigning manager for branch: ${branch.name}`);
  // Example: modalOpen.value = true;
  serviceFormModalOpen.value = true;
}

const close = () => {
  serviceFormModalOpen.value = false;
};
watch(
  () => balanceStore.totalBalance,
  (newValue) => {
    console.log("Balance updated:", newValue);
  },
  { deep: true }
);

// filter
const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page: 0,
  sort: [
    {
      field: "firstname",
      order: "ASC",
    },
  ],
  filter: [
    {
      field: "firstname",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "username",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "phone",
      operand: "",
      operator: "CONTAINS",
    },
  ],
});

const updateFilter = useDebounceFn(
  () => {
    fetch();
  },
  300,
  { maxWait: 5000 }
);

// watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
);

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
  return store.services.slice(start, end); // Adjust according to your page & limit
});

// function fetchServices() {
//   filter.offset = (page.value - 1) * limit.value; // Update offset
//   filter.limit = limit.value;
//   filter.page = page.value; // Ensure pagination is aligned
//   store.fetchServices(filter); // Fetch services
// }

onMounted(() => {
  balanceStore.fetchTotalBalance();
  fetchServices();
});
</script>

<template>
  <!-- <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[0].operand"
    class="filter-element e-input ml-5 border border-black-700 rounded-md text-center" type="text" placeholder="Search Service" /> -->

  <!-- <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4"> -->

  <!-- <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[0].operand"
    class="filter-element e-input" type="text" placeholder="SEARCH SERVICE" /> -->

  <!-- <div v-for="service in services" :key="service.id" class="service p-4 bg-white shadow rounded hover:bg-gray-50 hover:cursor-pointer transition duration-300">
      <div class="flex justify-between items-center">
        <img :src="service.thumbnail" alt="Service Thumbnail" class="w-10 h-10 object-cover" />
        <i class="fa-solid fa-square-arrow-up-right text-lg text-gray-600"></i>
      </div>
      <hr class="my-2" />
      <p class="font-bold text-gray-700 my-1">{{ service.service }}</p>
      <table class="text-sm text-gray-600">
        <tbody>
          <tr>
            <td class="font-semibold">Provider:</td>
            <td class="px-2">{{ service.description }}</td>
          </tr>
        </tbody>
      </table>
    </div> -->

  <!-- Styled Search Bar -->
  <div
    class="flex px-4 py-3 shadow-md w-full justify-between items-center mb-6 bg-white"
  >
    <div
      class="w-1/3 bg-white rounded-full flex items-center justify-center border border-gray-50 px-4 focus:ring-2 focus:ring-red-500"
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

  <div class="flex justify-end items-center mt-2 mb-2">
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
        'opacity-50 cursor-not-allowed': store.services.length < limit,
      }"
      :disabled="store.services.length < limit"
      @click="next"
    >
      <i class="fa-solid fa-arrow-right text-md"></i>
    </button>
  </div>

  <!-- Service Cards Section -->
  <div class="grid grid-cols-4 gap-3 mt-3 p-5">
    <!-- <div
      v-for="service in store.services"
      :key="service.id"
      @click="serviceForm(service)"
      class="service service-active border border-gray-200 bg-white hover:shadow-lg rounded transform transition duration-300 ease-in-out hover:scale-105 hover:cursor-pointer hover:bg-white"
    > -->
    <div
      v-for="service in paginatedServices"
      :key="service.id"
      @click="serviceForm(service)"
      class="service service-active border border-gray-200 bg-white hover:shadow-lg rounded transform transition duration-300 ease-in-out hover:scale-105 hover:cursor-pointer hover:bg-white"
    >
      <div class="flex justify-between items-center">
        <img :src="service.thumbnail" alt="" class="w-7 h-7 object-cover" />
        <p class="font-bold text-xs text-gray-700">{{ service.providerName }}</p>
      </div>
      <hr class="my-2" />
      <p class="font-bold text-gray-700 my-1">{{ service.service }}</p>
      <table class="text-sm text-gray-600">
        <tbody>
          <tr>
            <td class="font-semibold">{{ service.description }}</td>
          </tr>
        </tbody>
      </table>
      <!-- <p class="font-bold text-xs text-gray-600 bg-gray-100 rounded-md w-1/3 text-center">PENDING</p> -->
    </div>
  </div>
  <!-- </div> -->
  <!-- </div> -->

  <AppModal v-model="serviceFormModalOpen" xl2>
    <ServiceForm @serviceSubmitted="close" @cancel="close" />
  </AppModal>
</template>

<style scoped>
.service {
  @apply bg-white p-4 rounded-lg transition duration-300;
}
</style>
