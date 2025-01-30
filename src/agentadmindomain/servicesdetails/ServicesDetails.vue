<script setup lang="ts">
interface TableItem {
  name: string;
  type: string;
  amount: string;
}

const tableData: TableItem[] = [
  { name: 'Data Update', type: 'Government', amount: 'Fee' },
  { name: 'Name Reservation/Business Name Registration fees', type: 'Government', amount: 'UGX. 35,000' },
  { name: 'Change of Particulars for Business Name', type: 'Government', amount: 'UGX. 35,000' },
  { name: 'Search Fees for Business Name', type: 'Private', amount: 'UGX. 35,000' },
  { name: 'Certification fees for Particulars of a Business Name', type: 'Government', amount: 'UGX. 35,000' },
  { name: 'Certification fees for a Certificate of Registration for a Business Name', type: 'Private', amount: 'UGX. 35,000' },
  { name: 'Fees for Cancellation of an Entry', type: 'Government', amount: 'UGX. 35,000' },
  { name: 'Fees for Change of Address', type: 'Government', amount: 'UGX. 35,000' },
  { name: 'Rectification Fees of a Register', type: 'Government', amount: 'UGX. 35,000' },
  { name: 'Fees for Notice of Cessation', type: 'Private', amount: 'UGX. 35,000' },
];
</script>


<template>
  <div class="flex flex-col w-full shadow-lg bg-white rounded p-2 h-full">
    <div class="flex">
      <div class="w-full py-1">
        <!-- <i class="bg-primary-700 border border-primary-800 text-white p-2 rounded-full fa-solid fa-list"></i> -->
        <label class="text-xl mx-1 font-semibold">Services We Provide</label>
        <p class="ml-1">
          Detailing all the services we offer with small notes on each but also
          the price for all
        </p>

        <div class="row">
          <div class="mx-auto my-3 col-12">
            <table class="w-full leading-normal text-sm">
              <thead>
                <tr class="border-b border-t border-gray-400 h-10">
                  <th class="px-4 py-2 text-left t-header">Name</th>
                  <th class="px-4 py-2 text-left t-header">Type</th>
                  <th class="px-4 py-2 text-right t-header">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in tableData"
                  :key="index"
                  :class="
                    index % 2 === 0
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-200' + ' border-t border-gray-400'
                  "
                >
                  <td class="px-4 py-2 text-gray-600">{{ item.name }}</td>
                  <td class="px-4 py-2 text-gray-600 capitalize">
                    {{ item.type }}
                  </td>
                  <td class="px-4 py-2 text-right mr-2">{{ item.amount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";

.cell {
  @apply w-6/12 px-1 my-2;
}

.cell-full {
  @apply w-full px-1 my-2;
}

.tab {
  @apply cursor-pointer p-2 border-b border-gray-300 text-sm text-center;
}

.tab-active {
  @apply cursor-pointer p-2 border-b-4 border-primary-700 text-sm text-center;
}
</style>
