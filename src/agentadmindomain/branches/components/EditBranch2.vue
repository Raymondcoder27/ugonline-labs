<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted, type Ref } from "vue";
import { useBranchStore } from "@/agentadmindomain/branches/stores";
import { useNotificationsStore } from "@/stores/notifications";
// import type { Branch } from "@/agentadmindomain/branches/types";

const branchStore = useBranchStore();
const notify = useNotificationsStore();

const loading: Ref<boolean> = ref(false);
const selectedBranchId: Ref<string> = ref(""); // ID of the branch to be edited

// const branch = reactive({
//   id: "",
//   name: "",
//   location: "",
//   manager: "",
//   status: "",
//   createdAt: "",
// });
const form = reactive({
  id: "",
  name: "",
  location: "",
  manager: "",
  status: "Active",
  createdAt: "",
});
// const branch: Ref<Branch | undefined> = reactive({
//   id: "",
//   name: "",
//   location: "",
//   manager: "",
//   status: "",
//   createdAt: "",
// });

const emit = defineEmits(["cancel"]);
// Fetch the branch data from the store
// onMounted(async () => {
//   loading.value = true;

//   // Fetch the list of branches
//   await branchStore.fetchBranches();

//   // Assuming that a selected branch ID is passed to the component (e.g., from a parent component or route)
//   const branchId = selectedBranchId.value; // Set this to the appropriate value

//   // Get the branch to edit
//   const selectedBranch = branchStore.branches.value?.find(
//     (b) => b.id === String(branchId)
//   );
//   // const selectedBranch = branchStore.branches?.find(b => b.id === Number(branchId));
//   if (selectedBranch) {
//     branch.value = { ...selectedBranch }; // Clone the branch to avoid mutating the store directly
//   }

//   loading.value = false;
// });

// Handle form submission to save the updated branch
function submit() {
  const payload = {
    id: branch.value.id,
    name: branch.value.name,
    location: branch.value.location,
    manager: branch.value.manager,
    status: branch.value.status,
  };

  // Simulate saving the edited branch (assuming it updates the store)
  branchStore.addBranch(payload); // If you were adding a new branch or you can update it via another method
  loading.value = false;

  // Show success notification
  notify.success("Branch edited successfully");
}

// Handle the cancel action
function cancel() {
  emit("cancel");
}

onMounted(() => {
  //   let data = JSON.parse(<string>localStorage.getItem("provider"))
  // let data = JSON.parse(<string>localStorage.getItem("branchManagerAccount"));
  let data = JSON.parse(<string>localStorage.getItem("branch"));

  // form.branch = data.branch;
  form.name = data.name;
  form.manager = data.manager;
  // form.firstName = data.firstName;
  // form.lastName = data.lastName;
  // form.email = data.email;
  // form.phone = data.phone;
  // form.username = data.username;
});
</script>

<template>
  <div v-if="loading" class="bg-white py-5">
    <p class="text-xl font-bold">Loading...</p>
  </div>

  <div v-else class="bg-white py-5">
    <p class="text-xl font-bold">Edit Branch</p>
    <form @submit.prevent="submit" class="pt-5">
      <!-- Branch Name -->
      <div class="flex flex-col my-2">
        <label for="name" class="text-neutral-600 text-xs font-bold mb-1"
          >Branch Name</label
        >
        <input
          type="text"
          id="name"
          v-model="form.name"
          class="form-element e-input w-full"
          required
        />
      </div>

      <!-- Branch Location -->
      <!-- <div class="flex flex-col my-2">
        <label for="location" class="text-neutral-600 text-xs font-bold mb-1"
          >Location</label
        >
        <input
          type="text"
          id="location"
          v-model="form.location"
          class="form-element e-input w-full"
          required
        />
      </div> -->

      <!-- Branch Manager -->
      <div class="flex flex-col my-2">
        <label for="manager" class="text-neutral-600 text-xs font-bold mb-1"
          >Manager</label
        >
        <input
          type="text"
          id="manager"
          v-model="form.manager"
          class="form-element e-input w-full"
        />
      </div>

      <!-- Branch Status -->
      <div class="flex flex-col my-2">
        <label for="status" class="text-neutral-600 text-xs font-bold mb-1"
          >Status</label
        >
        <select
          v-model="form.status"
          id="status"
          class="form-element e-input w-full"
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <!-- Action Buttons -->
      <div class="flex my-5">
        <div class="w-6/12 px-1">
          <button
            type="button"
            @click="cancel"
            class="button-outline w-full py-2 text-sm border border-gray-300 rounded"
          >
            <i class="fa-solid fa-ban"></i> Cancel
          </button>
        </div>
        <div class="w-6/12 px-1">
          <button
            type="submit"
            class="button w-full py-2 text-sm bg-blue-500 text-white rounded"
          >
            <i class="fa-solid fa-save"></i> Save Changes
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<!-- <style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/forms.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";

.form-element {
  @apply border rounded-md px-3 py-2 text-sm;
}

.e-input {
  @apply shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-500;
}

.button-outline {
  @apply border border-gray-300 text-gray-700 hover:bg-gray-100;
}

.button {
  @apply bg-blue-500 hover:bg-blue-600 text-white;
}

button {
  @apply transition-colors duration-300;
}
</style> -->


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