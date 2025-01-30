<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, ref, type Ref, watch, computed } from "vue";
import CreateTill from "@/branchmanagerdomain/tills/components/CreateBranch.vue";
import { useTillStore } from "@/branchmanagerdomain/tills/stores"; // Updated import
import type { Till } from "@/branchmanagerdomain/tills/types"; // Assuming you have a till type
import moment from "moment/moment";
import router from "@/router";
import { useProviderStore } from "@/branchmanagerdomain/entities/stores";
import AssignTillOperator from "@/branchmanagerdomain/tills/components/AssignTillOperator.vue";
import EditBranch from "@/branchmanagerdomain/tills/components/EditBranch.vue";
// import CategorySelector from "@/branchmanagerdomain/settings/components/CategorySelector.vue";
import { useNotificationsStore } from "@/stores/notifications";
import type { ApiError } from "@/types";
import { useAccountStore } from "../auth/stores";
// import TableLoader from "@/components/TableLoader.vue";
import { useBilling } from "@/branchmanagerdomain/finances/stores";

const billingStore = useBilling();

import { useAccounts } from "@/branchmanagerdomain/accounts/stores";
const accountStore = useAccounts();
const tillStore = useTillStore(); // Updated store
const modalOpen: Ref<boolean> = ref(false);
const categoryModalOpen: Ref<boolean> = ref(false);
const editModalOpen: Ref<boolean> = ref(false);
const assignOperatorModalOpen: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(8);
const loading: Ref<boolean> = ref(false);
const selectedTill: Ref<string> = ref("");
const tills: Ref<any[]> = ref([]);
// let providerId = ref("");
let status = ref("");
const notify = useNotificationsStore();

const totalRecords = computed(() => tillStore?.tills.length); // Total tills
const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value));
const pageInput = ref(1);
const changePageSize = () => {
  page.value = 1;
  fetchTills();
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
  fetchTills();
};

// Helper function to get manager by branch
const getOperatorByTill = (tillName) => {
  return accountStore.tillOperators.find(
    (operator) => operator.till === tillName
  );
};

//Helper function to get manager by backoffice account
// const getBackOfficeAccount = (branchName) => {
//   return accountStore.backofficeAccounts.find(
//     (backofficeAccount) => backofficeAccount.branch = branchName
//   );
// };

function fetchTills() {
  // tillStore
  //   .fetchtills(page.value, limit.value)
  //   .then(() => (loading.value = false))
  //   .catch((error: ApiError) => {
  //     loading.value = false;
  //     notify.error(error.response.data.message);
  //   });

  loading.value = true;
  // Fetch the services based on the page and limit
  const startIndex = (page.value - 1) * limit.value;
  const endIndex = startIndex + limit.value;
  tills.value = tillStore.tills.slice(startIndex, endIndex);
  loading.value = false;
}

function open(till: Till) {
  router.push({ name: "till-details", params: { id: till.id } });
}

// edit branch
function edit(till: Till) {
  editModalOpen.value = true;
  // localStorage.setItem("branch", JSON.stringify(till));
  console.log("Branch to edit: ", till);
}

//configure branch
function configure(till: Till) {
  localStorage.setItem("till", JSON.stringify(till));
  router.push({ name: "till-configuration", params: { id: till.id } });
}

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

// function deleteBranch(branch: Till) {
//   tillStore.deleteBranch(branch.id);
//   notify.success("Branch Deleted");
//   fetchTills();
// }

// function deleteBranch(branch: Till) {
//     tillStore.deleteBranch(branch.id);
//     fetchTills();  // Refetch the tills after deleting
//     notify.success("Branch Deleted");
//   }

function assignOperator(till: Till) {
  // Logic to open the modal or start the process
  console.log(`Assigning operator for till: ${till.name}`);
  selectedTill.value = till.id;
  // Example: modalOpen.value = true;
  assignOperatorModalOpen.value = true;
}

function deleteTill(tillId: string) {
  tillStore.deleteTill(tillId); // Assuming this is a mutation to remove the branch
  // tillStore.tills = tillStore.tills.filter((b) => b.id !== branchId); // Manually update the store
  // fetchTills(); // Refetch the tills after deleting, if needed
  notify.success("Branch Deleted");
}

function close() {
  modalOpen.value = false;
  editModalOpen.value = false;
  assignOperatorModalOpen.value = false;
}

function next() {
  page.value += 1;
  fetchTills();
}

function previous() {
  page.value -= 1;
  fetchTills();
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

const paginatedTills = computed(() => {
  const start = (page.value - 1) * limit.value;
  const end = start + limit.value;
  return tillStore.tills?.slice(start, end); // Adjust according to your page & limit
});

// Helper function to assign managers to tills
const assignOperatorsToTills = () => {
  tillStore.tills?.forEach((till) => {
    const operator = getOperatorByTill(till.name);
    if (operator) {
      till.operator = operator;
    }
  });
};

// const branchManagerFloatBalance = ref(0);

// onMounted(()=>{
//     const savedFloatManagerBalance = JSON.parse(localStorage.getItem('branchManagerFloatBalance'));

//     if (savedFloatManagerBalance) {
//       branchManagerFloatBalance.value = savedFloatManagerBalance;
//     }
//   })

onMounted(() => {
  loading.value = true;
  fetchTills();
  accountStore.fetchTillOperators();
  tillStore.fetchTills();
  // accountStore.fetchTillOperators();
  // allocateManager();
  assignOperatorsToTills();
});
</script>

<template>
  <div class="w-full shadow-lg bg-white rounded p-2 flex flex-col min-h-[85vh]">
    <div class="flex">
      <div class="w-full py-1 text-primary-700">
        <!-- <i
          class="bg-primary-100 border border-primary-200 p-2 rounded-full fa-solid fa-code-branch"
        ></i> -->
        <i
          class="bg-primary-100 border border-primary-200 p-2 rounded-full fa-solid fa-building"
        ></i>
        <label class="text-lg mx-1">Tills</label>
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
            placeholder="Search Till Operators"
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
          <i class="px-1 fa-solid fa-plus"></i> Add Till
        </button>
      </div>
    </div>
    <div class="flex my-1">
      <table class="table">
        <thead>
          <tr class="">
            <!-- <th class="t-header">#</th> -->
            <th class="t-header">Number</th>
            <th class="text-left">Operator</th>
            <th class="text-left">Date</th>
            <th class="text-right">Actions</th>
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
            v-for="(till, idx) in tillStore.tills"
            :key="idx"
          > -->
          <tr
            class="body-tr"
            v-for="(till, idx) in paginatedTills"
            :key="idx"
          >
            <!-- <td width="10px">{{ idx + 1 }}.</td> -->
            <td>
              <label
                class="cursor-pointer font-bold hover:text-primary-700 mx-2"
              >
                <span class="hover:underline" @click="open(till)">
                  {{ till.name }}
                </span>
                <!-- <i
                  class="fa-solid fa-link p-1 mx-1 text-gray-600 bg-gray-50 hover:text-primary-700"
                  @click="tag(till)"
                ></i> -->
              </label>
            </td>

            <!-- <td class="text-black-700">
              <div v-if="getOperatorByTill(till.name)">
                <label
                  >{{ getOperatorByTill(till.name).firstName }}
                  {{ getOperatorByTill(till.name).lastName }}</label
                >
              </div>
              <div v-else>
                <button
                  class="bg-red-200 rounded-md font-semibold text-red-700 p-1 hover:underline"
                  @click="allocateManager(till)"
                >
                  Allocate Manager
                </button>
              </div>
            </td> -->

            <td class="text-black-700 text-left">
              <!-- First Case: Manager linked via `getOperatorByTill()` -->
              <div v-if="getOperatorByTill(till.name)">
                <label>
                  {{ getOperatorByTill(till.name).firstName }}
                  {{ getOperatorByTill(till.name).lastName }}
                </label>
              </div>

              <!-- Second Case: Manager directly assigned to till -->
              <div v-else-if="till.operator">
                <label>
                  {{ till.operator.firstName }} {{ till.operator.lastName }}
                </label>
              </div>

              <!-- Third Case: Fallback, no manager assigned -->
              <!-- <div v-else>
                <button
                  class="bg-red-200 rounded-sm text-xs font-semibold text-red-700 px-1.5 py-1 hover:underline"
                  @click="assignManager(till)"
                >
                  <i class="fa fa-user-plus"></i>
                  Assign Manager
                </button>
              </div> -->
              <div v-else>
                <button
                  class="bg-red-700 rounded-md text-xs font-semibold text-white px-1.5 py-1 hover:underline"
                  @click="assignOperator(till)"
                >
                  <i class="fa fa-user-plus"></i>
                  Assign Operator
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

            <!-- <i
                class="fa-solid fa-eye p-1 mx-1 text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700"
                @click="open(till)"
              ></i>
  <i
                class="fa-solid fa-trash p-1 mx-1 text-red-600 bg-red-100 border border-red-200 hover:text-red-700"
                @click="deleteBranch(till.id)"
              ></i>
            <td class="text-center">
  <span>{{ branch.status }}</span>
</td> -->
            <td class="text-left">
              <span class="text-xs">{{
                convertDateTime(till.createdAt)
              }}</span>
            </td>
            <td class="text-right">
              <!-- <i
                class="fa-solid fa-eye p-1 mx-1 text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700"
                @click="open(till)"
              ></i> -->
              <span
                class="p-1 mx-1 rounded-md text-white bg-blue-600 hover:bg-blue-800"
              >
                <i class="fa-solid fa-pen" @click="edit(till)"></i>
                Edit
              </span>

              <!-- <i
                class="fa-solid fa-trash p-1 mx-1 text-red-600 bg-red-100 border border-red-200 hover:text-red-700"
                @click="deleteBranch(branch.id)"
              ></i> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- <div class="flex text-sm"> -->
    <!-- <div class="flex text-xs mt-auto"> -->
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
              'opacity-50 cursor-not-allowed': tills.length < limit,
            }"
            :disabled="tills.length < limit"
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
    <CreateBranch @tillCreated="close" @cancel="close" />
    <!-- That's also okay -->
  </AppModal>

  <AppModal v-model="editModalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <EditBranch @cancel="close" />
    <!-- That's also okay -->
  </AppModal>
  <!-- /Modal -->

  <!-- Assign Manager Modal -->
  <AppModal v-model="assignOperatorModalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <AssignTillOperator
      :tillId="selectedTill"
      @operatorAssigned="close"
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
<!-- @/branchmanagerdomain/finances/stores/index2@/branchmanagerdomain/finances/stores/index2@/branchmanagerdomain/finances/stores/index copy -->