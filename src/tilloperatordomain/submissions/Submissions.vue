<script setup lang="ts">
import { onMounted, ref, reactive, watch, computed, type Ref } from "vue";
import { useSubmissions } from "@/tilloperatordomain/submissions/stores"; // Import the appropriate store
import { useDebounceFn } from "@vueuse/core";
import TransactionDetails from "@/tilloperatordomain/submissions/components/TransactionDetails.vue";
import { useNotificationsStore } from "@/stores/notifications";

import ServiceForm from "@/tilloperatordomain/services/components/ServiceForm.vue";
import AppModal from "@/components/AppModal.vue";
const serviceFormModalOpen: Ref<boolean> = ref(false);
function serviceForm(id: string) {
  loading.value = true;
  // Logic to open the modal or start the process
  // console.log(`Assigning manager for branch: ${branch.name}`);
  // Example: modalOpen.value = true;
  serviceFormModalOpen.value = true;

  loading.value = false;
}
// const close = () => {
//   serviceFormModalOpen.value = false;
// };

const pageInput = ref(1);
const changePageSize = () => {
  page.value = 1;
  fetchSubmissions();
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
  fetchSubmissions();
};

// const loading: Ref<boolean> = ref(false);

function fetchSubmissions() {
  // store
  //   .fetchSubmissions(page.value, limit.value)
  //   .then(() => (loading.value = false))
  //   .catch((error: ApiError) => {
  //     loading.value = false;
  //     notify.error(error.response.data.message);
  //   });

  loading.value = true;
  // Fetch the services based on the page and limit
  const startIndex = (page.value - 1) * limit.value;
  const endIndex = startIndex + limit.value;
  submissions.value = store.submissions.slice(startIndex, endIndex);
  loading.value = false;
}
const paginatedSubmissions = computed(() => {
  const start = (page.value - 1) * limit.value;
  const end = start + limit.value;
  return store.submissions.slice(start, end); // Adjust according to your page & limit
});
// const branchStore = useBranchStore();
const loading: Ref<boolean> = ref(false);
const totalRecords = computed(() => store.submissions.length); // Total backofficeAccounts
const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value));
const submissions: Ref<any[]> = ref([]);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(15);

const notify = useNotificationsStore();
// import type {
//   Submission,
//   FloatLedger,
//   FloatRequest,
//   FloatManagement,
// } from "./types";
// Import billing types
import moment from "moment/moment";

const store = useSubmissions(); // Assuming you have a billing store that handles transactions, float ledgers, etc.
const modalOpen = ref(false);

const transactionDetailsModalOpen: Ref<boolean> = ref(false);

function transactionDetails(id: string) {
  // Logic to open the modal or start the process
  // console.log(`Assigning manager for branch: ${branch.name}`);
  // Example: modalOpen.value = true;
  transactionDetailsModalOpen.value = true;
}

// Billing-specific filter
const filter = reactive({
  limit: 100,
  offset: 0,
  page: 1,
  sort: [
    {
      field: "date",
      order: "ASC",
    },
  ],
  filter: [
    {
      field: "description",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "amount",
      operand: "",
      operator: "GREATER_THAN",
    },
    {
      field: "balance",
      operand: "",
      operator: "GREATER_THAN",
    },
  ],
  fromDate: "", // Add fromDate
  toDate: "", // Add toDate
});

// Fetch billing data (transactions, float ledgers)
onMounted(() => {
  fetchSubmissions();
});

// function fetchSubmissions() {
//   filter.limit = limit.value;
//   filter.page = page.value;

//   // Add date filter if both dates are provided
//   if (filter.fromDate && filter.toDate) {
//     filter.filter.push({
//       field: "date",
//       operator: "BETWEEN",
//       operand: [filter.fromDate, filter.toDate],
//     });
//   }

//   store.fetchSubmissions(filter); // Fetch transactions based on filter
// }

// Function to handle submission draft
function submissionDraft(name: string) {
  // Logic to check if submission is a draft
  return name === "DRAFT";
}

// Function to handle submission repay
function submissionRepay(name: string) {
  // Logic to check if submission is a repay
  return name === "REPAY";
}

function next() {
  page.value += 1;
  fetchSubmissions();
}

function previous() {
  page.value -= 1;
  fetchSubmissions();
}

function open() {
  modalOpen.value = true;
}

function close() {
  modalOpen.value = false;
}

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

// Debounced filter update function
const updateFilter = useDebounceFn(
  () => {
    fetchSubmissions();
  },
  300,
  { maxWait: 5000 }
);

// Date conversion utility
const convertDate = (date: string) => moment(date).format("DD-MM-YYYY");

// Watch for changes in the modal state
watch(
  () => modalOpen.value,
  (isOpen) => {
    if (!isOpen) {
      // Handle modal close if needed
    }
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

// Watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
);
</script>


<template>
  <!-- <div class="flex flex-col min-h-[85vh]"> -->
  <div class="">
    <!-- Header -->
    <div class="max-w-7xl mx-auto bg-white p-2 flex flex-col min-h-[85vh]">
      <div class="flex space-x-2 my-1 pt-1 pb-3">
        <div class="flex-grow">
          <div
            class="grid grid-cols-6 gap-2 bg-gray-10 border border-gray-200 rounded px-2 py-3"
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
            <!-- <select class="filter-element e-select">
            <option :value="null">- Select Status -</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select> -->
            <div class="block">
              <label for="date-from" class="mr-2 text-sm text-gray-600"
                >From:</label
              >
              <input
                type="date"
                id="date-from"
                class="e-input filter-element"
                v-model="filter.fromDate"
              />
            </div>
            <div class="block">
              <label for="date-to" class="mr-2 text-sm text-gray-600"
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
      <!-- <div class="flex items-center justify-end border-b pb-4 mb-4 mt-3">
        <div>
          <label for="date-range" class="mr-2 text-sm text-gray-600 justify-end">Date Range:</label>
          <input
            type="date"
            id="date-range"
            class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div> -->
      <!-- Table -->
      <!-- Table -->
      <!-- <span v-if="copied">Copied!</span> -->

      <div class="flex my-1">
        <table class="table tr">
          <thead>
            <tr class="text-left">
              <th>#</th>
              <th>Tracking Number</th>
              <th>Service</th>
              <th>Provider</th>
              <!-- <th>Till</th> -->
              <!-- <th>Transaction Type</th> -->
              <th>Fee</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- <tr
              class="text-left"
              v-for="(transaction, idx) in store.submissions"
              :key="idx"
              :class="transaction.status === 'BLOCKED' ? 'blocked' : ''"
            > -->
            <tr
              class="text-left"
              v-for="(transaction, idx) in paginatedSubmissions"
              :key="idx"
              :class="transaction.status === 'BLOCKED' ? 'blocked' : ''"
            >
              <td>{{ idx + 1 }}</td>
              <td class="rounded-md font-semibold text-red-700">
                <span
                  @click="transactionDetails(transaction.id)"
                  class="hover:underline"
                >
                  {{ transaction.trackingNumber }}
                </span>
                <!-- make it copy to clipboard -->
                <i
                  @click="copyToClipboard(transaction.trackingNumber)"
                  class="fa-regular fa-copy mx-1 ml-4 hover:text-gray-800"
                ></i>
              </td>
              <td>{{ transaction.service }}</td>
              <td class="text-left">{{ transaction.provider }}</td>
              <!-- <td>{{ transaction.till }}</td> -->
              <!-- <td class="text-left">{{ transaction.transactionType }}</td> -->
              <td class="text-left">{{ transaction.fee.toLocaleString() }}</td>
              <td class="text-left">
                <!-- <div class="" v-if="submissionDraft(transaction.name)"> -->
                <!-- use transaction.status = draft -->
                <div class="" v-if="transaction.status === 'draft'">
                  <button
                    class="bg-gray-100 rounded-md font-semibold text-gray-600 px-1 py-0.5 border border-gray-300"
                    @click="submitDraft(transaction)"
                  >
                    Draft
                  </button>
                </div>
                <!-- <div class="" v-else-if="submissionRepay(transaction.name)"> -->
                <!-- use transaction.status = repay -->
                <div class="" v-if="transaction.status === 'repay'">
                  <button
                    class="bg-green-100 rounded-md font-semibold text-green-700 px-1 py-0.5 hover:underline border border-green-200"
                    @click="repay(transaction)"
                  >
                    Repay
                  </button>
                </div>
                <div class="" v-if="transaction.status === 'submitted'">
                  <span
                    class="bg-blue-100 rounded-md font-semibold text-blue-700 px-1 py-0.5 border border-blue-300"
                    @click="confirm(transaction)"
                  >
                    Submitted
                  </span>
                </div>
                <div class="" v-if="transaction.status === 'processing'">
                  <span
                    class="bg-yellow-100 rounded-md font-semibold text-yellow-700 px-1 py-0.5 border border-yellow-300"
                    @click="confirm(transaction)"
                  >
                    Processing
                  </span>
                </div>
                <div class="" v-if="transaction.status === 'queried'">
                  <span
                    class="bg-amber-200 rounded-md font-semibold text-amber-700 px-1 py-0.5 border border-amber-500"
                    @click="confirm(transaction)"
                  >
                    Queried
                  </span>
                </div>
                <div class="" v-if="transaction.status === 'rejected'">
                  <span
                    class="bg-red-100 rounded-md font-semibold text-red-700 px-1 py-0.5 border border-red-300"
                    @click="confirm(transaction)"
                  >
                    Rejected
                  </span>
                </div>
              </td>
              <td class="text-left">{{ convertDate(transaction.date) }}</td>
              <!-- <td class="text-left"> -->
              <!-- <td class="text-black-700 text-center">
              <div v-if="getManagerByBranch(branch.name)">
                <label>
                  {{ getManagerByBranch(branch.name).firstName }}
                  {{ getManagerByBranch(branch.name).lastName }}
                </label>
              </div>

              <div v-else-if="branch.manager">
                <label>
                  {{ branch.manager.firstName }} {{ branch.manager.lastName }}
                </label>
              </div>

              <div v-else>
                <button
                  class="bg-red-200 rounded-md font-semibold text-red-700 p-1 hover:underline"
                  @click="allocateManager(branch)"
                >
                  Assign Manager
                </button>
              </div>
            </td> -->
              <!-- actions -->
              <!-- use the same v-if, v-else-if and v-else to make scenarios for draft, repay, or confirmed -->
              <td class="text-left">
                <!-- <div class="" v-if="submissionDraft(transaction.name)"> -->
                <!-- use transaction.status = draft -->
                <div class="" v-if="transaction.status === 'draft'">
                  <!-- <button
                    class="bg-gray-500 rounded-md font-semibold text-white px-1 py-1 hover:bg-gray-600"
                    @click="submitDraft(transaction)"
                  > -->
                  <button
                    class="bg-gray-500 rounded-md font-semibold text-white px-1 py-1 hover:bg-gray-600"
                    @click="serviceForm(id)"
                  >
                    <!-- appropriate icon -->
                    <i class="fa fa-play"></i>
                    <!-- 
                    <div class="flex justify-between py-2">
          <span></span>
          <button class="button" type="submit">
            Send Request
            <span v-if="loading" class="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </span>
          </button>
        </div> -->
                    Resume
                    <span v-if="loading" class="lds-ring">
                      <!-- <span class="lds-ring"> -->

                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </span>
                  </button>
                  <button
                    class="bg-red-700 rounded-md ml-1 font-semibold text-white px-1 py-1 hover:bg-red-600"
                    @click="submitDraft(transaction)"
                  >
                    <!-- appropriate icon -->
                    <i class="fa fa-trash text-xs"></i>
                    Delete
                  </button>
                </div>
                <!-- <div class="" v-else-if="submissionRepay(transaction.name)"> -->
                <!-- use transaction.status = repay -->
                <div class="" v-else-if="transaction.status === 'repay'">
                  <button
                    class="bg-green-100 rounded-md font-semibold text-green-700 px-1 py-1 hover:underline border border-green-200"
                    @click="repay(transaction)"
                  >
                    Repay
                  </button>
                </div>
                <div class="" v-if="transaction.status === 'rejected'">
                  <span
                    class="bg-blue-600 rounded-md font-semibold text-white px-1 py-1 hover:bg-blue-200 hover:text-blue-700"
                    @click="confirm(transaction)"
                  >
                    <i class="fa fa-redo"></i>
                    Resubmit
                  </span>
                </div>
                <div class="" v-if="transaction.status === 'submitted'">
                  <span
                    class="bg-green-500 rounded-md font-semibold text-white px-1 py-1 hover:bg-green-700"
                    @click="confirm(transaction)"
                  >
                    <i class="fa fa-eye"></i>
                    View Details
                  </span>
                </div>
                <div class="" v-if="transaction.status === 'processing'">
                  <span
                    class="bg-blue-600 rounded-md font-semibold text-white px-1 py-1 hover:bg-blue-200 hover:text-blue-700"
                    @click="confirm(transaction)"
                  >
                    <i class="fa fa-redo"></i>
                    Resubmit
                  </span>
                </div>
                <div class="" v-if="transaction.status === 'queried'">
                  <span
                    class="bg-amber-600 rounded-md font-semibold text-white px-1 py-1 hover:bg-amber-700"
                    @click="confirm(transaction)"
                  >
                    <i class="fa fa-eye"></i>
                    View Query
                  </span>
                </div>
              </td>

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

      <div
        v-if="showPagination"
        class="flex text-xs mt-auto justify-center items-center"
      >
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
                'opacity-50 cursor-not-allowed': submissions.length < limit,
              }"
              :disabled="submissions.length < limit"
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
      <!-- Your modal content goes here -->
    </AppModal>

    <!-- Tracking Number Modal to show transaction details -->
    <AppModal v-model="transactionDetailsModalOpen" xl2>
      <TransactionDetails @transactionViewed="close" @cancel="close" />
    </AppModal>

    <AppModal v-model="serviceFormModalOpen" xl2>
      <ServiceForm @serviceSubmitted="close" @cancel="close" />
    </AppModal>
  </div>
</template>



<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
@import "@/assets/styles/loading-ring.css";
</style>
