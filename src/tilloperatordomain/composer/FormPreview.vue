<script setup lang="ts">
import FormViewer from "@/tilloperatordomain/composer/components/FormViewer.vue";
import type { ServiceSpecification } from "@/tilloperatordomain/services/types";
import { onMounted, type Ref, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useServicesStore } from "@/tilloperatordomain/apiservices/stores";
import type { FormSection } from "@/tilloperatordomain/composer/types/formtypes";

let form: Ref<ServiceSpecification> = ref({
  id: "",
  providerId: "",
  serviceId: "",
  feature: {
    String: "",
    Valid: false,
  },
  status: "",
  submitEndpoint: "",
  data: {
    form: {
      sections: [],
    },
  },
  version: "",
  createdAt: "",
  requestType: {
    String: "",
    Valid: false,
  },
  activityStatus: "",
});

let formSections: Ref<Array<FormSection>> = ref([]);
const store = useServicesStore();
const loading: Ref<boolean> = ref(false);
let path = useRouter();

onMounted(() => {
  const specId = <string>path.currentRoute.value.params.id;
  loading.value = true;
  store
    .findServiceSpec(specId)
    .then(() => (loading.value = false))
    .catch(() => {
      loading.value = false;
    });
});

watch(
  () => store.serviceSpecification,
  (data: any) => {
    form.value.id = data?.id ?? "";
    form.value.providerId = data?.providerId ?? "";
    form.value.serviceId = data?.serviceId ?? "";

    form.value.submitEndpoint = data?.submitEndpoint ?? "";
    form.value.requestType = data?.requestType ?? { String: "", Valid: false };
    form.value.status = data?.status ?? "";
    form.value.activityStatus = data?.activityStatus ?? "";
    formSections.value = data?.data.form.sections;
  },
  { deep: true }
);
</script>

<template>
  <div class="flex">
    <div class="w-6/12 mx-auto" v-if="formSections">
      <div class="flex" v-if="form">
        <div class="w-11/12">
          <p class="p-1 rounded bg-white border border-gray-200 text-xs my-1">
            <i class="fa-solid fa-earth"></i> {{ form.submitEndpoint }}
          </p>
        </div>
        <div class="w-1/12">
          <p
            class="p-1 rounded bg-white border border-gray-200 text-xs my-1 ml-1 text-center hover:text-white hover:bg-primary-700"
          >
            <i class="fa-solid fa-upload"></i>
          </p>
        </div>
      </div>
      <div class="flex">
        <div class="w-full">
          <FormViewer name="Form Preview" :form="formSections" />
        </div>
      </div>
    </div>
    <div class="w-6/12 mx-auto text-center" v-else>
      <span class="lds-ring mx-1" v-if="loading">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </span>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/forms.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";
</style>