<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed, type Ref } from "vue";
import AppModal from "@/components/AppModal.vue";
import { useBilling } from "@/agentadmindomain/finances/stores";
import { useDebounceFn } from "@vueuse/core";
import moment from "moment";
import type { IGoFilter } from "@/types";
import TransactionDetails from "@/agentadmindomain/finances/components/TransactionDetails.vue";
import { useNotificationsStore } from "@/stores/notifications";

const notify = useNotificationsStore();

const billingStore = useBilling();

// State
const loading: Ref<boolean> = ref(false);
const modalOpen = ref(false);
const page = ref(1);
const limit = ref(7);
const transactions: Ref<any[]> = ref([]);
const totalRecords = computed(() => billingStore.transactions.length); // Total transactions
const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value));
const pageInput = ref(1);
const changePageSize = () => {
  page.value = 1;
  fetchTransactions();
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
  fetchTransactions();
};
function fetchTransactions() {
  // branchStore
  //   .fetchTransactions(page.value, limit.value)
  //   .then(() => (loading.value = false))
  //   .catch((error: ApiError) => {
  //     loading.value = false;
  //     notify.error(error.response.data.message);
  //   });

  loading.value = true;
  // Fetch the services based on the page and limit
  const startIndex = (page.value - 1) * limit.value;
  const endIndex = startIndex + limit.value;
  transactions.value = billingStore.transactions.slice(startIndex, endIndex);
  loading.value = false;
}
const paginatedTransactions = computed(() => {
  const start = (page.value - 1) * limit.value;
  const end = start + limit.value;
  return billingStore.transactions.slice(start, end); // Adjust according to your page & limit
});

// Filter setup for transactions
const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page: 0,
  sort: [
    {
      field: "date", // Sorting by date for transactions
      order: "ASC",
    },
  ],
  filter: [
    { field: "branchName", operand: "", operator: "CONTAINS" },
    { field: "manager", operand: "", operator: "CONTAINS" },
    { field: "status", operand: "", operator: "CONTAINS" },
  ],
});

// Fetch transactions
const fetch = () => {
  filter.limit = limit.value;
  filter.page = page.value;
  billingStore.fetchTransactions(filter);
};

// Debounced filter update
const updateFilter = useDebounceFn(() => fetch(), 300, { maxWait: 5000 });

// Date conversion utility
// const convertDate = (date: string) => moment(date).format("DD-MM-YYYY");

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

// Pagination
const next = () => {
  page.value += 1;
  fetch();
};

const previous = () => {
  page.value -= 1;
  fetch();
};

// Modal control
const openTransaction = (transaction: any) => {
  // Logic to open modal with transaction details
  modalOpen.value = true;
};

const close = () => {
  modalOpen.value = false;
};

const transactionDetailsModalOpen: Ref<boolean> = ref(false);

function transactionDetails(id: string) {
  // Logic to open the modal or start the process
  // console.log(`Assigning manager for branch: ${branch.name}`);
  // Example: modalOpen.value = true;
  transactionDetailsModalOpen.value = true;
}

// Watchers
watch(
  () => modalOpen.value,
  (isOpen) => {
    if (!isOpen) fetch(); // Re-fetch transactions when modal closes
  }
);

// Ref to track if content was copied
const copied = ref(false);

const copyToClipboard = async (trackingNumber: string) => {
  try {
    // You can replace this with any string you want to copy
    // const textToCopy = "Text to copy to clipboard";

    // Using the Clipboard API
    await navigator.clipboard.writeText(trackingNumber);

    // Show "Copied!" for 2 seconds
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
    notify.success("Copied to clipboard");
  } catch (error) {
    console.error("Failed to copy text: ", error);
  }
};

watch(() => filter, updateFilter, { deep: true });

// Initialize fetch on mounted
// onMounted(() => fetch());
onMounted(() => {
  fetch();
  // billingStore.fetchTransactions(); // Fetch transactions when the component mounts
  // billingStore.fetchFloatLedgers(); // Fetch float ledgers
  billingStore.fetchTransactions;
});
</script>


<template>
  <div class="w-full shadow-lg bg-white rounded p-2 h-full flex flex-col">
    <div class="flex space-x-2 my-1 pt-1 pb-3">
      <div class="flex-grow"></div>
      <div class="flex-grow">
        <div
          class="grid grid-cols-7 gap-5 bg-gray-10 border border-gray-200 rounded px-2 py-3"
        >
          <input
            v-if="filter.filter !== undefined"
            input-type="text"
            v-model="filter.filter[0].operand"
            class="filter-element e-input"
            type="text"
            placeholder="Search by Tracking Number"
          />
          <select
            v-if="filter.filter !== undefined"
            input-type="text"
            v-model="filter.filter[1].operand"
            class="filter-element e-input"
            type="text"
            placeholder="Filter by Status"
          >
            <option value="" disabled selected>Filter by Status</option>
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>

          <select
            v-if="filter.filter !== undefined"
            input-type="text"
            v-model="filter.filter[2].operand"
            class="filter-element e-input"
            type="text"
            placeholder="Drop down provider"
          >
            <option value="" disabled selected>Filter by Provider</option>
            <option value="NIRA">NIRA</option>
            <option value="URSB">URSB</option>
            <!-- <option value="UMEME">UMEME</option> -->
            <option value="NARO">Posta Uganda</option>
          </select>
          <select
            v-if="filter.filter !== undefined"
            input-type="text"
            v-model="filter.filter[2].operand"
            class="filter-element e-input"
            type="text"
            placeholder="Search by Service"
          >
            <option value="" disabled selected>Filter by Service</option>
            <option value="companyNameReservation">
              Company Name Reservation
            </option>
            <option value="companyRegistration">Company Registration</option>
            <option value="companyNameSearch">Company Name Search</option>
            <option value="companyNameChange">Company Name Change</option>
          </select>
          <!-- <button @click="modalOpen = true" class="button btn-sm my-auto" type="button">
            <i class="px-1 fa-solid fa-plus"></i> Add Account
          </button> -->
          <div class="flex space-x-2 ml-10">
            <div class="flex items-center">
              <label for="date-from" class="text-sm text-gray-600">From:</label>
              <input
                type="date"
                id="date-from"
                class="e-input filter-element"
                v-model="filter.fromDate"
              />
            </div>
            <div class="flex items-center">
              <label for="date-to" class="mr-1 text-sm text-gray-600"
                >To:</label
              >
              <input
                type="date"
                id="date-to"
                class="e-input filter-element"
                v-model="filter.toDate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex my-1">
      <table class="table tr">
        <thead>
          <tr class="text-left">
            <th>#</th>
            <th>Tracking Number</th>
            <th>Transaction ID</th>
            <th>Service</th>
            <th>Provider</th>
            <th>Till</th>
            <!-- <th>Transaction Type</th> -->
            <th>Fee</th>
            <th>Status</th>
            <th>Date</th>
            <!-- <th>Actions</th> -->
          </tr>
        </thead>
        <tbody>
          <!-- <tr
            class="text-left"
            v-for="(transaction, idx) in billingStore.transactions"
            :key="idx"
            :class="transaction.status === 'BLOCKED' ? 'blocked' : ''"
          > -->
          <tr
            class="text-left"
            v-for="(transaction, idx) in paginatedTransactions"
            :key="idx"
            :class="transaction.status === 'BLOCKED' ? 'blocked' : ''"
          >
            <td class="text-left">
              <label class="cursor-pointer hover:text-primary-700 mx-2">
                <span class="hover:underline">{{ transaction.id }}</span>
              </label>
            </td>
            <!-- <td>{{ idx + 1 }}</td> -->
            <td class="rounded-md font-semibold text-red-700">
              <span
                class="hover:underline"
                @click="transactionDetails(transaction.id)"
                >{{ transaction.trackingNumber }}</span
              >
              <i
                @click="copyToClipboard(transaction.trackingNumber)"
                class="fa-regular fa-copy mx-1 hover:text-gray-800"
              ></i>
            </td>
            <td class="rounded-md font-semibold text-red-700 hover:underline">
              <span
                class="hover:underline"
                @click="transactionDetails(transaction.id)"
                >{{ transaction.transactionID }}</span
              >
              <i
                @click="copyToClipboard(transaction.trackingNumber)"
                class="fa-regular fa-copy mx-1 hover:text-gray-800"
              ></i>
            </td>
            <td>{{ transaction.service }}</td>
            <td class="text-left">{{ transaction.provider }}</td>
            <td>{{ transaction.till }}</td>
            <!-- <td class="text-left">{{ transaction.transactionType }}</td> -->
            <td class="text-left">{{ transaction.fee.toLocaleString() }}</td>
            <!-- <td class="text-left">
              <span
                class="bg-green-100 text-green-600 p-1 border border-green-200 rounded-md"
              >
                {{ transaction.status }}
              </span>
            </td> -->
            <td class="text-left">
              <!-- First Case: float request approved -->
              <div v-if="transaction.status === 'pending'">
                <!-- <td> -->
                <!-- <label> -->
                <span
                  class="text-xs cursor-pointer rounded-md px-1 py-0.5 font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:text-gray-700 hover:bg-gray-200"
                  @click="open(transaction)"
                  >Pending</span
                >
                <!-- </label> -->
                <!-- </td> -->
              </div>

              <!-- Second Case: Manager directly assigned to branch -->
              <div v-else-if="transaction.status === 'failed'">
                <!-- <td> -->
                <label>
                  <span
                    class="text-xs cursor-pointer rounded-md px-1 py-0.5 font-semibold text-red-600 bg-red-100 border border-red-200 hover:text-red-700 hover:bg-red-200"
                    @click="open(transaction)"
                    >Failed</span
                  >
                </label>
                <!-- </td> -->
              </div>

              <!-- Third Case: Fallback, no manager assigned -->
              <div v-else>
                <!-- <td> -->
                <span
                  class="text-xs rounded-md px-1 py-0.5 font-semibold text-green-600 bg-green-100 border border-green-200 hover:text-green-700 hover:bg-green-200"
                  >Success</span
                >
              </div>
            </td>
            <td class="text-left">{{ convertDateTime(transaction.date) }}</td>
            <!-- <td class="text-left"> -->
            <!-- <button @click="openTransaction(transaction)">Edit</button> -->
            <!-- actions -->

            <!-- </td> -->

            <!-- <td class="text-left">
              <i
                class="fa-solid fa-eye p-1 mx-1 text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700"
                @click="open(transaction)"
              ></i>
              <i
                class="fa-solid fa-pen p-1 mx-1 text-green-600 bg-green-100 border border-green-200 hover:text-green-700"
                @click="edit(transaction)"
              ></i>
              <i
                class="fa-solid fa-trash p-1 mx-1 text-red-600 bg-red-100 border border-red-200 hover:text-red-700"
                @click="deleteBranch(transaction)"
              ></i>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <!-- <div class="flex text-xs mt-auto"> -->
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
              'opacity-50 cursor-not-allowed': transactions.length < limit,
            }"
            :disabled="transactions.length < limit"
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
    <CreateAccount @cancel="close" />
  </AppModal>
  <!-- /Modal -->

  <!-- Tracking Number Modal to show transaction details -->
  <AppModal v-model="transactionDetailsModalOpen" xl2>
    <TransactionDetails @transactionViewed="close" @cancel="close" />
  </AppModal>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
