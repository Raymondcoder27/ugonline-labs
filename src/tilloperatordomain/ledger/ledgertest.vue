<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, ref, reactive, watch, computed } from "vue";
import { useBilling } from "@/tilloperatordomain/ledger/stores"; // Import the appropriate store
import { useDebounceFn } from "@vueuse/core";
import type {
  Transaction,
  FloatLedger,
  FloatRequest,
  FloatManagement,
} from "./types"; // Import billing types
import moment from "moment/moment";
import RequestFloat from "@/tilloperatordomain/ledger/components/RequestFloat.vue";
import { useBalance } from "@/tilloperatordomain/balance/stores";
const balanceStore = useBalance();

const store = useBilling(); // Assuming you have a billing store that handles transactions, float ledgers, etc.
const modalOpen = ref(false);
const page = ref(1);
const limit = ref(15);

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

// function fetchTransactions() {
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
//   console.log("Filter object sent to fetchTransactions:", filter);
//   store.fetchTransactions(filter); // Fetch transactions based on filter
// }

// if (filter.fromDate || filter.toDate) {
//   const dateFilter = {
//     field: "date",
//     operator: "BETWEEN",
//     operand: [filter.fromDate || "1900-01-01", filter.toDate || "2100-12-31"],
//   };
//   filter.filter.push(dateFilter);
// }

async function fetchFloatLedgers() {
    // Remove any previous 'status' filters
    filter.filter = filter.filter.filter((f) => f.field !== "description");

    if (description.value) {
        filter.filter.push({
            field: "description",
            operand: description.value,
            operator: "EQUALS",
        });
    }

    console.log("Filter before fetch:", filter);

    // Await the fetch operation
    const response = await store.fetchTransactions(filter);

    // Log the response or handle it
    console.log("Fetched transactions:", response);
}

function next() {
  page.value += 1;
  fetchTransactions();
}

function previous() {
  page.value -= 1;
  fetchTransactions();
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
// const updateFilter = useDebounceFn(
//   () => {
//     fetchTransactions();
//   },
//   300,
//   { maxWait: 5000 }
// );

// const updateFilter = useDebounceFn(() => {
//   console.log("Filter updated, fetching transactions...");
//   store.fetchTransactions(filter);
// }, 300);

const description = ref("");

const updateFilter = useDebounceFn(() => {
  console.log("Filter updated, fetching transactions...");
  store.fetchFloatLedgers(filter);
}, 300);

watch(
  () => [filter.fromDate, filter.toDate, description.value],
  () => {
    updateFilter();
  },
  { deep: true }
);


// watch(
//   () => filter,
//   () => {
//     console.log("Filter updated:", filter);
//     updateFilter();
//   },
//   { deep: true }
// );

// watch(
//   () => filter.filter,
//   () => updateFilter(),
//   { deep: true }
// );

// Watch for changes in the modal state
// watch(
//   () => modalOpen.value,
//   (isOpen) => {
//     if (!isOpen) {
//       // Handle modal close if needed
//     }
//   }
// );

// // Watch for changes in the filter object
// watch(
//   () => filter,
//   () => {
//     console.log("Filter updated:", filter);
//     updateFilter();
//   },
//   { deep: true }
// );

// computed(() => {
//   const initialBalance = 15000000; // From store or static reference
//   const transactions = store.floatLedgers;

//   return transactions.reduce((balance, tx) => {
//     return balance + tx.amount;
//   }, initialBalance);
// });

// Compute running balance
const computedTransactions = computed(() => {
  if (store.floatLedgers.length === 0) {
    return [];
  }

  // let runningBalance = balanceStore.totalBalance.current || 0;
  let runningBalance = 0;

  return store.floatLedgers.map((transaction) => {
    runningBalance += transaction.amount;

    return {
      ...transaction,
      balance: runningBalance,
    };
  });
});

// watch(
//   computedTransactions,
//   (transactions) => {
//     console.log("Computed transactions:", transactions);
//   },
//   { deep: true }
// );

// watch(
//   () => balanceStore.totalBalance.value,
//   (newVal, oldVal) => {
//     console.log("Balance updated:", oldVal, "->", newVal);
//   },
//   { deep: true }
// );

// let description = ref("")
// watch(
//     () => description.value,
//     () => {
//       fetchFloatLedgers()
//     },
// );

// watch(
//   () => description.value,
//   () => {
//     filter.filter = filter.filter.filter((f) => f.field !== "description");
//     if (description.value) {
//       filter.filter.push({
//         field: "description",
//         operand: description.value,
//         operator: "EQUALS",
//       });
//     }
//     fetchFloatLedgers();
//   }
// );


// Fetch billing data (transactions, float ledgers)
onMounted(() => {
  fetchFloatLedgers();
  // store.fetchFloatLedgers();
});
</script>


<template>
  <div class="">
    <!-- Header -->
    <div class="max-w-7xl mx-auto bg-white p-2">
      <div class="flex space-x-2 my-1 pt-1 pb-3">
        <div class="flex-grow">
          <div
            class="flex justify-between bg-gray-10 border border-gray-200 rounded px-2 py-3"
          >
            <div class="flex">
              <!-- <select
                v-if="filter.filter"
                v-model="filter.filter[0].operand"
                input-type="text"
                class="filter-element e-input"
                type="text"
                placeholder="Filter by Description"
              >
                <option value="">All Transactions</option>
                <option value="recharge">Recharge</option>
                <option value="servicefee">Service Fee</option>
              </select> -->

              <select
                v-if="filter.filter"
                v-model="description"
                class="filter-element e-input"
                @change="fetchFloatLedgers"
              >
                <option value="">All Transactions</option>
                <!-- <option value="Recharge">Recharge</option>
                <option value="serviceFee">Service Fee</option> -->
                <option value="recharge">Recharge</option>
<option value="service_fee">Service Fee</option>

              </select>

              <div class="flex">
                <div class="flex items-center mr-2">
                  <label for="date-from" class="mr-2 text-sm text-gray-600"
                    >From:</label
                  >
                  <input
                    type="date"
                    id="date-from"
                    class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    v-model="filter.fromDate"
                  />
                </div>
                <div class="flex items-center mr-2">
                  <label for="date-to" class="mr-2 text-sm text-gray-600"
                    >To:</label
                  >
                  <input
                    type="date"
                    id="date-to"
                    class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    v-model="filter.toDate"
                  />
                </div>
              </div>
            </div>
            <div class="">
              <button
                @click="modalOpen = true"
                class="button btn-sm"
                type="button"
              >
                <i class="px-1 fa-solid fa-plus"></i> Request Float
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex my-1">
        <table class="table w-full">
          <thead>
            <tr class="header-tr">
              <!-- <th class="t-header">#</th> -->
              <th class="t-header">Date</th>
              <th class="t-header">Description</th>
              <th class="text-right t-header">Amount</th>
              <th class="text-right first-letter:capitalize t-header">
                Status
              </th>
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
            <tr
              v-for="transaction in computedTransactions"
              :key="transaction.id"
              class="body-tr"
            >
              <!-- <td class="text-left">{{ idx + 1 }}</td> -->
              <td class="text-left">
                <span class="text-xs">{{
                  convertDateTime(transaction.createdAt)
                }}</span>
              </td>
              <td class="text-left">
                <label
                  class="cursor-pointer font-bold hover:text-primary-700 mx-2"
                >
                  <span class="hover:underline">{{
                    transaction.description
                  }}</span>
                </label>
              </td>

              <!-- <td>
                <span
                class="text-left bg-blue-200 text-blue-600 rounded-sm font-semibold px-2 py-1"
                :class="{ 'text-red-600 bg-red-200 rounded-md px-1': transaction.amount < 0 }">{{ transaction.description }}</span>
              </td> -->
              <!-- <td class="text-left text-green-600">
                <span>{{ transaction.amount }}</span>
              </td> -->
              <!-- v-bind for red incase negative transaction and green incase positive transaction -->
              <!-- <td
                class="text-left text-green-600"
                :class="{ 'text-red-600': transaction.amount < 0 }"
              >
                <span>{{ transaction.amount }}</span>
              </td> -->
              <td
                class="text-left text-blue-600"
                :class="{ 'text-red-600': transaction.amount < 0 }"
              >
                <span>{{ transaction.amount.toLocaleString() }}</span>
              </td>
              <td class="text-left">
                <!-- First Case: float request approved -->
                <div v-if="transaction.status === 'pending'">
                  <!-- <td> -->
                  <!-- <label> -->
                  <span
                    class="text-xs cursor-pointer rounded-md p-1 font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:text-gray-700 hover:bg-gray-200"
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
                      class="text-xs cursor-pointer rounded-md p-1 font-semibold text-red-600 bg-red-100 border border-red-200 hover:text-red-700 hover:bg-red-200"
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
                    class="text-xs rounded-md p-1 font-semibold text-green-600 bg-green-100 border border-green-200 hover:text-green-700 hover:bg-green-200"
                    >Success</span
                  >
                </div>
              </td>

              <td class="text-left text-gray-800">
                <!-- <span>{{ transaction.balance.toLocaleString() }}</span> -->
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

      <!-- Table -->
      <!-- Table -->
      <!-- <div class="flex my-1">
        <table class="table w-full">
          <thead>
            <tr class="header-tr">
              <th class="t-header">#</th>
              <th class="t-header">Date</th>
              <th class="t-header">Description</th>
              <th class="text-right t-header">Amount</th>
              <th class="text-right t-header">Balance</th>
            </tr>
          </thead>
          <thead v-if="loading">
            <tr>
              <th colspan="12" style="padding: 0">
                <div class="w-full bg-primary-300 h-1 p-0 m-0 animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(transaction, idx) in store.transactions" :key="transaction.id" class="body-tr">
              <td class="text-left">{{ idx + 1 }}</td>
              <td class="text-left">
                <span class="text-xs">{{ convertDateTime(transaction.createdAt) }}</span>
              </td>
              <td class="text-left">
                <label class="cursor-pointer font-bold hover:text-primary-700 mx-2">
                  <span class="hover:underline">{{ transaction.description }}</span>
                </label>
              </td>
              <td class="text-left text-green-600">
                <span>{{ transaction.amount }}</span>
              </td>
              <td class="text-left text-gray-800">
                <span>{{ transaction.balance }}</span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-50">
              <td colspan="3" class="text-left font-bold text-gray-600">Totals:</td>
              <td class="text-left font-bold text-gray-800">{{ store.totalAmount }}</td>
              <td class="text-left font-bold text-gray-800">{{ store.totalBalance }}</td>
            </tr>
          </tfoot>
        </table>
      </div> -->
    </div>

    <!-- Modal -->
    <AppModal v-model="modalOpen" xl2>
      <!-- Your modal content goes here -->
      <RequestFloat @floatAllocated="close" :close="close" />
    </AppModal>
  </div>
</template>



<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
