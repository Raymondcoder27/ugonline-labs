<script setup lang="ts">

// import type { CreateAccount } from "@/types";
import { type Ref, ref, reactive, onMounted, defineEmits } from "vue";
import { useSubmissions } from "@/tilloperatordomain/submissions/stores";
import { useNotificationsStore } from "@/stores/notifications";
// import { useBranchStore } from "@/tilloperatordomain/branches/stores"; 
import type { AllocateFloat } from "@/types";

// const branchStore = useBranchStore();

// allocate float form
const form: AllocateFloat = reactive({
  firstName: "",
  branchId: null, 
})


const notify = useNotificationsStore()
const loading: Ref<boolean> = ref(false);
const emit = defineEmits(['cancel', 'floatAllocated']);
const store = useSubmissions()
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
   notify.success(`Float assigned to ${form.branchId}.`)
  emit("floatAllocated");
  loading.value = false;
}

// onMounted(() => {
  // loading.value = true;
//   branchStore
    // .fetchBranches()
    // .finally(() => (loading.value = false));
// });
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
        <!-- <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Amount (UGX)</label>
          <input autocomplete="off" type="number" v-model="form.firstName" class="noFocus form-element e-input w-full"
            required />
        </div>   -->
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