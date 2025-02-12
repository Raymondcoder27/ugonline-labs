<script setup lang="ts">
import { onMounted, reactive, ref, type Ref, watch, defineEmits } from "vue";
import { useServicesStore } from "@/tilloperatordomain/services/stores";
import { useProviderStore } from "@/tilloperatordomain/entities/stores";
import { useSettingsStore } from "@/tilloperatordomain/settings/stores";
import { useNotificationsStore } from "@/stores/notifications";
import type { ApiError } from "@/types";

const store = useServicesStore();
const providerStore = useProviderStore();
const settingsStore = useSettingsStore();
const loading: Ref<boolean> = ref(false);
const notify = useNotificationsStore();

type ServiceForm = {
  companyName: string;
  date: string;
  address: string;
  amount: number;
  presentedBy: string;
  directors: { name: string; position: string }[];
};

let form: ServiceForm = reactive({
  companyName: "",
  date: "",
  address: "",
  amount: 0,
  presentedBy: "",
  directors: [],
});

const emit = defineEmits(["cancel", "requestSubmitted"]);

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
    companyName: form.companyName,
    date: form.date,
    address: form.address,
    amount: form.amount,
    presentedBy: form.presentedBy,
    directors: form.directors,
  };

  store
    .submitServiceRequest(payload)
    .then(() => {
      loading.value = false;
      notify.success("Created");
      emit("requestSubmitted")
      // window.location.reload();
    })
    .catch((error: ApiError) => {
      loading.value = false;
      notify.error(error.response.data.message);
    });
}

function addDirector() {
  form.directors.push({ name: "", position: "" });
}

function removeDirector(index: number) {
  form.directors.splice(index, 1);
}

watch(store.createServiceResponse, (data: any) => {
  if (data.success) {
    window.location.reload();
  }
});
</script>

<template>
  <form @submit.prevent="submit">
    <!-- Section 1: Company Information -->
    <div class="flex section">
      <div class="w-full">
        <div class="flex my-auto">
          <div class="w-10/12 section-title pr-4">
            <span>Company Information</span>
            <hr />
          </div>
        </div>

        <div class="flex">
          <div class="w-6/12 mr-2">
            <div class="cell">
              <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Company Name</label>
              <input type="text" v-model="form.companyName" class="noFocus form-element e-input w-full" required />
            </div>
          </div>

          <div class="w-6/12 mr-2">
            <div class="cell">
              <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Date</label>
              <input type="date" v-model="form.date" class="noFocus form-element e-input w-full" required />
            </div>
          </div>

          <div class="w-6/12 mr-2">
            <div class="cell">
              <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Address</label>
              <input type="text" v-model="form.address" class="noFocus form-element e-input w-full" required />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: Financial Information -->
    <div class="flex section">
      <div class="w-full">
        <div class="flex my-auto">
          <div class="w-10/12 section-title pr-4">
            <span>Total Amount of the Indebtedness</span>
            <hr />
          </div>
        </div>

        <div class="flex">
          <div class="w-6/12 mr-2">
            <div class="cell">
              <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Amount</label>
              <input type="number" v-model="form.amount" class="noFocus form-element e-input w-full" required />
            </div>
          </div>

          <div class="w-6/12 mr-2">
            <div class="cell">
              <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Presented By</label>
              <input type="text" v-model="form.presentedBy" class="noFocus form-element e-input w-full" required />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 3: Directors List -->
    <div class="flex section">
      <div class="w-full">
        <div class="flex my-auto">
          <div class="w-10/12 section-title pr-4">
            <span>Particulars of the Directors of the Company</span>
            <hr />
          </div>
          <div class="w-2/12 my-auto">
            <button class="action-button-sm" type="button" @click="addDirector">
              <i class="px-1 fa-solid fa-plus"></i> Add Entry
            </button>
          </div>
        </div>

        <div class="flex">
          <div class="w-full">
            <div class="flex" v-for="(director, index) in form.directors" :key="index">
              <div class="w-6/12 mr-2">
                <div class="cell">
                  <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Director Name</label>
                  <input type="text" v-model="director.name" class="noFocus form-element e-input w-full" required />
                </div>
              </div>

              <div class="w-6/12 mr-2">
                <div class="cell">
                  <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Position</label>
                  <input type="text" v-model="director.position" class="noFocus form-element e-input w-full" required />
                </div>
              </div>

              <i class="fa-solid fa-times text-red-600 pr-2" @click="removeDirector(index)"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="text-center relative w-full mt-2">
      <div class="flex">
        <div class="w-10/12"></div>
        <div class="w-2/12">
          <button class="button" type="submit">
            <i class="fa-solid fa-check-circle px-2"></i>Submit
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/forms.css";

.section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-weight: bold;
  font-size: 1.2rem;
}

.cell {
  @apply w-full px-1 my-2;
}
</style>
