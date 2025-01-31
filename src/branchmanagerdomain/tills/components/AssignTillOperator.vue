<script setup lang="ts">
import { onMounted, reactive, ref, computed, defineProps, type Ref } from "vue";
import { useTillStore } from "@/branchmanagerdomain/tills/stores";
import { useNotificationsStore } from "@/stores/notifications";
import type { ApiError } from "@/types";
import { defineEmits } from "vue";
import { useAccounts } from "@/branchmanagerdomain/accounts/stores";

const tillStore = useTillStore();
const store = useAccounts();
const loading: Ref<boolean> = ref(false);
const notify = useNotificationsStore();



const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(4);
// const selectedBackOfficeAccount: Ref<string> = ref("");
const backofficeAccounts: Ref<any[]> = ref([]);
const totalRecords = computed(() => store.backofficeAccounts.length); // Total backofficeAccounts
const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value));
const pageInput = ref(1);
const changePageSize = () => {
  page.value = 1;
  fetchBackofficeAccounts();
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
  fetchBackofficeAccounts();
};
function fetchBackofficeAccounts() {
  // store
  //   .fetchBackofficeAccounts(page.value, limit.value)
  //   .then(() => (loading.value = false))
  //   .catch((error: ApiError) => {
  //     loading.value = false;
  //     notify.error(error.response.data.message);
  //   });

  loading.value = true;
  // Fetch the services based on the page and limit
  const startIndex = (page.value - 1) * limit.value;
  const endIndex = startIndex + limit.value;
  backofficeAccounts.value = store.backofficeAccounts.slice(
    startIndex,
    endIndex
  );
  loading.value = false;
}
const paginatedBackofficeAccounts = computed(() => {
  const start = (page.value - 1) * limit.value;
  const end = start + limit.value;
  return store.backofficeAccounts.slice(start, end); // Adjust according to your page & limit
});
// type BranchForm = {
//   branchId: string;
//   name: string;
// };

// Define props
const { tillId } = defineProps({
  tillId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["cancel", "operatorAssigned"]);

onMounted(() => {
  loading.value = true;
  store.fetchBackofficeAccounts();
  tillStore.fetchTills().finally(() => (loading.value = false));
});

function submit(userId: string) {
  let payload = {
    // userId: form.userId,
    userId: userId,
    tillId: tillId,
  };
  loading.value = true;
  store.assignOperator(payload.userId, payload.tillId);
  // store.assignManager(userId);
  // notify.success(`User successfully ${payload.userId} assigned to branch`);
  notify.success(`User successfully assigned to branch`);
  emit("operatorAssigned");
  loading.value = false;
}

// Search and filter functionality
const searchQuery = ref("");
const filteredManagers = computed(() => {
  if (!searchQuery.value.trim()) {
    return tillStore.operators; // Assuming managers are loaded into tillStore
  }
  return tillStore.operators.filter((manager) =>
    `${manager.firstName} ${manager.lastName}`
      .toLowerCase()
      .includes(searchQuery.value.trim().toLowerCase())
  );
});
</script>

<template>
  <!-- <div class="bg-white py-5">
    <p class="text-xl font-bold">Assign Manager</p>
    <p class="text-sm text-gray-500">
        The individual responsible for overseeing branch operations, managing staff, and ensuring smooth service delivery to agents and the public.
    </p>

    <form @submit.prevent="submit" class="pt-5">
        <select
          v-model="form.managerId"
          class="noFocus form-element e-input w-full"
        >
          <option :value="null">-- Select Manager --</option>
          <option
            v-for="(account, idx) in store.backofficeAccounts"
            :key="idx"
            :value="account.managerId"
          >
            {{ account.firstName }} {{ account.lastName }}
          </option>
        </select>
        <div class="flex my-2 py-5">
        <div class="w-6/12 px-1">
          <button class="button-outline" type="button" @click="emit('cancel')">
            <i class="fa-solid fa-ban"></i> Cancel
          </button>
        </div>
        <div class="w-6/12 px-1">
          <button class="button" type="submit">
            <i class="fa-solid fa-hand-pointer"></i> Submit
          </button>
        </div>
      </div>
    </form>
  </div> -->

  <div class="bg-white p-6 rounded-lg">
    <p class="text-xl font-bold mb-2">Assign Manager</p>
    <p class="text-sm text-gray-500 mb-4">
      Select a till operators from the table to assign them to a branch.
    </p>

    <!-- Search Box -->
    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        placeholder="Search managers by name..."
      />
    </div>

    <!-- Manager Table -->
    <div class="overflow-x-auto my-1">
      <table
        class="table min-w-full bg-white border border-gray-200 rounded-lg"
      >
        <thead>
          <tr class="header-tr border-b">
            <th class="px-4 py-2 text-left text-sm font-medium">Name</th>
            <th class="px-4 py-2 text-left text-sm font-medium">Email</th>
            <th class="px-4 py-2 text-left text-sm font-medium">Phone</th>
            <th class="px-4 py-2 text-center text-sm font-medium"></th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading Indicator -->
          <tr v-if="loading">
            <td colspan="4" class="px-4 py-4 text-center">
              <div class="animate-pulse bg-blue-300 h-4 w-full rounded"></div>
            </td>
          </tr>

          <!-- Managers List -->
          <!-- <tr
            v-for="manager in filteredManagers"
            :key="manager.id"
            class="border-b hover:bg-gray-50"
          > -->
          <!-- <tr
            v-for="manager in store.backofficeAccounts"
            :key="manager.id"
            class="text-xs body-tr border-b"
          > -->
          <!-- <tr
            v-for="user in store.backofficeAccounts"
            :key="user.id"
            class="text-xs body-tr border-b"
          > -->
          <tr
            v-for="user in paginatedBackofficeAccounts"
            :key="user.id"
            class="text-xs body-tr border-b"
          >
            <td class="px-4 py-2">{{ user.firstName }} {{ user.lastName }}</td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">{{ user.phone }}</td>
            <td class="px-4 py-2 text-center">
              <button
                @click="submit(user.id)"
                :disabled="loading"
                class="px-1 py-0.5 flex bg-red-700 text-white rounded-md hover:underline"
              >
                <i class="px-1 py-0.5 fa fa-user-plus"></i>
                Assign
              </button>
            </td>
          </tr>

          <!-- No Results Found -->
          <!-- <tr v-if="!filteredManagers.length && !loading">
            <td colspan="4" class="px-4 py-4 text-center text-gray-500">
              No managers found
            </td>
          </tr> -->
        </tbody>
      </table>
    </div>


    <div v-if="showPagination" class="flex text-xs mt-auto">
      <div class="w-full border-t border-b border-gray-50">
        <div class="flex gap-2 items-center">
          <!-- Previous Button -->
          <button
            class="px-1 py-0.5 text-red-600 rounded-md hover:bg-red-700 hover:text-white focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
            class="px-1 py-0.5 text-red-600 rounded-md hover:bg-red-700 hover:text-white focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{
              'opacity-50 cursor-not-allowed':
                backofficeAccounts.length < limit,
            }"
            :disabled="backofficeAccounts.length < limit"
            @click="next"
          >
            <i class="fa-solid fa-arrow-right"></i>
          </button>

          <!-- Jump to Page -->
          <label>Page</label>
          <input
            type="number"
            placeholder="Page"
            class="form-element-lean bg-primary-50 font-bold text-center mx-1 w-12"
            v-model.number="pageInput"
            @change="jumpToPage"
          />

          <!-- Adjust Page Size -->
          <label>Page Size</label>
          <input
            type="number"
            placeholder="Page Size"
            class="form-element-lean bg-primary-50 font-bold text-center mx-1 w-12"
            v-model.number="limit"
            @change="changePageSize"
          />

          <!-- Total Records -->
          <span
            class="my-auto mx-2 bg-primary-50 px-3 py-1 rounded text-primary"
          >
            Total Records: {{ totalRecords }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/forms.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";

.cell {
  @apply w-6/12 px-1 my-2;
}

.cell-full {
  @apply w-full px-1 my-2;
}
</style>
@/branchmanagerdomain/tills/stores@/branchmanager/tills/stores@/branchmanager/accounts/stores