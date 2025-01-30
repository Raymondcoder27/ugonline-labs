<script setup lang="ts">
import type { CreateAccount } from "@/types";
import { type Ref, ref, reactive } from "vue";
import { useAccounts } from "@/branchmanagerdomain/accounts/stores";
import { useNotificationsStore } from "@/stores/notifications";

let form: CreateAccount = reactive({
  firstName: "",
  lastName: "",
  middleName: "",
  role: "admin",
  username: "",
  phone: "",
});
const notify = useNotificationsStore();
const loading: Ref<boolean> = ref(false);
const emit = defineEmits(["cancel"]);
const store = useAccounts();
function submit() {
  loading.value = true;
  store
    .createAccount(form)
    .then(() => {
      loading.value = false;
      notify.success(
        `An account verification email has been sent to ${form.username.toLowerCase()}.`
      );
      emit("cancel");
    })
    .catch(() => {
      loading.value = false;
    });
}
</script>

<template>
  <div class="bg-white py-5">
    <p class="text-xl font-bold">Add Till</p>
    <p class="text-sm text-gray-500">
      Authorized individuals or businesses registered under a Super Agent to
      provide services to the public on behalf of MDAs.
    </p>
    <form @submit.prevent="submit" class="pt-5">


      <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1"
            >Branch</label
          >
          <select
            autocomplete="off"
            v-model="form.role"
            class="noFocus form-element e-input w-full"
          >
            <option value="admin"></option>
            <option value="public"></option>
          </select>
        </div>
      </div>

      
      <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1"
            >First Name</label
          >
          <input
            autocomplete="off"
            type="text"
            v-model="form.firstName"
            class="noFocus form-element e-input w-full"
            required
          />
        </div>
      </div>
      <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1"
            >Last Name</label
          >
          <input
            autocomplete="off"
            type="text"
            v-model="form.lastName"
            class="noFocus form-element e-input w-full"
            required
          />
        </div>
      </div>
      <!-- <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Middle Name</label>
          <input autocomplete="off" type="text" v-model="form.middleName" class="noFocus form-element e-input w-full" />
        </div>
      </div> -->



      <div class="flex">
        <div class="cell">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1"
            >Email Address</label
          >
          <input
            autocomplete="off"
            type="email"
            v-model="form.username"
            class="noFocus form-element e-input w-full"
            required
          />
        </div>
        <div class="cell">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1"
            >Phone Number</label
          >
          <input
            autocomplete="off"
            type="tel"
            v-model="form.phone"
            class="noFocus form-element e-input w-full"
            required
          />
        </div>
      </div>
<!-- 
      <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1"
            >Services Offered</label
          >
          <select
            autocomplete="off"
            v-model="form.role"
            class="noFocus form-element e-input w-full"
          >
            <option value="admin"></option>
            <option value="public"></option>
          </select>
        </div>
      </div> -->

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
              <div></div>
              <div></div>
              <div></div>
              <div></div>
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
</style>@/branchmanager/accounts/stores