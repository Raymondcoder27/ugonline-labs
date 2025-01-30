<script setup lang="ts">
import { ref, watch, reactive } from "vue";
import { useDebounceFn } from "@vueuse/core";

interface Service {
  id: number;
  service: string;
  description: string;
  // name: string;
  // thumbnail: string;
  // email: string;
  // phone: string;
  // address: string;
}

// services

const services = ref<Service[]>([
  {
    id: 1,
    service: "Post Office Account",
    description: "Open a Post Office Account",
    // name: 'Posta Uganda',
    // thumbnail: '/assets/coa-19c4edfc.png',
    // email: 'info@ugapost.co.ug',
    // phone: '+256784944479',
    // address: 'Plot 35 Kampala Road, Kampala',
  },
  {
    id: 2,
    service: "Agricultural Research",
    description: "Get agricultural research services",
    // name: 'National Agricultural Research Organization',
    // thumbnail: '/assets/coa-19c4edfc.png',
    // email: 'info@naro.go.ug',
    // phone: '+256-41-320512',
    // address: 'Plot 11-13, Lugard Avenue, Entebbe',
  },
  {
    id: 3,
    service: "National ID Registration",
    description: "Register for a National ID",
    // name: 'National Identification & Registration Authority',
    // thumbnail: '/assets/coa-19c4edfc.png',
    // email: 'info@nira.com',
    // phone: '0800211700',
    // address: 'National Independence Grounds, Kololo Airstrip',
  },
  {
    id: 4,
    service: "Land Title Registration",
    description: "Register a land title",
    // name: 'Ministry of Lands and Urban Development',
    // thumbnail: '/assets/coa-19c4edfc.png',
    // email: 'info@mlhud.go.ug',
    // phone: '0414355355',
    // address: 'Dewinton Road',
  },
  {
    id: 5,
    service: "Company Name Reservation",
    description: "Reserve a company name",
    // name: 'URSB',
    // thumbnail: '/assets/coa-19c4edfc.png',
    // email: 'ursb@ursb.go.ug',
    // phone: '0312211211',
    // address: 'Plot 1 Baskerville Avenue',
  },
  {
    id: 9,
    service: "Passport Application",
    description: "Apply for a passport",
    // name: 'Ministry of Internal Affairs',
    // thumbnail: '/assets/coa-19c4edfc.png',
    // email: 'info@moia.go.ug',
    // phone: '0312123123',
    // address: '',
  },
]);

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

    <!-- <div class="block"> -->
  <!-- Styled Search Bar -->
  <div class="flex px-4 py-3 shadow-md w-full justify-between items-center mb-6 bg-white">
   <div class="w-1/3 bg-white rounded-full flex items-center justify-center  border border-gray-50 px-4 focus:ring-2 focus:ring-red-500 ">
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
   <div class="font-semibold text-gray-500 text-sm">BALANCE: 16,000,000/=</div>
  </div>

  <!-- Service Cards Section -->
  <div class="grid grid-cols-4 gap-3 mt-3">
    <div
      v-for="service in services"
      :key="service.id"
      @click="serviceModal(service)"
      class="service service-active border border-gray-200 bg-white hover:shadow rounded transform transition duration-300 ease-in-out hover:scale-105 hover:cursor-pointer hover:bg-white"
    >
      <div class="flex justify-between items-center">
        <img :src="service.thumbnail" alt="" class="w-10 h-10 object-cover">
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
</template>

<style scoped>
.service {
  @apply bg-white p-4 rounded-lg transition duration-300;
}
</style>
