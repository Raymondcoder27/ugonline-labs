<!-- <script setup lang="ts">
import { onMounted, reactive, ref, type Ref } from "vue";
import { useBranchStore } from "@/agentadmindomain/branches/stores"; // Adjust the store path if necessary
import { useNotificationsStore } from "@/stores/notifications";
import type { ApiError } from "@/types";

const store = useBranchStore(); // Changed from `useServicesStore` to `useBranchStore`
const loading: Ref<boolean> = ref(false);
const notify = useNotificationsStore();

type BranchForm = {
  id: string;
  name: string;
};

let form: BranchForm = reactive({
  id: "",
  name: "",
});

const emit = defineEmits(["cancel"]);

onMounted(() => {
  loading.value = true;
  store
    .fetchBranches() // Adjust this method if different for branches
    .then(() => (loading.value = false))
    .catch(() => {
      loading.value = false;
    });
});

function submit() {
  let payload = {
    name: form.name,
  };
  store
    .addBranch(payload)
    .then(() => {
      loading.value = false;
      window.location.reload();
      notify.success("Branch Created");
    })
    .catch((error: ApiError) => {
      loading.value = false;
      notify.error(error.response.data.message);
    });
}
</script> -->


<script setup lang="ts">
import { onMounted, reactive, ref, type Ref } from "vue";
import { useBranchStore } from "@/agentadmindomain/branches/stores";
import { useNotificationsStore } from "@/stores/notifications";
import type { ApiError } from "@/types";

const store = useBranchStore();
const loading: Ref<boolean> = ref(false);
const notify = useNotificationsStore();

type BranchForm = {
  id: string;
  name: string;
};

const form = reactive({
  id: "",
  name: "",
});

const emit = defineEmits(["cancel", "branchCreated"]);

onMounted(() => {
  loading.value = true;
  store.fetchBranches().finally(() => (loading.value = false));
});

// function submit() {
//   let payload = {
//     name: form.name,
//   };
//   loading.value = true;
//   store
//     .addBranch(payload)
//     .then(() => {
//       notify.success("Branch Created");
//       emit("created");
//     })
//     .catch((error: ApiError) => {
//       notify.error(error.response.data.message);
//     })
//     .finally(() => {
//       loading.value = false;
//     });
// }

function submit() {
  let payload = {
    name: form.name,
  };
  loading.value = true;
  store.addBranch(payload); // Simply add the branch
  notify.success("Branch Created");
  emit("branchCreated");
  loading.value = false;
}
</script>

<template>
  <div class="bg-white py-5">
    <p class="text-xl font-bold">Add Branch</p>
    <p class="text-sm text-gray-500">
      A designated location managed by a Super Agent to provide services to
      agents and the public.
    </p>
    <form @submit.prevent="submit" class="pt-5">
      <div class="cell-full">
        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1"
          >Name</label
        >
        <input
          type="text"
          v-model="form.name"
          class="noFocus form-element e-input w-full"
          required
        />
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
