<script setup lang="ts">

// import type { CreateAccount } from "@/types";
import { type Ref, ref, reactive, onMounted, defineEmits } from "vue";
import { useBilling } from "@/agentadmindomain/finances/stores";
import { useNotificationsStore } from "@/stores/notifications";
import { useBranchStore } from "@/agentadmindomain/branches/stores"; 
import type { AllocateFloat } from "@/types";

const branchStore = useBranchStore();

// allocate float form
const form: AllocateFloat = reactive({
  firstName: "",
  branchId: null, 
})


const notify = useNotificationsStore()
const loading: Ref<boolean> = ref(false);
const emit = defineEmits(['cancel', 'floatAllocated'])
const store = useBilling()
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

// submit function to assign float
// function submit() {
//   let payload = {
//     amount: form.firstName,
//     branchId: form.branchId,
//   };
//   loading.value = true;
//   store
//     .allocateFloat(payload)
//     .then(() => {
//       loading.value = false;
//       notify.success(`Float assigned to ${form.branchId}.`);
//       emit("cancel");
//     })
//     .catch(() => {
//       loading.value = false;
//     });
// }


function submit() {
 let payload = {
    amount: form.firstName,
    branchId: form.branchId,
  };
  loading.value = true;
  store.allocateFloat(payload) // Simply add the branch
   notify.success(`Float allocated to ${form.branchId}.`)
  emit("floatAllocated");
  loading.value = false;
}

onMounted(() => {
  // loading.value = true;
  branchStore
    .fetchBranches()
    // .finally(() => (loading.value = false));
});
</script>

<template>
  <div class="bg-white py-5">
    <p class="text-xl font-bold">Transaction Details</p>
    <!-- <p class="text-sm text-gray-500">The allocation of funds by a Super Agent to a designated branch or till to ensure liquidity for transactions and service delivery.</p> -->
    <form @submit.prevent="submit" class="pt-5">

      <!-- <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Amount (UGX)</label>
          <input autocomplete="off" type="number" v-model="form.firstName" class="noFocus form-element e-input w-full"
            required />
        </div>
      </div> -->
      
      <div class="flex">
        <!-- <div class="cell">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Email Address</label>
          <input autocomplete="off" type="email" v-model="form.username" class="noFocus form-element e-input w-full"
            required />
        </div> -->
        <!-- <div class="cell">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Phone Number</label>
          <input autocomplete="off" type="tel" v-model="form.phone" class="noFocus form-element e-input w-full"
            required />
        </div> -->
      </div>

      <!-- <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Select Branch</label>
          <select autocomplete="off" v-model="form.role" class="noFocus form-element e-input w-full">
            <option value="public">Branch</option>
            <option value="public">Branch</option>
          </select>
        </div>
      </div> -->


      <!-- <div class="">
        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1"
          >Select Branch</label
        >
        <select
          v-model="form.branchId"
          class="noFocus form-element e-input w-full"
        >
          <option :value="null">-- Select Branch --</option>
          <option
            v-for="(branch, idx) in branchStore.branches"
            :key="idx"
            :value="branch.name"
          >
            {{ branch.name }}
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
      </div> -->
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