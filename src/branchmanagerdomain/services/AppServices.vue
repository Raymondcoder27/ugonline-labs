<script setup lang="ts">
import { useServicesStore } from "@/branchmanagerdomain/services/stores";
import ServiceCards from "@/branchmanagerdomain/services/components/ServiceCards.vue";
import SubscribedServices from "@/branchmanagerdomain/services/components/SubscribedServices.vue";
import { onMounted, ref, type Ref, watch, computed } from "vue";

const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(9);
const subscribedServices: Ref<any[]> = ref([]);
const totalRecords = computed(() => store.subscribedServices.length); // Total subscribedServices
const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value));
const pageInput = ref(1);
const changePageSize = () => {
  page.value = 1;
  fetchSubscribedServices();
};
const showPagination = computed(() => totalRecords.value >= limit.value);

const jumpToPage = () => {
  if (pageInput.value > totalPages.value) {
    page.value = totalPages.value;
  } else if (pageInput.value < 1) {
    page.value = 1;
  } else {
    page.value = pageInput.value;
  }
  fetchSubscribedServices();
};

const paginatedServices = computed(() => {
  const start = (page.value - 1) * limit.value;
  const end = start + limit.value;
  return store.subscribedServices.slice(start, end); // Adjust according to your page & limit
});

function next() {
  page.value += 1;
  fetchSubscribedServices();
}

function previous() {
  page.value -= 1;
  fetchSubscribedServices();
}

const store = useServicesStore();

const subscribe = (serviceId: string) => {
  // Subscription logic here
};

const unsubscribeFromService = (serviceId: string) => {
  // Unsubscription logic here
};

const open = (service: any) => {
  // Navigation logic here
};
</script>


<template>
  <div class="flex">
    <div class="block w-2/3 h-[80vh]">
      <!-- Service Cards Area -->
      <ServiceCards :services="store.services" @subscribe="subscribe" />
    </div>

    <div
      class="w-1/3 ml-3 bg-white text-xs rounded-md text-center mb-2 h-[84.5vh] flex flex-col"
    >
      <!-- Subscribed Services Area -->
      <SubscribedServices
        :subscribedServices="store.subscribedServices"
        @unsubscribe="unsubscribeFromService"
        @open="open"
      />
      <!-- <SubscribedServices
        :subscribedServices="paginatedServices"
        @unsubscribe="unsubscribeFromService"
        @open="open"
      /> -->

    </div>
  </div>
</template>

@/branchmanager/services/stores