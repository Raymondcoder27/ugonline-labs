<script setup lang="ts">
import type { FloatRequest } from "@/branchmanagerdomain/types";
import { type Ref, ref, reactive, watch } from "vue";
import { useAccounts } from "@/branchmanagerdomain/accounts/stores";
import { useNotificationsStore } from "@/stores/notifications";
import { defineEmits } from "vue";
import { useBilling } from "@/branchmanagerdomain/finances/stores";
import { useBalance } from "@/branchmanagerdomain/balance/stores";
// import { RequestFloat } from "../types/index";

const billingStore = useBilling();
const balanceStore = useBalance();

// const form: CreateAccount = reactive({
//   amount: "",
//   branchId: "",
//   description: "",
// });

let form: FloatRequest = reactive({
  // firstName: "",
  // lastName: "",
  // middleName: "",
  // role: "admin",
  // username: "",
  phone: "",
  // amount: 0,
  tillId: "",
  // description: "",
  requestDate: new Date(),
  // tillId: "till-001",
  status: "pending",
});
const notify = useNotificationsStore();
const loading: Ref<boolean> = ref(false);
const emit = defineEmits(["cancel", "floatAllocated"]);
// const store = useAccounts();
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

function submit() {
  const payload = {
    amount: form.amount,
    tillId: form.tillId,
    description: form.description,
  };

  console.log("Submitting payload:", payload);

  loading.value = true;
  billingStore.requestFloat(payload); // API call to allocate float
  // .then(() => {
  billingStore.adjustFloatLedger(payload); // Adjust ledger
  // balanceStore.decreaseTotalBalance(payload.amount); // Update balance
  balanceStore.increaseTotalBalance(payload.amount); // Update balance
  // notify.success(`Float allocated to branch: ${form.branchId}`);
  notify.success(`Float request submitted successfully.`);
  emit("floatAllocated");
  // })
  // .catch((err) => {
  // console.error("Error allocating float:", err);
  // notify.error("Failed to allocate float.");
  // })
  // .finally(() => {
  // loading.value = false;
  // });
}

//watch amount being typed and display the amount the span below
watch(
  () => form.amount,
  (value) => {
    console.log("Amount changed:", value);
  }
);
</script>

<template>
  <div class="bg-white py-5">
    <p class="text-xl font-bold">Request Float</p>
    <p class="text-sm text-gray-500">
      The allocation of funds by a Super Agent to a designated branch or till to
      ensure liquidity for transactions and service delivery.
    </p>
    <form @submit.prevent="submit" class="pt-5">
      <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1"
            >Amount (UGX)</label
          >
          <input
            autocomplete="off"
            type="number"
            v-model.number="form.amount"
            class="noFocus form-element e-input w-full"
            required
          />
          <span v-if="form.amount">
            <pre class="font-semibold text-green-600 py-2"
              >{{ form.amount.toLocaleString() }}/=</pre
            >
          </span>
        </div>
      </div>

      <!-- 
      <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Select a Role</label>
          <select autocomplete="off" v-model="form.role" class="noFocus form-element e-input w-full">
            <option value="admin">Administrator</option>
            <option value="public">Public User</option>
          </select>
        </div>
      </div> -->

      <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1"
            >NOTE</label
          >
          <textarea
            rows="4"
            v-model="form.description"
            class="noFocus form-element e-input w-full"
            required
          />
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