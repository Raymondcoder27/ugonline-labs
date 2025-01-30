<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { useApplications } from "@/tilloperatordomain/apisubmissions/stores";
import { onMounted, type Ref, ref, watch, computed } from "vue";
import moment from "moment";
import { useProviderStore } from "@/tilloperatordomain/providers/stores";
import { useServicesStore } from "@/tilloperatordomain/services/stores";
import type { ApiError } from "@/types";
import ApplicationDetails from "@/tilloperatordomain/apisubmissions/views/ApplicationDetails.vue";
import { useNotificationsStore } from "@/stores/notifications";
import TableLoader from "@/components/TableLoader.vue";

const store = useApplications();
const providerStore = useProviderStore();
const serviceStore = useServicesStore();
const modalOpen: Ref<boolean> = ref(false);
const loading: Ref<boolean> = ref(false);
const hasError: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
// const limit: Ref<number> = ref(15);
const limit: Ref<number> = ref(7);
let trackingNumber = ref("");
let serviceId = ref("");
let providerId = ref("");
let status = ref("");
const notify = useNotificationsStore();

// const totalRecords = computed(() => store.submissions.length); // Total backofficeAccounts
const totalRecords = computed(() => store.applications?.length); // Total backofficeAccounts
const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value));
// const submissions: Ref<any[]> = ref([]);

const pageInput = ref(1);
// const changePageSize = () => {
//   page.value = 1;
//   // fetchSubmissions();
//   fetchApplications();
// };
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

onMounted(() => {
  fetch();
  providerStore
    .fetchProviders(1, 20)
    .then(() => (loading.value = false))
    .catch(() => {
      loading.value = false;
    });

  store
    .fetchApplicationStats(true)
    .then(() => (loading.value = false))
    .catch((error: ApiError) => {
      loading.value = false;
      notify.error(error.response.data.message);
    });
});

function fetch() {
  loading.value = true;
  store
    .fetchApplications(
      trackingNumber.value,
      serviceId.value,
      providerId.value,
      status.value,
      page.value,
      limit.value
    )
    .then(() => (loading.value = false))
    .catch((error: ApiError) => {
      loading.value = false;
      notify.error(error.response.data.message);
    });
}
function open() {
  modalOpen.value = true;
}

function next() {
  page.value += 1;
  fetch();
}

function previous() {
  page.value -= 1;
  fetch();
}

function convertDate(date: string) {
  return moment(date).format("DD-MM-YYYY");
}

function fetchProviderServices(id: string, page: number) {
  serviceStore
    .fetchServicesByProvider(id, page)
    .then(() => (loading.value = false))
    .catch(() => {
      loading.value = false;
    });
}

watch(
  () => providerId.value,
  (id: any) => {
    fetchProviderServices(id, 0);
  },
  { deep: true }
);

watch(
  () => modalOpen.value,
  (isOpen: boolean) => {
    if (!isOpen) {
      // do something if that's something you're interested in
    }
  }
);

watch(
  () => serviceId.value,
  () => {
    fetch();
  },
  { deep: true }
);
watch(
  () => providerId.value,
  () => {
    fetch();
  }
);
watch(
  () => status.value,
  () => {
    fetch();
  }
);
</script>

<template>
  <div class="w-full shadow-lg bg-white rounded p-2">
    <div class="flex">
      <!-- <div class="w-full py-1">
        <i
          class="bg-primary-700 border border-primary-800 text-white p-2 rounded-full fa-solid fa-file-circle-check"
        ></i>
        <label class="text-lg mx-1">Service Applications (Requests)</label>
      </div> -->
    </div>
    <div class="flex my-4" v-if="store.applicationStatistics">
      <div
        class="w-2/12 p-3 rounded mx-1 text-center border border-primary-600 bg-primary-50"
      >
        <label class="text-xl font-bold">{{
          store.applicationStatistics?.pending
        }}</label>
        <p class="text-sm">Pending</p>
      </div>
      <div
        class="w-2/12 p-3 rounded mx-1 text-center border border-primary-600 bg-primary-50"
      >
        <label class="text-xl font-bold">{{
          store.applicationStatistics?.awaitingPayment
        }}</label>
        <p class="text-sm">Awaiting Payment</p>
      </div>
      <div
        class="w-2/12 p-3 rounded mx-1 text-center border border-primary-600 bg-primary-50"
      >
        <label class="text-xl font-bold">{{
          store.applicationStatistics?.paymentProcessing
        }}</label>
        <p class="text-sm">Payment Processing</p>
      </div>
      <div
        class="w-2/12 p-3 rounded mx-1 text-center border border-primary-600 bg-primary-50"
      >
        <label class="text-xl font-bold">{{
          store.applicationStatistics?.paymentFailed
        }}</label>
        <p class="text-sm">Payment Failed</p>
      </div>
      <div
        class="w-2/12 p-3 rounded mx-1 text-center border border-primary-600 bg-primary-50"
      >
        <label class="text-xl font-bold">{{
          store.applicationStatistics?.paymentConfirmed
        }}</label>
        <p class="text-sm">Payment Confirmed</p>
      </div>
      <div
        class="w-2/12 p-3 rounded mx-1 text-center border border-primary-600 bg-primary-50"
      >
        <label class="text-xl font-bold">{{
          store.applicationStatistics?.submitted
        }}</label>
        <p class="text-sm">Submitted</p>
      </div>
      <div
        class="w-2/12 p-3 rounded mx-1 text-center border border-primary-600 bg-primary-50"
      >
        <label class="text-xl font-bold">{{
          store.applicationStatistics?.sent
        }}</label>
        <p class="text-sm">Sent</p>
      </div>
      <div
        class="w-2/12 p-3 rounded mx-1 text-center border border-primary-600 bg-primary-50"
      >
        <label class="text-xl font-bold">{{
          store.applicationStatistics?.total
        }}</label>
        <p class="text-sm">Total</p>
      </div>
    </div>
    <div class="flex my-1 pt-1 pb-3">
      <div class="w-9/12">
        <div class="flex bg-gray-10 border border-gray-200 rounded px-2 py-3">
          <input
            class="filter-element e-input w-3/12"
            type="text"
            v-model="trackingNumber"
            placeholder="Search by Tracking No"
            @change="fetch"
          />
          <select
            class="filter-element w-3/12 e-select"
            v-model="providerId"
            @change="fetch"
          >
            <option value="">- Select Provider -</option>
            <option
              v-for="(provider, idx) in providerStore.providers"
              :key="idx"
              :value="provider.id"
            >
              {{ provider.name }}
            </option>
          </select>
          <select
            class="filter-element w-3/12 e-select"
            v-model="serviceId"
            @change="fetch"
          >
            <option value="">- Select Service -</option>
            <option
              v-for="(service, idx) in serviceStore.services"
              :key="idx"
              :value="service.id"
            >
              {{ service.name }}
            </option>
          </select>
          <select
            class="filter-element w-2/12 e-select"
            v-model="status"
            @change="fetch"
          >
            <option value="">- Select Status -</option>
            <option value="AWAITING_PAYMENT">Awaiting Payment</option>
            <option value="PAYMENT_PROCESSING">Processing Payment</option>
            <option value="PAYMENT_FAILED">Payment Failed</option>
            <option value="SENT">Submitted</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="QUERIED">Queried</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>
      <div class="w-3/12">
        <div class="flex bg-gray-100 rounded px-2 py-3">
          <input class="filter-element e-input w-6/12" type="date" />
          -
          <input class="filter-element e-input w-6/12" type="date" />
        </div>
      </div>
    </div>
    <div class="flex my-1">
      <table class="table">
        <thead>
          <tr class="header-tr">
            <th class="t-header">#</th>
            <th class="t-header">Tracking No.</th>
            <th class="t-header">Service</th>
            <th class="t-header">Provider</th>
            <th class="t-header">Applicant</th>
            <th class="text-center">Status</th>
            <th class="t-header">Date</th>
            <th class="t-header">Actions</th>
          </tr>
          <tr>
            <th colspan="12">
              <TableLoader v-if="loading" />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="body-tr"
            v-for="(application, idx) in store.applications"
            :key="idx"
          >
            <td>{{ idx + 1 }}.</td>
            <td>
              <span class="font-bold hover:underline text-primary-700">
                {{ application.trackingNo }}
              </span>
            </td>
            <td>
              <label class="font-bold">{{ application.serviceName }}</label>
            </td>
            <td>{{ application.providerName }}</td>
            <td>
              <label class="text-primary-700 underline"
                >@{{ application.username }}</label
              >
            </td>
            <td>
              <div
                v-if="application.status === 'PENDING'"
                class="pill-inert text-center"
              >
                <p>{{ application.status }}</p>
              </div>
              <div
                v-if="application.status === 'AWAITING_PAYMENT'"
                class="pill-idle text-center"
              >
                <p>{{ application.status.replace("_", " ") }}</p>
              </div>
              <div
                v-if="application.status === 'SENT'"
                class="pill-semi-active text-center"
              >
                <p>SUBMITTED</p>
              </div>
              <div
                v-if="application.status === 'APPROVED'"
                class="pill-active text-center"
              >
                <p>{{ application.status }}</p>
              </div>
              <div
                v-if="application.status === 'QUERIED'"
                class="pill-warning text-center"
              >
                <p>{{ application.status }}</p>
              </div>
              <!-- <div
                v-if="
                  application.status === 'REJECTED' ||
                  application.status === 'PAYMENT_FAILED'
                "
                class="pill-danger text-center"
              >
                <p>{{ application.status }}</p>
              </div> -->
              <div
                v-if="
                  application.status === 'FAILED' ||
                  application.status === 'PAYMENT_FAILED'
                "
                class="pill-danger text-center"
              >
                <p>{{ application.status }}</p>
              </div>
            </td>
            <td>{{ convertDate(application.createdAt) }}</td>
            <!-- <td class="text-right">
              <i class="fa-solid fa-eye px-1" @click="open()"></i>
            </td> -->
            <td>
              <div class="" v-if="application.status === 'FAILED'">
                <span
                  class="bg-blue-600 rounded-md font-semibold text-white px-1 py-1 hover:bg-blue-200 hover:text-blue-700"
                  @click="confirm(application)"
                >
                  <i class="fa fa-redo"></i>
                  Resubmit
                </span>
              </div>
              <div class="" v-if="application.status === 'SENT'">
                <span
                  class="bg-green-500 rounded-md font-semibold text-white px-1 py-1 hover:bg-green-700"
                  @click="confirm(application)"
                >
                  <i class="fa fa-eye"></i>
                  View Details
                </span>
              </div>
            </td>
          </tr>
          <tr>
            <td
              colspan="12"
              class="text-center bg-gray-50"
              v-if="hasError || !store.applications"
            >
              <label>No applications found</label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex">
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
                'opacity-50 cursor-not-allowed': applications?.length < limit,
              }"
              :disabled="applications?.length < limit"
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
      <!-- <div class="w-full">
        <div
          class="flex"
          v-if="limit == store.applications?.length || page > 1"
        >
          <button v-if="page > 1" class="pagination-button" @click="previous">
            <i class="fa-solid fa-arrow-left"></i> Previous
          </button>
          <button v-else class="pagination-button-inert" @click="next">
            <i class="fa-solid fa-arrow-left"></i> Previous
          </button>
          <div class="w-1/12 text-center my-auto">
            <label class="rounded text-white bg-primary-700 px-3 py-1">{{
              page
            }}</label>
          </div>
          <button
            v-if="limit == store.applications?.length"
            class="pagination-button"
            @click="next"
          >
            Next <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button v-else class="pagination-button-inert" @click="next">
            Next <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div> -->
    </div>
  </div>

  <!-- Modal -->
  <AppModal v-model="modalOpen" xl2>
    <!-- Put here whatever makes you smile -->

    <!-- Chances are high that you're starting with a form -->
    <ApplicationDetails />
    <!-- That's also okay -->
  </AppModal>
  <!-- /Modal -->
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
