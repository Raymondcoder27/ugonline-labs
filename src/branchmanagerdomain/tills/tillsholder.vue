<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, ref, type Ref, watch, computed } from "vue";
import CreateBranch from "@/branchmanagerdomain/branches/components/CreateBranch.vue";
import { useBranchStore } from "@/branchmanagerdomain/tills/stores"; // Updated import
import type { Branch } from "@/branchmanagerdomain/branches/types"; // Assuming you have a Branch type
import moment from "moment/moment";
import router from "@/router";
import { useProviderStore } from "@/branchmanagerdomain/entities/stores";
import AssignBranchManager from "@/branchmanagerdomain/branches/components/AssignBranchManager.vue";
// import CategorySelector from "@/branchmanagerdomain/settings/components/CategorySelector.vue";
import { useNotificationsStore } from "@/stores/notifications";
import type { ApiError } from "@/types";
import { useAccountStore } from "../auth/stores";
// import TableLoader from "@/components/TableLoader.vue";

import { useAccounts } from "@/branchmanagerdomain/accounts/stores";
const accountStore = useAccounts();
const branchStore = useBranchStore(); // Updated store
const modalOpen: Ref<boolean> = ref(false);
const categoryModalOpen: Ref<boolean> = ref(false);
const editModalOpen: Ref<boolean> = ref(false);
const assignManagerModalOpen: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(8);
const loading: Ref<boolean> = ref(false);
const selectedBranch: Ref<string> = ref("");
const branches: Ref<any[]> = ref([]);
// let providerId = ref("");
let status = ref("");
const notify = useNotificationsStore();

// Helper function to get manager by branch
const getManagerByBranch = (branchName) => {
  return accountStore.managerAccounts.find(
    (manager) => manager.branch === branchName
  );
};

//Helper function to get manager by backoffice account
// const getBackOfficeAccount = (branchName) => {
//   return accountStore.backofficeAccounts.find(
//     (backofficeAccount) => backofficeAccount.branch = branchName
//   );
// };

onMounted(() => {
  loading.value = true;
  fetchBranches();
});

function fetchBranches() {
  // branchStore
  //   .fetchBranches(page.value, limit.value)
  //   .then(() => (loading.value = false))
  //   .catch((error: ApiError) => {
  //     loading.value = false;
  //     notify.error(error.response.data.message);
  //   });

  loading.value = true;
  // Fetch the services based on the page and limit
  const startIndex = (page.value - 1) * limit.value;
  const endIndex = startIndex + limit.value;
  branches.value = branchStore.services.slice(startIndex, endIndex);
  loading.value = false;
}

function open(branch: Branch) {
  router.push({ name: "branch-details", params: { id: branch.id } });
}

// edit branch
function edit(branch: Branch) {
  localStorage.setItem("branch", JSON.stringify(branch));
  editModalOpen.value = true;
}

//configure branch
function configure(branch: Branch) {
  localStorage.setItem("branch", JSON.stringify(branch));
  router.push({ name: "branch-configuration", params: { id: branch.id } });
}

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

// function deleteBranch(branch: Branch) {
//   branchStore.deleteBranch(branch.id);
//   notify.success("Branch Deleted");
//   fetchBranches();
// }

// function deleteBranch(branch: Branch) {
//     branchStore.deleteBranch(branch.id);
//     fetchBranches();  // Refetch the branches after deleting
//     notify.success("Branch Deleted");
//   }

function assignManager(branch: Branch) {
  // Logic to open the modal or start the process
  console.log(`Assigning manager for branch: ${branch.name}`);
  selectedBranch.value = branch.id;
  // Example: modalOpen.value = true;
  assignManagerModalOpen.value = true;
}

function deleteBranch(branchId: string) {
  branchStore.deleteBranch(branchId); // Assuming this is a mutation to remove the branch
  // branchStore.branches = branchStore.branches.filter((b) => b.id !== branchId); // Manually update the store
  // fetchBranches(); // Refetch the branches after deleting, if needed
  notify.success("Branch Deleted");
}

function close() {
  modalOpen.value = false;
  editModalOpen.value = false;
  assignManagerModalOpen.value = false;
}

function next() {
  page.value += 1;
  fetchBranches();
}

function previous() {
  page.value -= 1;
  fetchBranches();
}

watch(
  () => modalOpen.value,
  (isOpen: boolean) => {
    if (!isOpen) {
    }
  }
);

// const paginatedServices = computed(() => {
//   const start = (page.value - 1) * limit.value;
//   const end = start + limit.value;
//   return store.services.slice(start, end);  // Adjust according to your page & limit
// });

const paginatedBranches = computed(() => {
  const start = (page.value - 1) * limit.value;
  const end = start + limit.value;
  return branchStore.branches.slice(start, end); // Adjust according to your page & limit
});

// Helper function to assign managers to branches
const assignManagersToBranches = () => {
  branchStore.branches.forEach((branch) => {
    const manager = getManagerByBranch(branch.name);
    if (manager) {
      branch.manager = manager;
    }
  });
};

onMounted(() => {
  accountStore.fetchManagerAccounts();
  branchStore.fetchBranches();
  accountStore.fetchManagerAccounts();
  // allocateManager();
  assignManagersToBranches();
});
</script>

<template>
  <div class="w-full shadow-lg bg-white rounded p-2">
    <div class="flex">
      <div class="w-full py-1 text-primary-700">
        <i
          class="bg-primary-100 border border-primary-200 p-2 rounded-full fa-solid fa-code-branch"
        ></i>
        <label class="text-lg mx-1">Branches</label>
      </div>
    </div>
    <div class="flex justify-between my-1">
      <div class="flex flex-col">
        <!-- <div class="grid grid-cols-5"> -->
        <!-- <input
            class="filter-element e-input"
            type="text"
            placeholder="Search by Name"
          /> -->
        <!-- <select class="filter-element e-select" v-model="providerId">
            <option :value="null">- Select Provider -</option>
            <option
              v-for="(provider, idx) in providerStore.providers"
              :key="idx"
              :value="provider.id"
            >
              {{ provider.name }}
            </option>
          </select> -->
        <!-- <select class="filter-element e-select" v-model="status">
            <option :value="null">- Select Status -</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select> -->
        <!-- </div> -->
        <div
          class="w-[50vw] bg-white rounded-md flex items-center justify-center border border-gray-100 px-4 focus:ring-2 focus:ring-red-500"
        >
          <input
            type="text"
            placeholder="Search Managers"
            class="w-full text-sm border-none outline-none bg-white"
          />
          <i class="fas fa-search p-2 cursor-pointer text-gray-300 text-lg"></i>

          <!-- <button
      class="ml-4 px-6 py-2 bg-red-700 text-white rounded-md text-sm hover:bg-primary-600 transition duration-300 ease-in-out"
      @click="search"
    >
      Search
    </button> -->
        </div>
      </div>
      <div class="flex">
        <button
          @click="modalOpen = true"
          class="button btn-sm my-auto"
          type="button"
        >
          <i class="px-1 fa-solid fa-plus"></i> Add Branch
        </button>
      </div>
    </div>
    <div class="flex my-1">
      <table class="table">
        <thead>
          <tr class="">
            <!-- <th class="t-header">#</th> -->
            <th class="t-header">Name</th>
            <th class="text-left">Manager</th>
            <th class="text-center">Date</th>
            <!-- <th class="text-center">Actions</th> -->
            <!-- <th class="t-header"></th> -->
          </tr>
        </thead>
        <thead v-if="loading">
          <tr>
            <th colspan="" style="padding: 0">
              <div
                class="w-full bg-primary-300 h-1 p-0 m-0 animate-pulse"
              ></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- <tr
            class="body-tr"
            v-for="(branch, idx) in branchStore.branches"
            :key="idx"
          > -->
          <tr
            class="body-tr"
            v-for="(branch, idx) in paginatedBranches"
            :key="idx"
          >
            <!-- <td width="10px">{{ idx + 1 }}.</td> -->
            <td>
              <label
                class="cursor-pointer font-bold hover:text-primary-700 mx-2"
              >
                <span class="hover:underline" @click="open(branch)">
                  {{ branch.name }}
                </span>
                <!-- <i
                  class="fa-solid fa-link p-1 mx-1 text-gray-600 bg-gray-50 hover:text-primary-700"
                  @click="tag(branch)"
                ></i> -->
              </label>
            </td>

            <!-- <td class="text-black-700">
              <div v-if="getManagerByBranch(branch.name)">
                <label
                  >{{ getManagerByBranch(branch.name).firstName }}
                  {{ getManagerByBranch(branch.name).lastName }}</label
                >
              </div>
              <div v-else>
                <button
                  class="bg-red-200 rounded-md font-semibold text-red-700 p-1 hover:underline"
                  @click="allocateManager(branch)"
                >
                  Allocate Manager
                </button>
              </div>
            </td> -->

            <td class="text-black-700 text-left">
              <!-- First Case: Manager linked via `getManagerByBranch()` -->
              <div v-if="getManagerByBranch(branch.name)">
                <label>
                  {{ getManagerByBranch(branch.name).firstName }}
                  {{ getManagerByBranch(branch.name).lastName }}
                </label>
              </div>

              <!-- Second Case: Manager directly assigned to branch -->
              <div v-else-if="branch.manager">
                <label>
                  {{ branch.manager.firstName }} {{ branch.manager.lastName }}
                </label>
              </div>

              <!-- Third Case: Fallback, no manager assigned -->
              <div v-else>
                <button
                  class="bg-red-200 rounded-sm text-xs font-semibold text-red-700 px-1.5 py-1 hover:underline"
                  @click="assignManager(branch)"
                >
                  <i class="fa fa-user-plus"></i>
                  Assign Manager
                </button>
              </div>
            </td>

            <!-- <td class="text-center">
              <i
                :class="
                  branch.isActive
                    ? 'text-green-600 fa-solid fa-check'
                    : 'text-red-600 fa-solid fa-times'
                "
              ></i>
            </td> -->

            <!-- 
            <td class="text-center">
  <span>{{ branch.status }}</span>
</td> -->
            <td class="text-center">
              <span class="text-xs">{{
                convertDateTime(branch.createdAt)
              }}</span>
            </td>
            <!-- <td class="text-center">
              <i
                class="fa-solid fa-eye p-1 mx-1 text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700"
                @click="open(branch)"
              ></i>
              <i
                class="fa-solid fa-pen p-1 mx-1 text-green-600 bg-green-100 border border-green-200 hover:text-green-700"
                @click="edit(branch)"
              ></i>
              <i
                class="fa-solid fa-trash p-1 mx-1 text-red-600 bg-red-100 border border-red-200 hover:text-red-700"
                @click="deleteBranch(branch.id)"
              ></i>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex">
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
          <!-- <button
        :class="{ 'text-gray-300': page === 1, 'hover:text-primary': page > 1 }"
        :disabled="page === 1"
        class="rounded-l px-4 py-2"
        @click="previous"
      >
        <i class="fa-solid fa-caret-left m-2"></i>
      </button> -->

          <!-- Current Page / Total Pages -->
          <div class="py-1">
            <span class="px-2 py-1 bg-primary rounded text-white">{{
              page
            }}</span>
            <label class="mx-1 text-gray-400">/</label>
            <!-- <span class="px-2 py-1 bg-primary-50 rounded text-primary-600">
          {{ totalPages }}
        </span> -->
          </div>

          <!-- Next Button -->
          <!-- <button
        :class="{ 'text-gray-300': page >= totalPages, 'hover:text-primary': page < totalPages }"
        :disabled="page >= totalPages"
        class="rounded-r px-4 py-2"
        @click="next"
      >
        <i class="fa-solid fa-caret-right m-2"></i>
      </button> -->
          <button
            class="px-1 py-0.5 text-red-600 rounded-md hover:bg-red-700 hover:text-white focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{
              'opacity-50 cursor-not-allowed': branches.length < limit,
            }"
            :disabled="branches.length < limit"
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

  <!-- Modal -->
  <AppModal v-model="modalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <CreateBranch @branchCreated="close" @cancel="close" />
    <!-- That's also okay -->
  </AppModal>

  <AppModal v-model="editModalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <EditService @cancel="close" />
    <!-- That's also okay -->
  </AppModal>
  <!-- /Modal -->

  <!-- Assign Manager Modal -->
  <AppModal v-model="assignManagerModalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <AssignBranchManager
      :branchId="selectedBranch"
      @managerAssigned="close"
      @cancel="close"
    />
    <!-- That's also okay -->
  </AppModal>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
@/branchmanagerdomain/tills/stores@/branchmanagerdomain/tills/types@/branchmanager/tills/stores@/branchmanager/entities/stores@/branchmanager/accounts/stores