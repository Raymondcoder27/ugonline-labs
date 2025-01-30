<script setup lang="ts">
import { onMounted, reactive, ref, type Ref, watch } from "vue";
import { useServicesStore } from "@/agentadmindomain/services/stores";
import { useProviderStore } from "@/agentadmindomain/entities/stores";
import { useSettingsStore } from "@/agentadmindomain/settings/stores";
import { useNotificationsStore } from "@/stores/notifications";
import type { ApiError } from "@/types";

const store = useServicesStore();
const providerStore = useProviderStore();
const settingsStore = useSettingsStore();
const loading: Ref<boolean> = ref(false);
const notify = useNotificationsStore();

type ServiceForm = {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  providerId: string;
  accessibilityTier: string;
};

let form: ServiceForm = reactive({
  id: "",
  name: "",
  description: "",
  requirements: [],
  providerId: "",
  accessibilityTier: "REGISTERED_USER",
});
const emit = defineEmits(["cancel"]);

onMounted(() => {
  loading.value = true;
  providerStore
    .fetchProviders(1, 40)
    .then(() => (loading.value = false))
    .catch(() => {
      loading.value = false;
    });
});

function submit() {
  let payload = {
    name: form.name,
    description: form.description,
    requirements: form.requirements,
    accessibility_tier: form.accessibilityTier,
    provider_id: form.providerId,
  };
  store
    .createService(payload)
    .then(() => {
      loading.value = false;
      window.location.reload();
      notify.success("Created");
    })
    .catch((error: ApiError) => {
      loading.value = false;
      notify.error(error.response.data.message);
    });
}

function addRequirement() {
  form.requirements.push("");
}

function removeRequirement(idx: number) {
  form.requirements.splice(idx, 1);
}

watch(store.createServiceResponse, (data: any) => {
  if (data.success) {
    window.location.reload();
  }
});
</script>

<template>
  <div class="bg-white py-5">
    <p class="text-xl font-bold">Request Service</p>
    <p class="text-sm text-gray-500">A public good consumed and/or paid for.</p>
    <form @submit.prevent="submit" class="pt-5">
      <!-- <div class="flex">
        <div class="cell-full">
          <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Service Provider</label>
          <select v-model="form.providerId" class="noFocus form-element e-input w-full">
            <option v-for="(provider, idx) in providerStore.providers" :key="idx" :value="provider.id">{{provider.name}}</option>
          </select>
        </div>
      </div> -->

      <!-- <div class="cell"> -->
      <label class="block uppercase text-neutral-600 text-xs font-bold mb-1"
        >Choose Service Provider</label
      >
      <select
        autocomplete="off"
        v-model="form.providerId"
        class="noFocus form-element e-input w-full"
      >
        <option value="URSB">URSB</option>
        <option value="URA">URA</option>
      </select>
      <!-- </div> -->

      <div v-if="form.providerId === 'URSB'">
        <p class="p-3">URSB SERVICES</p>
      </div>

      <div v-else-if="form.providerId === 'URA'">
        <p class="p-3">URA SERVICES</p>
        <div class="bg-gray-100 rounded-md">
          <!-- list of services for URA with check boxes manually -->
          <div class="flex items-center justify-between p-2">
            <div class="flex items-center">
              <input
                type="checkbox"
                class="form-checkbox h-5 w-5 text-gray-600"
              />
              <label class="ml-2 text-gray-700 text-xs">Service 1</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="form-checkbox h-5 w-5 text-gray-600"
              />
              <label class="ml-2 text-gray-700 text-xs">Service 2</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="form-checkbox h-5 w-5 text-gray-600"
              />
              <label class="ml-2 text-gray-700 text-xs">Service 1</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="form-checkbox h-5 w-5 text-gray-600"
              />
              <label class="ml-2 text-gray-700 text-xs">Service 2</label>
            </div>
          </div>
          <div class="flex items-center justify-between p-2">
            <div class="flex items-center">
              <input
                type="checkbox"
                class="form-checkbox h-5 w-5 text-gray-600"
              />
              <label class="ml-2 text-gray-700 text-xs">Service 1</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="form-checkbox h-5 w-5 text-gray-600"
              />
              <label class="ml-2 text-gray-700 text-xs">Service 2</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="form-checkbox h-5 w-5 text-gray-600"
              />
              <label class="ml-2 text-gray-700 text-xs">Service 1</label>
            </div>
            <div class="flex items-center">
              <input
                type="checkbox"
                class="form-checkbox h-5 w-5 text-gray-600"
              />
              <label class="ml-2 text-gray-700 text-xs">Service 2</label>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="flex my-5">
        <div class="w-full">
          <div class="flex">
            <p class="font-bold px-1">Basic User Requirements</p>
          </div>
          <div class="flex">
            <div class="w-9/12" v-if="form.requirements.length > 0">
              <div class="flex" v-for="(requirement, idx) in form.requirements" :key="idx">
                <div class="cell-full">
                  <input type="text" :id="requirement" v-model="form.requirements[idx]" class="noFocus form-element e-input w-full"
                         required />
                </div>
                <i class="fa-solid fa-times text-red-600 pr-2" @click="removeRequirement(idx)"></i>
              </div>
            </div>
            <div class="w-3/12">
              <button class="button mt-2" type="button" @click="addRequirement">
                <i class="fa-solid fa-plus"></i> Add Requirement
              </button>
            </div>
          </div>
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