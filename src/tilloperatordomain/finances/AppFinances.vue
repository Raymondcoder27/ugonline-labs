
<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { ref, Ref, watch } from 'vue';
import moment from 'moment';
import CreateTransaction from "@/tilloperatordomain/finances/components/CreateTransaction.vue"

interface Transaction {
  id: number;
  trackingNumber: string;
  prn: string;
  service: string;
  amount: number;
  status: string;
  date: string;
}

const transactions = ref<Transaction[]>([
  { id: 1, trackingNumber: 'M241128-0002', prn: '2250000039829', service: 'SPECIAL LICENSE', amount: 50000, status: 'SUCCESS', date: '2024-11-28T10:17:00' },
  { id: 2, trackingNumber: 'M241127-0008', prn: '2250000039915', service: 'MARRIAGE', amount: 50000, status: 'FAILED', date: '2024-11-28T10:09:00' },
  { id: 3, trackingNumber: 'M241126-0005', prn: '2250000039921', service: 'LICENSE RENEWAL', amount: 100000, status: 'PENDING', date: '2024-11-27T14:25:00' }
]);

const filters = ref({ search: '', status: '', startDate: '', endDate: '' });
const loading = ref(false);
const page = ref(1);
const limit = 10;

function statusClass(status: string) {
  return status === 'SUCCESS'
    ? 'text-green-600 bg-green-50 p-1 rounded'
    : status === 'FAILED'
    ? 'text-red-600 bg-red-50 p-1 rounded'
    : 'text-yellow-600 bg-yellow-50 p-1 rounded';
}

function filteredTransactions() {
  return transactions.value.filter((t) => {
    return (
      (!filters.value.search || t.trackingNumber.includes(filters.value.search)) &&
      (!filters.value.status || t.status === filters.value.status) &&
      (!filters.value.startDate || moment(t.date).isSameOrAfter(filters.value.startDate)) &&
      (!filters.value.endDate || moment(t.date).isSameOrBefore(filters.value.endDate))
    );
  });
}

function clearFilters() {
  filters.value = { search: '', status: '', startDate: '', endDate: '' };
}

function formatAmount(amount: number) {
  return amount.toLocaleString();
}

function convertDateTime(date: string) {
  return moment(date).format('DD-MM-YYYY HH:mm:ss');
}

function previous() {
  if (page.value > 1) page.value--;
}

function next() {
  page.value++;
}

// Add Transaction modal logic
// function openAddTransactionModal() {
//   console.log('Opening Add Transaction Modal');
// }

const openAddTransactionModal: Ref<boolean> = ref(false) 

  function close() {
  openAddTransactionModal.value = false;
  // editTransactionModal.value = false;
  // specTransactionModal.value = false;
}

function viewDetails(transaction: Transaction) {
  console.log('View details:', transaction);
}

function copy(trackingNumber: string) {
  navigator.clipboard.writeText(trackingNumber);
}


// watch state of the modal
watch(
  () => openAddTransactionModal.value,
  (isOpen: boolean) => {
    if (!isOpen) {
      // do something if that's something you're interested in
    }
  },
);
</script>


<template>
  <div class="w-full shadow-lg bg-white rounded-lg p-6">
    <div class="flex justify-between items-center py-3">
      <div class="text-primary-700 flex items-center">
        <i class="bg-primary-100 border border-primary-200 p-2 rounded-full fa-solid fa-money-bill"></i>
        <label class="text-xl mx-2 font-semibold">Transactions</label>
      </div>
      <!-- Add Transaction button -->
      <!-- <button class="button btn-sm ml-96 pl-96 px-4 py-2 rounded-md text-white bg-secondary-500 hover:bg-secondary-600 transition-colors" @click="openAddTransactionModal">
        <i class="fa-solid fa-plus-circle mr-2"></i> Add Transaction
      </button> -->
      <div class="flex items-center">
      <button class="button btn-sm ml-96 pl-96 px-4 py-2 rounded-md text-white bg-secondary-500 hover:bg-secondary-600 transition-colors" @click="openAddTransactionModal = true">
        <i class="fa-solid fa-plus-circle mr-2"></i> Add Transaction
      </button>
      </div>
    </div>

    <!-- Filter Section -->
    <div class="flex justify-between mb-6">
      <div class="grid grid-cols-4 gap-4 w-full max-w-xl">
        <input class="filter-element e-input w-full py-2 px-4 rounded-md border border-gray-300" type="text" placeholder="Search by Tracking Number" v-model="filters.search" />
        <select class="filter-element e-select w-full py-2 px-4 rounded-md border border-gray-300" v-model="filters.status">
          <option value="">- Select Status -</option>
          <option value="PENDING">Pending</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
        </select>
        <input type="date" class="filter-element e-input w-full py-2 px-4 rounded-md border border-gray-300" v-model="filters.startDate" />
        <input type="date" class="filter-element e-input w-full py-2 px-4 rounded-md border border-gray-300" v-model="filters.endDate" />
      </div>
      <div class="flex items-center">
        <button class="button btn-sm w-auto px-4 py-2 rounded-md text-white bg-secondary-500 hover:bg-secondary-600 transition-colors" @click="clearFilters">
          <i class="fa-solid fa-filter-circle-xmark mr-2"></i> Clear Filters
        </button>
      </div>
    </div>

    <!-- Transactions Table -->
    <div>
      <table class="min-w-full table-auto border-separate border-spacing-0">
        <thead>
          <tr class="bg-gray-100">
            <th class="t-header text-left py-3 px-4 border-b">#</th>
            <th class="t-header text-left py-3 px-4 border-b">Tracking Number</th>
            <th class="t-header text-left py-3 px-4 border-b">TN (Transaction Number)</th>
            <th class="t-header text-left py-3 px-4 border-b">Agent</th>
            <th class="t-header text-left py-3 px-4 border-b">Branch</th>
            <th class="t-header text-left py-3 px-4 border-b">Service</th>
            <th class="t-header text-right py-3 px-4 border-b">Amount (UGX)</th>
            <th class="t-header text-center py-3 px-4 border-b">Status</th>
            <th class="t-header text-left py-3 px-4 border-b">Date</th>
            <th class="t-header text-center py-3 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(transaction, index) in filteredTransactions" :key="transaction.id" class="bg-white border-b hover:bg-gray-50">
            <td class="py-2 px-4">{{ index + 1 }}.</td>
            <td class="py-2 px-4">
              <span class="hover:underline text-blue-600 cursor-pointer">{{ transaction.trackingNumber }}</span>
            </td>
            <td class="py-2 px-4">{{ transaction.prn }}</td>
            <td class="py-2 px-4">{{ transaction.service }}</td>
            <td class="py-2 px-4 text-right">{{ formatAmount(transaction.amount) }}</td>
            <td :class="statusClass(transaction.status)" class="py-2 px-4 text-center">
              {{ transaction.status }}
            </td>
            <td class="py-2 px-4">{{ convertDateTime(transaction.date) }}</td>
            <td class="py-2 px-4 text-center">
              <i class="fa-solid fa-eye p-2 mx-1 text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700 rounded cursor-pointer" @click="viewDetails(transaction)"></i>
              <i class="fa-solid fa-copy p-2 mx-1 text-gray-600 bg-gray-50 border border-gray-200 hover:text-primary-700 rounded cursor-pointer" @click="copy(transaction.trackingNumber)"></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="page > 1" class="flex justify-between items-center mt-6">
      <button class="pagination-button px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors" @click="previous" :disabled="page === 1">
        <i class="fa-solid fa-arrow-left"></i> Previous
      </button>
      <label class="text-white bg-primary-700 px-3 py-2 rounded-md">{{ page }}</label>
      <button class="pagination-button px-4 py-2 text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors" @click="next" :disabled="filteredTransactions.length < limit">
        Next <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  </div>



    <!-- Modal -->
    <AppModal v-model="openAddTransactionModal" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <CreateTransaction @cancel="close" />
    <!-- That's also okay -->
  </AppModal>
</template>


<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
</style>

