<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { useApplications } from "@/branchmanagerdomain/applications/stores";
import { onMounted, type Ref, ref, watch } from "vue";
import moment from "moment";
import { useProviderStore } from "@/branchmanagerdomain/entities/stores";
import { useServicesStore } from "@/branchmanagerdomain/services/stores";
import type { ApiError } from "@/types";
import { useNotificationsStore } from "@/stores/notifications";
import type { ClientApplication } from "@/branchmanagerdomain/applications/types";

const store = useApplications();
const providerStore = useProviderStore();
const serviceStore = useServicesStore();
const modalOpen: Ref<boolean> = ref(false);
const loading: Ref<boolean> = ref(false);
const hasError: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(12);
let trackingNumber = ref("");
let serviceId = ref("");
let providerId = ref("");
let status = ref("");
const selectedApplication: Ref<ClientApplication | undefined> = ref();
const notify = useNotificationsStore();

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
function view(application: ClientApplication) {
  modalOpen.value = true;
  selectedApplication.value = application;
}

function next() {
  page.value += 1;
  fetch();
}

function previous() {
  page.value -= 1;
  fetch();
}

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

function convertDateTimeNullable(date?: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

function fetchProviderServices(id: string, page: number) {
  serviceStore
    .fetchServicesByProvider(id, page)
    .then(() => (loading.value = false))
    .catch(() => {
      loading.value = false;
    });
}

function statusStyling(status?: string) {
  if (status == "PENDING") {
    return "flex px-2 py-1 rounded bg-gray-500 text-white";
  }

  if (status == "SUBMITTED" || status == "RECEIVED") {
    return "flex px-2 py-1 rounded bg-green-400 text-white";
  }

  if (status == "AWAITING_PAYMENT") {
    return "flex px-2 py-1 rounded bg-warning-700 text-warning-800";
  }

  if (status == "SENT") {
    return "flex px-2 py-1 rounded bg-warning-600 text-white";
  }

  if (status == "APPROVED" || status == "COMPLETED") {
    return "flex px-2 py-1 rounded bg-green-600 text-white";
  }

  if (status == "QUERIED") {
    return "flex px-2 py-1 rounded bg-blue-600 text-whit";
  }

  if (status == "PAYMENT_FAILED") {
    return "flex px-2 py-1 rounded bg-red-500 text-white";
  }

  if (status == "FAILED") {
    return "flex px-2 py-1 rounded bg-red-500 text-white";
  }
}

function statusIcon(status?: string) {
  if (status == "PENDING") {
    return "fa-solid fa-clock-rotate-left mx-1";
  }

  if (status == "SUBMITTED" || status == "RECEIVED") {
    return "fa-solid fa-envelope-circle-check mx-1";
  }

  if (status == "AWAITING_PAYMENT") {
    return "fa-solid fa-clock-rotate-left mx-1";
  }

  if (status == "SENT") {
    return "fa-solid fa-clock-rotate-left mx-1";
  }

  if (status == "APPROVED" || status == "COMPLETED") {
    return "fa-solid fa-check-circle mx-1";
  }

  if (status == "QUERIED") {
    return "fa-solid fa-question-circle mx-1";
  }

  if (status == "PAYMENT_FAILED") {
    return "fa-solid fa-money-bill-transfer mx-1";
  }

  if (status == "FAILED") {
    return "fa-solid fa-times-circle mx-1";
  }
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
      <div class="w-full py-1">
        <i
          class="bg-primary-700 border border-primary-800 text-white p-2 rounded-full fa-solid fa-file-circle-check"
        ></i>
        <label class="text-lg mx-1">Service Applications (Requests)</label>
      </div>
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
        <div class="flex bg-gray-10 border border-gray-200 rounded-l px-2 py-3">
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
        <div class="flex bg-gray-100 rounded-r px-2 py-3">
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
            <!--            <th class="t-header">#</th>-->
            <th class="t-header">Tracking No.</th>
            <th class="t-header" width="400px">Service</th>
            <th class="t-header">Provider</th>
            <th class="t-header">Applicant</th>
            <th class="text-center">Status</th>
            <th class="text-center">Date</th>
            <th class="t-header"></th>
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
            class="body-tr"
            v-for="(application, idx) in store.applications"
            :key="idx"
          >
            <!--          <td>{{ idx + 1 }}.</td>-->
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
              <div :class="statusStyling(application.status)">
                <div class="w-4/12 text-center">
                  <i :class="statusIcon(application.status)"></i>
                </div>
                <div class="w-8/12">
                  <label v-if="application.status == 'SENT'">
                    PROCESSING
                  </label>
                  <label v-else>
                    {{ application.status.replace("_", " ") }}
                  </label>
                </div>
              </div>
            </td>
            <td class="text-center">
              {{ convertDateTime(application.createdAt) }}
            </td>
            <td>
              <button
                class="bg-primary-600 rounded py-1 px-1 text-white hover:bg-primary-700"
                @click="view(application)"
              >
                <i class="fa-solid fa-eye px-2"></i> View Details
              </button>
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
    <div v-if="store.applications !== undefined" class="flex">
      <div class="w-full">
        <div class="flex" v-if="limit == store.applications.length || page > 1">
          <button v-if="page > 1" class="pagination-button" @click="previous">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button v-else class="pagination-button-inert">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <div class="w-1/12 text-center my-auto">
            <label class="rounded text-white bg-primary-700 px-3 py-1">{{
              page
            }}</label>
          </div>
          <button
            v-if="
              limit == store.applications.length - 1 ||
              limit > store.applications.length
            "
            class="pagination-button-inert"
          >
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button v-else class="pagination-button" @click="next">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <AppModal v-model="modalOpen" xl4>
    <div class="flex">
      <div class="w-full">
        <table class="w-full">
          <thead>
            <tr>
              <th>Field</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border border-gray-50">
              <td class="p-1 font-bold">ID</td>
              <td class="p-1">{{ selectedApplication?.id }}</td>
            </tr>
            <tr class="border border-gray-50">
              <td class="p-1 font-bold">Tracking Number</td>
              <td class="p-1">{{ selectedApplication?.trackingNo }}</td>
            </tr>
            <tr class="border border-gray-50">
              <td class="p-1 font-bold">Status</td>
              <td class="p-1">
                <div class="flex">
                  <div class="w-6/12">
                    <div :class="statusStyling(selectedApplication?.status)">
                      <div class="w-4/12 text-center">
                        <i :class="statusIcon(selectedApplication?.status)"></i>
                      </div>
                      <div class="w-8/12">
                        <label v-if="selectedApplication?.status == 'SENT'">
                          PROCESSING
                        </label>
                        <label v-else>
                          {{ selectedApplication?.status.replace("_", " ") }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr class="border border-gray-50">
              <td class="p-1 font-bold">Service</td>
              <td class="p-1">{{ selectedApplication?.serviceName }}</td>
            </tr>
            <tr class="border border-gray-50">
              <td class="p-1 font-bold">Provider</td>
              <td class="p-1">{{ selectedApplication?.providerName }}</td>
            </tr>
            <tr class="border border-gray-50">
              <td class="p-1 font-bold">Payment Reference</td>
              <td class="p-1">
                {{ selectedApplication?.paymentInfo.payment_ref }}
              </td>
            </tr>
            <tr class="border border-gray-50">
              <td class="p-1 font-bold">Date</td>
              <td class="p-1">
                {{ convertDateTimeNullable(selectedApplication?.createdAt) }}
              </td>
            </tr>
            <tr class="border border-gray-50">
              <td class="p-1 font-bold">Payload</td>
              <td class="p-1 bg-gray-50">
                <div class="flex">
                  <div class="w-full rounded">
                    <pre>{{ selectedApplication?.data }}</pre>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppModal>
  <!-- /Modal -->
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
@/branchmanager/applications/stores@/branchmanager/entities/stores@/branchmanager/services/stores@/branchmanager/applications/types