<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted, type Ref } from "vue";
import { useTillStore } from "@/branchmanagerdomain/tills/stores";
import { useNotificationsStore } from "@/stores/notifications";
// import type { Till} from "@/branchmanagerdomain/tills/types";

const tillStore = useTillStore();
const notify = useNotificationsStore();

const loading: Ref<boolean> = ref(false);
const selectedTillId: Ref<string> = ref(""); // ID of the Tillto be edited

const form = reactive({
  id: "",
  name: "",
  location: "",
  manager: "",
  status: "Active",
  tillOperator: "",
  createdAt: "",
});
// const till: Ref<Till| undefined> = reactive({
//   id: "",
//   name: "",
//   location: "",
//   manager: "",
//   status: "",
//   createdAt: "",
// });
const emit = defineEmits(["cancel", "tillEdited"]);
// Fetch the Tilldata from the store
// onMounted(async () => {
//   loading.value = true;

//   // Fetch the list of tills
//   // await tillStore.fetchTills({});
//   await tillStore.fetchTills();

//   // Assuming that a selected TillID is passed to the component (e.g., from a parent component or route)
//   const tillId = selectedTillId.value; // Set this to the appropriate value

//   // Get the Tillto edit
//   const selectedTill = tillStore.tills.value?.find(
//     (b) => b.id === Number(tillId)
//   );
//   // const selectedTill = tillStore.tills?.find(b => b.id === Number(tillId));
//   if (selectedTill) {
//     till.value = { ...selectedTill }; // Clone the Tillto avoid mutating the store directly
//   }

//   loading.value = false;
// });

// Handle form submission to save the updated Till
function submit() {
  const payload = {
    id: till.value.id,
    name: till.value.name,
    location: till.value.location,
    tillOperator: till.value.tillOperator,
    status: till.value.status,
  };

  // Simulate saving the edited Till(assuming it updates the store)
  tillStore.addTill(payload); // If you were adding a new Tillor you can update it via another method
  loading.value = false;
  emit("tillEdited");
  // Show success notification
  notify.success("Till edited successfully");
}

// Handle the cancel action
function cancel() {
  emit("cancel");
}
onMounted(() => {
  //   let data = JSON.parse(<string>localStorage.getItem("provider"))
  // let data = JSON.parse(<string>localStorage.getItem("branchManagerAccount"));
  let data = JSON.parse(<string>localStorage.getItem("till"));

  // form.branch = data.branch;
  form.name = data.name;
  form.tillOperator = data.operator;
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
    <p class="text-xl font-bold">Edit Till Details</p>
    <form @submit.prevent="submit" class="pt-5">
      <!-- TillName -->
      <div class="flex flex-col my-2">
        <label for="name" class="text-neutral-600 text-xs font-bold mb-1"
          >Till Name</label
        >
        <input
          type="text"
          id="name"
          v-model="form.name"
          class="form-element e-input w-full"
          required
        />
      </div>

      <!-- TillLocation -->
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

      <!-- TillManager -->
      <div class="flex flex-col my-2">
        <label for="manager" class="text-neutral-600 text-xs font-bold mb-1"
          >Operator</label
        >
        <input
          type="text"
          id="manager"
          v-model="form.tillOperator"
          class="form-element e-input w-full"
        />
      </div>

      <!-- TillStatus -->
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