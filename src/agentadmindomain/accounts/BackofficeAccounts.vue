<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { useAccounts } from "@/agentadmindomain/accounts/stores";
import { onMounted, type Ref, ref, watch, reactive, computed } from "vue";
import CreateAccount from "@/agentadmindomain/accounts/components/CreateAccount.vue";
import moment from "moment";
import type { IGoFilter } from "@/types";
import { useDebounceFn } from "@vueuse/core";
import type {
  IResendVerificationPayload,
  TAccountVerificationType,
  Account,
} from "./types";
import EditBackOfficeAccount from "@/agentadmindomain/accounts/components/EditBackOfficeAccount.vue";


const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(5);
const loading: Ref<boolean> = ref(false);
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

const editModalOpen: Ref<boolean> = ref(false);
const viewModalOpen: Ref<boolean> = ref(false);


  function editBackofficeAccount(backofficeAccount:Account) {
  localStorage.setItem("backofficeAccount", JSON.stringify(backofficeAccount))
  editModalOpen.value = true;
}
function close() {
  modalOpen.value = false;
  viewModalOpen.value = false;
  editModalOpen.value = false;
}



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

const store = useAccounts();
const modalOpen: Ref<boolean> = ref(false);
// const page: Ref<number> = ref(1);
// const limit: Ref<number> = ref(15);
// filter
const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page: 0,
  sort: [
    {
      field: "firstname",
      order: "ASC",
    },
  ],
  filter: [
    {
      field: "firstname",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "username",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "phone",
      operand: "",
      operator: "CONTAINS",
    },
  ],
});

onMounted(() => {
  fetch();
});

function fetch() {
  filter.limit = limit.value;
  filter.page = page.value;
  store.fetchBackofficeAccounts(filter);
}
function open() {
  modalOpen.value = true;
}

// function close() {
//   modalOpen.value = false;
// }

const reVerifyForm: IResendVerificationPayload = reactive({
  purpose: "",
  username: "",
});
const resend = (purpose: TAccountVerificationType, username: string) => {
  if (username.length === 0) return;
  reVerifyForm.purpose = purpose;
  reVerifyForm.username = username;
  store.resendAccountVerification(reVerifyForm);
};

const updateFilter = useDebounceFn(
  () => {
    fetch();
  },
  300,
  { maxWait: 5000 }
);

function convertDate(date: string) {
  return moment(date).format("DD-MM-YYYY");
}

function next() {
  page.value += 1;
  fetch();
}

function previous() {
  page.value -= 1;
  fetch();
}

// watch state of the modal
watch(
  () => modalOpen.value,
  (isOpen: boolean) => {
    if (!isOpen) {
      fetch();
    }
  }
);

// watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
);
</script>

<template>
  <!-- <div class="w-full shadow-lg bg-white rounded p-2 h-full"> -->
  <div class="w-full shadow-lg bg-white rounded p-2 flex flex-col min-h-[66vh]">
    <div class="flex space-x-2 my-1 pt-1 pb-3">
      <div class="flex-grow">
        <div
          class="flex justify-between gap-2 bg-gray-10 border border-gray-200 rounded px-2 py-3"
        >
          <div class="flex items-center">
            <input
              v-if="filter.filter !== undefined"
              input-type="text"
              v-model="filter.filter[0].operand"
              class="filter-element e-input"
              type="text"
              placeholder="Search by Name"
            />
            <input
              v-if="filter.filter !== undefined"
              input-type="text"
              v-model="filter.filter[1].operand"
              class="filter-element e-input"
              type="text"
              placeholder="Email Address"
            />
            <input
              v-if="filter.filter !== undefined"
              input-type="text"
              v-model="filter.filter[2].operand"
              class="filter-element e-input"
              type="text"
              placeholder="Phone Number"
            />
            <!-- <select class="filter-element e-select">
            <option :value="null">- Select Status -</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select> -->
          </div>
          <div class="">
            <button
              @click="modalOpen = true"
              class="button btn-sm my-auto"
              type="button"
            >
              <i class="px-1 fa-solid fa-plus"></i> Add Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex my-1">
      <table class="table">
        <thead>
          <tr class="header-tr">
            <th class="t-header">#</th>
            <th class="t-header" width="30%">Names</th>
            <th class="t-header">Email</th>
            <th class="t-header">Phone</th>
            <!-- <th class="text-center">Role</th> -->
            <th class="text-center">Status</th>
            <th class="text-center">Date</th>
            <th class="text-center">Actions</th>
            <!-- <th class="t-header"></th> -->
          </tr>
        </thead>
        <tbody>
          <!-- <tr :class="account.blockedAt ? 'body-tr-blocked' : 'body-tr'"
            v-for="(account, idx) in store.backofficeAccounts" :key="idx"> -->
          <tr
            :class="account.blockedAt ? 'body-tr-blocked' : 'body-tr'"
            v-for="(account, idx) in paginatedBackofficeAccounts"
            :key="idx"
          >
            <td width="10px">{{ idx + 1 }}.</td>
            <td>
              <label class="font-bold py-1">
                {{ account.firstName }} {{ account.lastName }}
                {{ account.middleNames }}
              </label>
              <i
                class="fa-solid fa-exclamation-triangle"
                v-if="account.blockedAt"
              ></i>
            </td>
            <td>
              <a class="underline" :href="'smtp:' + account.username">
                {{ account.email }}
              </a>
              <i
                class="fa-solid fa-exclamation-triangle text-red-600"
                v-if="!account.emailVerified"
              ></i>
            </td>
            <td>
              {{ account.phone }}
              <i
                class="fa-solid fa-exclamation-triangle text-red-600"
                v-if="!account.phoneVerified"
              ></i>
            </td>
            <!-- <td class="text-center">
              {{ account.role }}
            </td> -->
            <td class="text-center">
              <label v-if="account.blockedAt" class="text-red-600 font-bold"
                >BLOCKED</label
              >
              <label
                v-else
                class="text-green-600 text-xs bg-green-100 border border-green-200 rounded-sm px-1 py-0.5 font-bold"
                >Active</label
              >
            </td>
            <!-- <td class="text-center">
              <i v-if="account.activatedAt" class="fa-solid fa-check-square text-green-600"></i>
              <i v-else class="fa-solid fa-times-square text-red-600"></i>
            </td> -->
            <td class="text-center">{{ convertDate(account.createdAt) }}</td>
            <td class="text-center">
              <div
                class="flex flex-row space-x-2 w-full justify-center"
                v-if="!account.blockedAt"
              >
                <!-- <i class="text-gray-600 fa-solid fa-pencil px-1 border border-gray-300 p-1 hover:text-white hover:bg-gray-600"
                  @click="open()"></i>
                  <i class="text-gray-600 fa-solid fa-trash px-1 border border-gray-300 p-1 hover:text-white hover:bg-gray-600"
                  @click="open()"></i> -->
                <!-- <span
                    class="bg-blue-600 rounded-md font-semibold text-white px-1 py-1 hover:bg-blue-800"
                    @click="viewDetails(account.id)"
                  > -->
                <!-- <span
                  class="bg-blue-600 rounded-md font-semibold text-white px-1 py-1 hover:bg-blue-800"
                  @click="modalOpen = true"
                > -->
                <span
                  class="bg-blue-600 rounded-md font-semibold text-white px-1 py-1 hover:bg-blue-200 hover:text-blue-800"
                  @click="editBackofficeAccount(account)"
                >
                  <i class="fa fa-eye"></i>
                  View Details
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex">
      <!-- <div class="w-full">
        <div class="flex" v-if="limit == store.backofficeAccounts?.length || page > 1">
          <button v-if="page > 1" class="pagination-button" @click="previous"> <i class="fa-solid fa-arrow-left"></i></button>
          <button v-else class="pagination-button-inert"><i class="fa-solid fa-arrow-left"></i></button>
          <div class="w-1/12 text-center my-auto">
            <label class="rounded text-white bg-primary-700 px-3 py-1">{{page}}</label>
          </div>
          <button v-if="limit == store.backofficeAccounts?.length - 1 || limit > store.backofficeAccounts?.length" class="pagination-button-inert">
            <i class="fa-solid fa-arrow-right"></i></button>
          <button v-else class="pagination-button" @click="next"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div> -->
      <!-- <td>
        <span
                    class="bg-blue-600 rounded-md font-semibold text-white px-1 py-1 hover:bg-blue-800"
                    @click="confirm(transaction)"
                  >
                  <i class="fa fa-redo"></i>
                    Resubmit
                  </span>
      </td> -->
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

  <!-- Modal -->
  <AppModal v-model="modalOpen" xl2>
    <CreateAccount @backOfficeAccountCreated="close" @cancel="close" />
  </AppModal>
  <!-- /Modal -->

  <AppModal v-model="editModalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <EditBackOfficeAccount @cancel="close"/>
    <!-- That's also okay -->
  </AppModal>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
