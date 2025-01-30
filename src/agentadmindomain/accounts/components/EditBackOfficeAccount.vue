<script setup lang="ts">

import {onMounted, reactive, type Ref, ref} from "vue";
import {useAccounts} from "@/agentadmindomain/accounts/stores";
// import { useAccountStore } from "@/agentadmindomain/auth/stores";
import type {Account} from "@/agentadmindomain/types";
import {useNotificationsStore} from "@/stores/notifications";
import type {ApiError} from "@/types";

// const store = useProviderStore()
// const accountStore = useAccounts()
const store = useAccounts()
const loading: Ref<boolean> = ref(false)
const notify =useNotificationsStore()

// let form: CreateServiceProvider = reactive({
//   name: "",
//   displayName: "",
//   displayLogo: null,
//   providerType:"GOVERNMENT",
//   physicalAddress: "",
//   inquiryEmail:"",
//   inquiryPhoneNumber:"",
//   username: ""
// })

let form: Account = reactive({
  id: "",
  firstName: "",
  lastName: "",
  middleNames: "",
  // middleName: "",
  idType: "",
  email: "",
  role: "",
  username: "",  // emailVerified: boolean
  // phoneVerified: boolean
  phone: "",
  status: "",
  createdAt: "",
  activatedAt: "",
  blockedAt: "",
})

const emit = defineEmits(['cancel'])

// onMounted(() => {
//   let data = JSON.parse(<string>localStorage.getItem("provider"))

//   form.name = data.name
//   form.displayName = data.displayName
//   form.physicalAddress = data.physicalAddress
//   form.inquiryEmail = data.inquiryEmail
//   form.inquiryPhoneNumber = data.inquiryPhoneNumber
//   form.username = data.username
// })

onMounted(() => {
//   let data = JSON.parse(<string>localStorage.getItem("provider"))
  let data = JSON.parse(<string>localStorage.getItem("backofficeAccount"))

  form.name = data.name
  form.firstName = data.firstName
  form.lastName = data.lastName
  form.middleNames = data.middleNames
  form.email = data.email
  form.phone = data.phone
  form.status = data.status
  form.username = data.username
})

function submit(){
  loading.value = true
  let data = JSON.parse(<string>localStorage.getItem("backofficeAccount"))

  let id = data.id
  let payload = {
    firstName:form.firstName,
    lastName: form.lastName,
    middleNames: form.middleNames,
    email: form.email,
    phone: form.phone,
    status: form.status,
    username:form.username
  }
  store
      .editBackofficeAccount(id, payload)
      .then(() => {
        loading.value = false
        window.location.reload()
        notify.error("Edited")
      })
      .catch((error:ApiError) => {
        loading.value = false
        notify.error(error.response.data.message)
      })
}

</script>

<template>
  <div class="bg-white py-5">
    <p class="text-xl font-bold">Edit BackOffice Account</p>
    <p class="text-sm text-gray-500" v-if="form.name"><b>{{form.name}}</b> provides a services consumed by the general public of Uganda.</p>
    <form @submit.prevent="submit" class="pt-5">
      <!-- <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">First Name</label>
          <input type="text" v-model="form.name" class="noFocus form-element e-input w-full"
                 required />
        </div>
      </div>

      <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Provider Type</label>
          <select v-model="form.providerType" class="noFocus form-element e-input w-full">
            <option value="GOVERNMENT">Government Entity</option>
            <option value="PRIVATE">Private Company</option>
          </select>
        </div>
      </div> -->

      <div class="flex">
        <div class="cell">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">First Name</label>
          <input type="text" v-model="form.firstName" class="noFocus form-element e-input w-full"
                 required />
        </div>
        <div class="cell">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Last Name</label>
          <input type="text" v-model="form.lastName" class="noFocus form-element e-input w-full"
                 required />
        </div>
      </div>

      <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">User Name</label>
          <input v-model="form.username"  class="noFocus form-element e-input w-full"/>
        </div>
      </div>

      <p class="text-sm font-bold pt-5">Account Inquiry Details</p>
      <div class="flex">
        <div class="cell">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Email Address</label>
          <input type="email" v-model="form.email" class="noFocus form-element e-input w-full"/>
        </div>
        <div class="cell">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Phone Number</label>
          <input type="tel" v-model="form.phone" class="noFocus form-element e-input w-full"/>
        </div>
      </div>
      

      <div class="flex my-2 py-5">
        <div class="w-6/12 px-1">
          <button class="button-outline" type="button" @click="emit('cancel')">
            <i class="fa-solid fa-ban"></i> Cancel
          </button>
        </div>
        <div class="w-6/12 px-1">
          <button class="button" type="submit">
            <i class="fa-solid fa-hand-pointer"></i> Submit
            <span class="lds-ring mx-1" v-if="loading">
              <div></div><div></div><div></div><div></div>
            </span>
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/forms.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";

.cell {
  @apply w-6/12 px-1 my-2;
}

.cell-full {
  @apply w-full px-1 my-2;
}
</style>