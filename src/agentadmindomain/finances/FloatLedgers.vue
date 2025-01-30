<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, ref, reactive, watch, computed, type Ref } from "vue";
import { useBilling } from "@/agentadmindomain/finances/stores"; // Import the appropriate store
import { useDebounceFn } from "@vueuse/core";
import type {
  Transaction,
  FloatLedger,
  FloatRequest,
  FloatManagement,
} from "./types"; // Import billing types
import moment from "moment/moment";
import { useBalance } from "@/agentadmindomain/balance/stores"; // Import the balance store

const balanceStore = useBalance(); // Initialize the balance store

balanceStore.fetchTotalBalance(); // Decrease balance by 100

const billingStore = useBilling(); // Assuming you have a billing store that handles transactions, float ledgers, etc.
const loading: Ref<boolean> = ref(false);
const modalOpen = ref(false);
const page = ref(1);
const limit = ref(7);
const floatLedgers: Ref<any[]> = ref([]);
const totalRecords = computed(() => billingStore.floatLedgers.length); // Total transactions
const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value));
const pageInput = ref(1);
const changePageSize = () => {
  page.value = 1;
  fetchFloatLedgers();
};
// const showPagination = computed(() => totalRecords.value >= limit.value);

const jumpToPage = () => {
  if (pageInput.value > totalPages.value) {
    page.value = totalPages.value;
  } else if (pageInput.value < 1) {
    page.value = 1;
  } else {
    page.value = pageInput.value;
  }
  fetchFloatLedgers();
};
function fetchFloatLedgers() {
  // branchStore
  //   .fetchFloatLedgers(page.value, limit.value)
  //   .then(() => (loading.value = false))
  //   .catch((error: ApiError) => {
  //     loading.value = false;
  //     notify.error(error.response.data.message);
  //   });

  loading.value = true;
  // Fetch the services based on the page and limit
  const startIndex = (page.value - 1) * limit.value;
  const endIndex = startIndex + limit.value;
  floatLedgers.value = billingStore.floatLedgers.slice(startIndex, endIndex);
  loading.value = false;
}

const showPagination = computed(() => totalRecords.value >= limit.value);

// const paginatedFloatLedgers = computed(() => {
//   const start = (page.value - 1) * limit.value;
//   const end = start + limit.value;
//   return billingStore.transactions.slice(start, end); // Adjust according to your page & limit
// });

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
  fetchFloatLedgers();
  billingStore.fetchFloatLedgers(); // Fetch float ledgers
  // balanceStore.fetchTotalBalance(); // Fetch total balance
  // balanceStore.increaseTotalBalance(); // Increase balance by 100
});

const computedLedgerWithBalance = computed(() => {
  const start = (page.value - 1) * limit.value;
  const end = start + limit.value;
  const paginatedFloatLedgers = billingStore.floatLedgers.slice(start, end);
  // return billingStore.transactions.slice(start, end);

  // if (store.floatLedgers.length === 0) {
  //   return [];
  // }

  // Start with the balance from the store
  let runningBalance = 0;

  // Process transactions chronologically
  return paginatedFloatLedgers.map((transaction) => {
    // Adjust the running balance based on transaction amount
    runningBalance += transaction.amount;

    return {
      ...transaction,
      balance: runningBalance, // Attach the calculated balance
    };
  });
});

// function fetchFloatLedgers() {
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

//   store.fetchFloatLedgers(filter); // Fetch transactions based on filter
// }

function next() {
  page.value += 1;
  fetchFloatLedgers();
}

function previous() {
  page.value -= 1;
  fetchFloatLedgers();
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
    fetchFloatLedgers();
  },
  300,
  { maxWait: 5000 }
);

// Watch for changes in the modal state
watch(
  () => modalOpen.value,
  (isOpen) => {
    if (!isOpen) {
      // Handle modal close if needed
    }
  }
);

// Watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
);

// watch(
//   () => balanceStore.totalBalance,
//   (newVal) => {
//     console.log("Balance updated:", newVal);
//   },
//   { deep: true }
// );

watch(
  () => balanceStore.totalBalance,
  (newValue) => {
    console.log("Total balance updated:", newValue);
  },
  { deep: true }
);

watch(
  () => billingStore.floatLedgers,
  (newLedgers) => {
    console.log("Float ledgers updated:", newLedgers);
  }
);

watch(
  computedLedgerWithBalance,
  (floatLedgers) => {
    console.log("Computed floatLedgers:", floatLedgers);
  },
  { deep: true }
);
</script>


<template>
  <!-- <div class=""> -->
  <!-- Header -->
  <div class="max-w-7xl mx-auto bg-white flex flex-col p-2 min-h-[60vh]">
    <div class="flex space-x-2 my-1 pt-1 pb-3">
      <div class="flex-grow">
        <div
          class="flex justify-between gap-2 bg-gray-10 border border-gray-200 rounded px-2 py-3"
        >
          <select
            v-if="filter.filter !== undefined"
            input-type="text"
            v-model="filter.filter[2].operand"
            class="filter-element e-input"
            type="text"
            placeholder="Drop down provider"
          >
            <option value="" disabled selected>Filter by Description</option>
            <option value="recharge">Recharge</option>
            <option value="floatAllocation">Float Allocation</option>
            <!-- <option value="UMEME">UMEME</option> -->
          </select>
          <!-- <select class="filter-element e-select">
            <option :value="null">- Select Status -</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select> -->
          <div class="flex">
            <div class="block">
              <label for="date-from" class="mr-2 text-sm text-gray-600"
                >From:</label
              >
              <input
                type="date"
                id="date-from"
                class="filter-element e-input"
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
                class="filter-element e-input"
                v-model="filter.toDate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <!-- Table -->
    <div class="flex my-1">
      <table class="table w-full">
        <thead>
          <tr class="header-tr">
            <th class="t-header">#</th>
            <th class="t-header">Date</th>
            <th class="t-header">Type</th>
            <th class="text-right t-header">Amount</th>
            <th class="text-right t-header">Balance</th>
          </tr>
        </thead>
        <thead v-if="loading">
          <tr>
            <th colspan="12" style="padding: 0">
              <div
                class="w-full bg-primary-300 h-1 p-0 m-0 animate-pulse"
              ></div>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- <tr
              v-for="(transaction) in store.floatLedgers"
              :key="transaction.id"
              class="body-tr"
            > -->

          <tr
            v-for="transaction in computedLedgerWithBalance"
            :key="transaction.id"
            class="body-tr"
          >
            <td class="text-left">
              <label class="cursor-pointer hover:text-primary-700 mx-2">
                <span class="hover:underline">{{ transaction.id }}</span>
              </label>
            </td>
            <!-- <td class="text-left">{{ idx + 1 }}</td> -->

            <td class="text-left">
              <span class="text-xs">{{
                convertDateTime(transaction.createdAt)
              }}</span>
            </td>
            <td class="text-left">
              <label class="cursor-pointer hover:text-primary-700 mx-2">
                <span class="hover:underline">{{
                  transaction.description
                }}</span>
              </label>
            </td>

            <!-- <td>
                <span
                class="text-left bg-blue-200 text-blue-600 rounded-sm font-semibold px-2 py-1"
                :class="{ 'bg-red-300 text-red-600  rounded-md px-2': transaction.amount < 0 }">{{ transaction.description }}</span>
              </td> -->
            <!-- <td class="text-left text-green-600">
                <span>{{ transaction.amount }}</span>
              </td> -->
            <!-- v-bind for red incase negative transaction and green incase positive transaction -->
            <td
              class="text-left text-green-600"
              :class="{ 'text-red-600': transaction.amount < 0 }"
            >
              <span>{{ transaction.amount.toLocaleString() }}</span>
            </td>
            <td class="text-left text-gray-800">
              <!-- <button @click="decreaseBalance">Decrease Balance</button> -->
              <!-- <span>{{ balanceStore.totalBalance.current }}</span> -->
              <span>{{ transaction.balance.toLocaleString() }}</span>
            </td>
          </tr>
        </tbody>
        <!-- <tfoot>
            <tr class="bg-gray-50">
              <td colspan="3" class="text-left font-bold text-gray-600">
                Totals:
              </td>
              <td class="text-left font-bold text-gray-800">
                {{ store.totalAmount }}
              </td>
              <td class="text-left font-bold text-gray-800">
                {{ store.totalBalance }}
              </td>
            </tr>
          </tfoot> -->
      </table>
    </div>
  </div>

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
            'opacity-50 cursor-not-allowed': floatLedgers.length < limit,
          }"
          :disabled="floatLedgers.length < limit"
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
        <span class="my-auto mx-2 bg-primary-50 px-3 py-1 rounded text-primary">
          Total Records: {{ totalRecords }}
        </span>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <AppModal v-model="modalOpen" xl2>
    <!-- Your modal content goes here -->
  </AppModal>
  <!-- </div> -->
</template>



<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
