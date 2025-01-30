<script setup lang="ts">
import type { ManagerAccount } from "@/types";
import { type Ref, ref, reactive, onMounted } from "vue";
import { useAccounts } from "@/branchmanagerdomain/accounts/stores";
import { useNotificationsStore } from "@/stores/notifications";
import { defineEmits } from "vue";
import { useTillStore } from "@/branchmanagerdomain/tills/stores";

const tillStore = useTillStore();

const form: ManagerAccount = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  // role: "admin",
  tillId: null,
});

const notify = useNotificationsStore();
const loading: Ref<boolean> = ref(false);
const emit = defineEmits(["cancel", "tillOperatorAccountCreated"]);
const store = useAccounts();
// function submit() {
//   loading.value = true
//   store.createAccount(form)
//     .then(() => {
//       loading.value = false
//       notify.success(`An account verification email has been sent to ${form.username.toLowerCase()}.`)
//       emit("cancel")
//     })
//     .catch(() => {
//       loading.value = false
//     })
// }

// function submit() {
//   let payload = {
//     name: form.name,
//   };
//   loading.value = true;
//   store.addBranch(payload); // Simply add the Till
//   notify.success("Till Created");
//   emit("branchCreated");
//   loading.value = false;
// }

function submit() {
  let payload = {
    firstName: form.firstName,
    lastName: form.lastName,
    email: form.email,
    phone: form.phone,
    // role: form.role,
    tillId: form.tillId,
  };
  loading.value = true;
  store.addManagerAccount(payload); // Simply add the Till
  notify.success("Till Operator Account Created");
  emit("tillOperatorAccountCreated");
  loading.value = false;
}

// onMounted fetch Tilles
onMounted(() => {
  //   let data = JSON.parse(<string>localStorage.getItem("provider"))
  let data = JSON.parse(<string>localStorage.getItem("tillOperatorAccount"));

  form.name = data.name;
  form.firstName = data.firstName;
  form.lastName = data.lastName;
  form.middleNames = data.middleNames;
  form.email = data.email;
  form.phone = data.phone;
  form.status = data.status;
  form.username = data.username;
});

// .finally(() => (loading.value = false));
</script>

<template>
  <div class="bg-white py-5">
    <p class="text-xl font-bold">Edit Till Operator</p>
    <p class="text-sm text-gray-500">
      The individual responsible for overseeing Till operations, managing
      staff, and ensuring smooth service delivery to agents and the public.
    </p>
    <form @submit.prevent="submit" class="pt-5">
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
            v-model="form.email"
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

      <!-- <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Select a Till</label>
          <select autocomplete="off" v-model="form.role" class="noFocus form-element e-input w-full">
            <option value="admin">Till Wakiso</option>
            <option value="public">Till Masaka</option>
          </select>
        </div>
      </div> -->

      <div class="">
        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1"
          >Select Till</label
        >
        <select
          v-model="form.tillId"
          class="noFocus form-element e-input w-full"
        >
          <option :value="null">-- Select Till --</option>
          <option
            v-for="(till, idx) in tillStore.tills"
            :key="idx"
            :value="till.name"
          >
            {{ till.name }}
          </option>
        </select>
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
</style>