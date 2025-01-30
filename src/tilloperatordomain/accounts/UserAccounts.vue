<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { useAccounts } from "@/tilloperatordomain/accounts/stores";
import { onMounted, type Ref, ref, watch, reactive } from "vue";
import CreateAccount from "@/tilloperatordomain/accounts/components/CreateAccount.vue";
import moment from "moment/moment";
import type { IGoFilter } from "@/types"
import { useDebounceFn } from "@vueuse/core"
import type { IResendVerificationPayload, TAccountVerificationType } from "./types"

const store = useAccounts();
const modalOpen: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(15);

// filter
const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page: 1,
  sort: [
    {
      field: "firstname",
      order: "ASC"
    }
  ],
  filter: [
    {
      field: "firstname",
      operand: "",
      operator: "CONTAINS"
    },
    {
      field: "username",
      operand: "",
      operator: "CONTAINS"
    },
    {
      field: "phone",
      operand: "",
      operator: "CONTAINS"
    },
  ]
})

onMounted(() => {
  fetch()
})

function fetch() {
  filter.limit = limit.value
  filter.page = page.value
  store.fetchUserAccounts(filter)
}

function next(){
  page.value += 1
  fetch()
}

function previous(){
  page.value -= 1
  fetch()
}

function open() {
  modalOpen.value = true;
}

function convertDate(date: string) {
  return moment(date).format("DD-MM-YYYY")
}

function close() {
  modalOpen.value = false;
}

const reVerifyForm: IResendVerificationPayload = reactive({
  purpose: "",
  username: ""
})
const resend = (purpose: TAccountVerificationType, username: string) => {
  if (username.length === 0) return
  reVerifyForm.purpose = purpose
  reVerifyForm.username = username
  store.resendAccountVerification(reVerifyForm)
}

const updateFilter = useDebounceFn(
  () => {
    fetch()
  },
  300,
  { maxWait: 5000 }
)

// watch state of the modal
watch(
  () => modalOpen.value,
  (isOpen: boolean) => {
    if (!isOpen) {
      // do something if that's something you're interested in
    }
  },
);

// watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
)
</script>

<template>
  <div class="w-full shadow-lg bg-white rounded p-2 h-full">
    <div class="flex space-x-2 my-1 pt-1 pb-3">
      <div class="flex-grow">
        <div class="grid grid-cols-4 gap-2 bg-gray-10 border border-gray-200 rounded px-2 py-3">
          <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[0].operand"
            class="filter-element e-input" type="text" placeholder="Search by Name" />
          <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[1].operand"
            class="filter-element e-input" type="text" placeholder="Email Address" />
          <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[2].operand"
            class="filter-element e-input" type="text" placeholder="Phone Number" />
          <!-- <select class="filter-element e-select">
            <option :value="null">- Select Status -</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select> -->
        </div>
      </div>
      <div class="flex">

      </div>
    </div>
    <div class="flex my-1">
      <table class="table">
        <thead>
          <tr class="header-tr">
<!--            <th class="t-header">#</th>-->
            <th class="t-header" width="30%">Names</th>
            <th class="t-header">Email</th>
            <th class="t-header">Phone</th>
            <th class="text-center">Status</th>
            <th class="text-center">Activation</th>
            <th class="text-center">Date</th>
            <th class="t-header"></th>
          </tr>
        </thead>
        <tbody>
          <tr :class="account.blockedAt ? 'body-tr-blocked' : 'body-tr'" v-for="(account, idx) in store.userAccounts"
            :key="idx">
<!--            <td width="10px">{{ idx + 1 }}.</td>-->
            <td>
              <label class="font-bold py-1">{{ account.firstName }} {{ account.lastName }}
                {{ account.middleNames }}</label>
              <i class="fa-solid fa-exclamation-triangle" v-if="account.blockedAt"></i>
            </td>
            <td>
              <a class="underline" :href="'smtp:' + account.username">
                {{ account.username }}
              </a>
              <i class="fa-solid fa-exclamation-triangle text-red-600" v-if="!account.emailVerified"></i>
            </td>
            <td>
              {{ account.phone }} <i class="fa-solid fa-exclamation-triangle text-red-600"
                v-if="!account.phoneVerified"></i>
            </td>
            <td class="text-center">
              <label v-if="account.blockedAt" class="text-red-600 font-bold">BLOCKED</label>
              <label v-else class="text-green-600 font-bold">ACTIVE</label>
            </td>
            <td class="text-center">
              <i v-if="account.activatedAt" class="fa-solid fa-check-square text-green-600"></i>
              <i v-else class="fa-solid fa-times-square text-red-600"></i>
            </td>
            <td class="text-center">{{ convertDate(account.createdAt) }}</td>
            <td class="text-center">
              <div class="flex flex-row space-x-2 w-full justify-center" v-if="!account.blockedAt">
                <i class="text-gray-600 fa-solid fa-reply px-1 border border-gray-300 p-1 hover:text-white hover:bg-gray-600"
                  @click="open()"></i>
                <i v-if="!account.emailVerified && !account.blockedAt"
                  class="text-gray-600 fa-solid fa-at px-1 border border-gray-300 p-1 hover:text-white hover:bg-gray-600"
                  @click="resend('email', account.username)" title="Resend Email Code"></i>
                <i v-if="!account.phoneVerified && !account.blockedAt"
                  class="text-gray-600 fa-solid fa-phone-flip px-1 border border-gray-300 p-1 hover:text-white hover:bg-gray-600"
                  @click="resend('phone', account.username)" title="Resend Phone Code"></i>
                <i v-if="account.phoneVerified && !account.activatedAt"
                  class="text-gray-600 fa-solid fa-unlock-keyhole px-1 border border-gray-300 p-1 hover:text-white hover:bg-gray-600"
                  @click="resend('change-password', account.username)" title="Change Password"></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex">
      <div class="w-full">
        <div class="flex" v-if="limit == store.userAccounts?.length || page > 1">
          <button v-if="page > 1" class="pagination-button" @click="previous"> <i class="fa-solid fa-arrow-left"></i></button>
          <button v-else class="pagination-button-inert"><i class="fa-solid fa-arrow-left"></i></button>
          <div class="w-1/12 text-center my-auto">
            <label class="rounded text-white bg-primary-700 px-3 py-1">{{page}}</label>
          </div>
          <button v-if="limit == store.userAccounts?.length - 1 || limit > store.userAccounts?.length" class="pagination-button-inert">
            <i class="fa-solid fa-arrow-right"></i></button>
          <button v-else class="pagination-button" @click="next"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <AppModal v-model="modalOpen" xl2>
    <!-- Put here whatever makes you smile -->

    <!-- Chances are high that you're starting with a form -->
    <CreateAccount @cancel="close" />
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
