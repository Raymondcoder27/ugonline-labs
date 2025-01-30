<script setup lang="ts">
import type { Ref } from "vue";
import { ref, onMounted } from "vue";
import { useServicesStore } from "@/agentadmindomain/services/stores";
import { useNotificationsStore } from "@/stores/notifications";

const store = useServicesStore();
const notify = useNotificationsStore();

const page: Ref<number> = ref(1); // Current page
const limit: Ref<number> = ref(8); // Limit per page (8 services per page)
const loading: Ref<boolean> = ref(false);
const services: Ref<any[]> = ref([]); // Will hold the paginated services

// Fetches the services for the current page
function fetch() {
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
  fetch();
}

// Go to the previous page
function previous() {
  page.value -= 1;
  fetch();
}

const subscribe = (serviceId: string) => {
  store.subscribeToService(serviceId); // Calls the store action to update the state
};

onMounted(() => {
  store.fetchServices(); // Fetch services from the store
  fetch(); // Fetch the initial page of services
});
</script>

<template>
  <div class="flex px-4 py-3 bg-white shadow-md rounded-lg justify-between items-center mb-1">
    <div class="w-[50vw] bg-white rounded-md flex items-center justify-center border border-gray-50 px-4 focus:ring-2 focus:ring-red-500">
      <input
        type="text"
        placeholder="Search Services provided by Ministries, Departments and Agencies"
        class="w-full text-sm border-none outline-none bg-white"
      />
      <i class="fas fa-search p-2 cursor-pointer text-gray-500 text-lg"></i>
    </div>
  </div>

  <!-- <hr class="mt-2 text-gray-100" /> -->

  <!-- Pagination Controls -->
  <div class="flex justify-end items-center mb-1">
    <!-- Previous Button -->
    <button
      class="px-1 py-0.5 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
      :class="{ 'opacity-50 cursor-not-allowed': page <= 1 }"
      :disabled="page <= 1"
      @click="previous"
    >
      <i class="fa-solid fa-arrow-left"></i>
    </button>

    <!-- Page Number Display -->
    <span class="mx-4 text-lg font-semibold text-gray-700">{{ page }}</span>

    <!-- Next Button -->
    <button
      class="px-1 py-0.5 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
      :class="{
        'opacity-50 cursor-not-allowed': services.length < limit
      }"
      :disabled="services.length < limit"
      @click="next"
    >
      <i class="fa-solid fa-arrow-right"></i>
    </button>
  </div>

  <!-- Service Cards -->
  <div class="grid grid-cols-4 gap-3">
    <div
      v-for="service in services"
      :key="service.id"
      class="service service-active p-4 bg-white shadow rounded transform transition duration-300 ease-in-out hover:scale-105 flex flex-col justify-between"
    >
      <!-- Top Section -->
      <div>
        <div class="flex justify-between items-center">
          <img :src="service.thumbnail" alt="" class="w-10 h-10 object-cover" />
        </div>
        <hr class="my-2" />
        <div class="text-bold text-sm font-bold" v-if="service">
          {{ service.name }}
        </div>
        <div v-else>
          <p>Service not found.</p>
        </div>
        <div class="h-15 overflow-hidden">
          <span class="text-xs text-gray-800">
            {{ service.description }}
          </span>
        </div>
      </div>

      <!-- Bottom Section -->
      <div class="mt-4">
        <p
          class="font-bold text-xs w-full text-white bg-red-700 p-1 rounded-md text-center cursor-pointer hover:scale-105 hover:bg-red-800"
          @click="subscribe(service.id)"
        >
          <i class="fa fa-check-square"></i>
          Subscribe
        </p>
      </div>
    </div>
  </div>
</template>
