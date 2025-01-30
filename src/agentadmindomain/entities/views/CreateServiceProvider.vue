<script setup lang="ts">

import {reactive, type Ref, ref} from "vue";
import {useProviderStore} from "@/agentadmindomain/entities/stores";
import type {CreateServiceProvider} from "@/agentadmindomain/entities/types";
import {useNotificationsStore} from "@/stores/notifications";
import type {ApiError} from "@/types";

const store = useProviderStore()
const loading: Ref<boolean> = ref(false)
const notify =useNotificationsStore()

let form: CreateServiceProvider = reactive({
  name: "",
  displayName: "",
  providerType:"GOVERNMENT",
  displayLogo: null,
  physicalAddress: "",
  inquiryEmail:"",
  inquiryPhoneNumber:"",
  username: ""
})
const emit = defineEmits(['cancel'])

// function onFileChanged($event: Event) {
//   const target = $event.target as HTMLInputElement;
//   if (target && target.files) {
//     form.displayLogo = target.files[0];
//   }
// }
function submit(){
  loading.value = true

  let payload = {
    name:form.name,
    display_name:form.displayName,
    provider_type:form.providerType,
    inquiry_email:form.inquiryEmail,
    inquiry_phone_number:form.inquiryPhoneNumber,
    physical_address:form.physicalAddress,
    username:form.username
  }
  store
      .createProvider(payload)
      .then(() => {
        loading.value = false
        window.location.reload()
        notify.error("Created")
      })
      .catch((error:ApiError) => {
        loading.value = false
        notify.error(error.response.data.message)
      })
}

</script>

<template>
  <div class="bg-white py-5">
    <p class="text-xl font-bold"> Create a Service Provider</p>
    <p class="text-sm text-gray-500">MDAs and/or Companies providing a services consumed by the general public of Uganda.</p>
    <form @submit.prevent="submit" class="pt-5">
      <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Provider Name</label>
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
      </div>

      <div class="flex">
        <div class="cell">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Display Name</label>
          <input type="text" v-model="form.displayName" class="noFocus form-element e-input w-full"
                 required />
        </div>
        <div class="cell">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Username</label>
          <input type="text" v-model="form.username" class="noFocus form-element e-input w-full"
                 required />
        </div>
      </div>

      <p class="text-sm font-bold pt-5">Provider Inquiry Details</p>
      <div class="flex">
        <div class="cell">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Inquiry Email Address</label>
          <input type="email" v-model="form.inquiryEmail" class="noFocus form-element e-input w-full"
                 required />
        </div>
        <div class="cell">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Inquiry Phone Number</label>
          <input type="tel" v-model="form.inquiryPhoneNumber" class="noFocus form-element e-input w-full"
                 required />
        </div>
      </div>
      <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Physical Address</label>
          <textarea v-model="form.physicalAddress" class="noFocus form-element e-input w-full" cols="4"
                    placeholder="Address Description"
                    required />
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