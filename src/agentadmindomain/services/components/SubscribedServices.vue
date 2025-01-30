 
  <script setup lang="ts">
import type { Ref } from "vue";
import { ref, computed } from "vue";
import { useServicesStore } from "@/agentadmindomain/services/stores";
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(12);
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
  return store.subscribedServices?.slice(start, end); // Adjust according to your page & limit
});

function next() {
  page.value += 1;
  fetchSubscribedServices();
}

function previous() {
  page.value -= 1;
  fetchSubscribedServices();
}

// const { subscribedServices, unsubscribe, open } = useSubscribedServices();

const store = useServicesStore();

// const subscribedServices: Ref<any[]> = ref([]); // Will be passed as a prop
// const unsubscribe = (serviceId: string) => {
//   // Add unsubscribe logic or emit an event
// };

const unsubscribe = (serviceId: string) => {
  store.unsubscribeFromService(serviceId); // Calls the store action to update the state
};

const open = (service: any) => {
  // Add navigation logic to open service details
};
</script>
  
  
  <template>
  <!-- <div class="flex flex-col justify-between mt-3 text-left"> -->
  <div class="h-full flex flex-col">
    <div
      class="mt-3 mx-2 px-2 bg-white rounded-md flex items-center justify-between border border-gray-50 focus:ring-2 focus:ring-red-500"
    >
      <input
        type="text"
        placeholder="Search Subscribed Services"
        class="text-sm border-none outline-none bg-white"
      />
      <i class="fas fa-search py-2 cursor-pointer text-gray-500 text-lg"></i>
    </div>
    <hr class="mt-3 text-gray-100" />
    <!-- </div> -->

    <!-- Scrollable container for the list -->
    <div class="max-h-[70vh] overflow-y-auto mt-3 mx-2">
      <!-- <div
        v-for="(subscribedService, id) in store.subscribedServices"
        :key="id"
        class="list-none flex justify-between mx-3 py-2"
      > -->
      <div
        v-for="(subscribedService, id) in paginatedServices"
        :key="id"
        class="list-none flex justify-between mx-3 py-1"
      >
        <span
          class="hover:underline cursor-pointer font-semibold text-gray-700"
          @click="open(subscribedService)"
        >
          {{ subscribedService.name }}
        </span>

        <!-- Unsubscribe button -->
        <button
          class="text-xs rounded-md p-1 font-semibold text-black-600 bg-gray-100 border border-gray-200 hover:text-red-700 hover:bg-red-200 hover:border-red-300"
          @click="unsubscribe(subscribedService.id)"
        >
          <i class="fa-solid fa-times-square"></i>
          Unsubscribe
        </button>
      </div>
    </div>

    <div v-if="showPagination" class="flex text-xs mt-auto my-3">
      <!-- <div class="w-full border-t border-b border-gray-50"> -->
      <div class="w-full border-gray-50">
        <div class="flex gap-2 items-center mx-4">
          <!-- Previous Button -->
          <button
            class="px-0.5 py-0.5 text-red-600 rounded-md hover:bg-red-700 hover:text-white focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{ 'opacity-50 cursor-not-allowed': page <= 1 }"
            :disabled="page <= 1"
            @click="previous"
          >
            <i class="fa-solid fa-arrow-left"></i>
          </button>

          <!-- Current Page / Total Pages -->
          <div class="py-1">
            <span class="px-2 py-1 bg-primary rounded text-white">{{
              page
            }}</span>
            <label class="mx-1 text-gray-400">/</label>
            <span class="px-2 py-1 bg-primary-50 rounded text-primary-600">
              {{ totalPages }}
            </span>
          </div>
          <button
            class="px-0.5 py-0.5 text-red-600 rounded-md hover:bg-red-700 hover:text-white focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{
              'opacity-50 cursor-not-allowed':
                subscribedServices.length < limit,
            }"
            :disabled="subscribedServices.length < limit"
            @click="next"
          >
            <i class="fa-solid fa-arrow-right"></i>
          </button>

          <!-- Jump to Page -->
          <label>Page</label>
          <input
            type="number"
            placeholder="Page"
            class="form-element-lean bg-primary-50 font-bold text-center mx-0.5 w-6"
            v-model.number="pageInput"
            @change="jumpToPage"
          />

          <!-- Adjust Page Size -->
          <!-- <label>Page Size</label> -->
          <!-- <input
            type="number"
            placeholder="Page Size"
            class="form-element-lean bg-primary-50 font-bold text-center mx-1 w-6"
            v-model.number="limit"
            @change="changePageSize"
          /> -->

          <!-- Total Records -->
          <span
            class="my-auto mx-1 mt-1 bg-primary-50 px-1 py-0.5 rounded text-primary"
          >
            Total Services: {{ totalRecords }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
 