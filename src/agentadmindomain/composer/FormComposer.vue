<script setup lang="ts">

import FormBuilder from "@/agentadmindomain/composer/components/FormBuilder.vue";
import {onMounted, reactive, type Ref, ref, watch} from "vue";
import FormViewer from "@/agentadmindomain/composer/components/FormViewer.vue";
import {useServicesStore} from "@/agentadmindomain/services/stores";
import {useProviderStore} from "@/agentadmindomain/entities/stores";
import {useRouter} from "vue-router";
import type {FormSection} from "@/agentadmindomain/composer/types/formtypes";
import {type Form} from "@/agentadmindomain/composer/types/formtypes";
import router from "@/router";
import {useNotificationsStore} from "@/stores/notifications";

const store = useServicesStore()
const providerStore = useProviderStore()
const loading: Ref<boolean> = ref(false)
const specificationId: Ref<string> = ref("")
const notify = useNotificationsStore()

let formData:Ref<Array<FormSection>> = ref([]);

let form = reactive({
  providerId: null,
  serviceId:null,
  submitEndpoint: "",
  requestType:"POST",
  paymentType: "NTR",
  taxHead:null,
  currency:"UGX",
  amount:0,
  data: { form : {sections:[]}},
  status:"",
  activityStatus:""
})

onMounted(() => {
  //
  providerStore.fetchProviders(1, 20)
      .then(() => (loading.value = false))
      .catch(() => {
        loading.value = false
      })

  let path = useRouter()
  let specId = path.currentRoute.value.params.id
  specificationId.value = specId.toString()

  let service = JSON.parse(localStorage.getItem("service") || '{}')
  form.providerId = service.providerId
  form.serviceId = service.id

  if(specId != "new"){
    store.findServiceSpec(specId.toString())
        .then(() => (loading.value = false))
        .catch(() => {
          loading.value = false
        })
  }else{
    let formEntry: Ref<Form> = ref({
      sections: []
    })
    localStorage.setItem("form-data", JSON.stringify(formEntry.value))
    console.log(service)
  }
})

function refresh(){
  formData.value = JSON.parse(<string>localStorage.getItem("form-data")).sections
}

function save(){
  let payload = {
    data: {form : JSON.parse(localStorage.getItem("form-data") || "")},
    submit_endpoint:form.submitEndpoint,
    service_id:form.serviceId,
    request_type:form.requestType,
    status:form.status,
    activity_status:form.activityStatus,
    tax_head:form.taxHead,
    currency:form.currency,
    cost:form.amount,
    is_ntr:form.paymentType == "NTR"
  }

  if(specificationId.value == "new"){
    store.createServiceSpec(payload)
        .then(() => {
          loading.value = false
          notify.success("Specification created")
        })
        .catch((error:any) => {
          loading.value = false
          notify.error(error.response.data)
        })
  }else{
    Reflect.set(payload, "id", specificationId.value)
    store.updateServiceSpec(payload)
        .then(() => {
          loading.value = false
          notify.success("Specification updated")
          router.push({name:"service-details", params:{id:form.serviceId}})
        })
        .catch((error:any) => {
          loading.value = false
          notify.error(error.response.data)
        })
  }
}

function validateForm(){
  // let data = JSON.parse(localStorage.getItem("form-data") || "")
  // return !!(form.serviceId && data);
  return true
}

function fetchProviderServices(id:string, page:number){
  store.fetchServicesByProvider(id, page)
      .then(() => (loading.value = false))
      .catch(() => {
        loading.value = false
      })
}

watch(
    () => form.providerId,
    (id:any) => {
      fetchProviderServices(id, 0)
    },
{ deep: true }
);
watch(
    () => store.serviceSpecification,
    (data:any) => {
      form.submitEndpoint = data?.submitEndpoint ?? ""
      form.taxHead = data?.taxHead ?? ""
      form.amount = data?.cost ?? ""
      form.requestType = data?.requestType.Valid ? data?.requestType.String : "POST"
      form.status = data?.status ?? ""
      form.activityStatus = data?.activityStatus ?? ""
      formData.value = data?.data.form.sections ?? []

      localStorage.setItem("form-data", JSON.stringify(data?.data.form  ?? ""))
    },
    { deep: true }
);
</script>

<template>
  <div class="w-full shadow-lg bg-white rounded p-2">
    <div class="flex mb-5">
      <div class="w-full py-1">
        <i class="bg-primary-700 border border-primary-800 text-white p-2 rounded-full fa-solid fa-sliders"></i>
        <label class="text-lg mx-1">Custom Form Composer</label>
      </div>
    </div>

    <div class="flex">
      <div class="w-8/12">
        <div class="flex">
          <div class="w-11/12 border border-blue-200 bg-blue-50 p-3 text-sm rounded text-blue-600">
            <p class="my-auto"> <i class="fa-solid fa-info-circle"></i> <label class="font-bold">Form Builder</label> <br/>
              <span class="text-xs">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
              dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
              It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
              It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with
              desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
              It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with
              desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
              It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="w-4/12">
        <div class="flex">
          <div class="w-10/12"></div>
          <div class="w-2/12">
            <button  v-if="validateForm()" class="button text-center" @click="save">
              <i class="fa-solid fa-save"></i> Save
            </button>
            <button  v-else class="button-inert text-center">
              <i class="fa-solid fa-save"></i> Save
            </button>
          </div>
        </div>
        <div class="flex">
          <div class="w-6/12 mr-1">
            <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Service Provider</label>
            <select v-model="form.providerId" class="noFocus form-element e-input w-full">
              <option :value="null">-- Select Provider --</option>
              <option v-for="(provider, idx) in providerStore.providers" :key="idx" :value="provider.id">{{provider.name}}</option>
            </select>
          </div>
          <div class="w-6/12">
            <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Services</label>
            <select v-model="form.serviceId" class="noFocus form-element e-input w-full" :disabled="form.providerId == null">
              <option :value="null">-- Select Service --</option>
              <option v-for="(service, idx) in store.services" :key="idx" :value="service.id">{{service.name}}</option>
            </select>
          </div>
        </div>
        <div class="flex py-1">
          <div class="w-6/12 mr-1">
            <select v-model="form.requestType" class="noFocus form-element e-select w-full">
              <option :value="null">--Select Request Type--</option>
              <option value="POST">Post (Create/New)</option>
              <option value="PUT">Put (Update/Replace)</option>
              <option value="GET">Get (Find/Search)</option>
            </select>
          </div>
          <div class="w-6/12">
            <input placeholder="Submit URL e.g https://endpoint.test" type="text" v-model="form.submitEndpoint" class="noFocus form-element e-input w-full"/>
          </div>

        </div>
        <div class="flex">
          <div class="w-2/12 mr-1">
            <select v-model="form.paymentType" class="noFocus form-element e-select w-full">
              <option :value="null">--Payment Type--</option>
              <option value="NTR">NTR</option>
              <option value="NOT_NTR">Non NTR</option>
            </select>
          </div>
          <div class="w-4/12 mr-1">
            <input placeholder="TaxHead"
                   type="text"
                   v-model="form.taxHead"
                   class="noFocus form-element e-input w-full"/>
          </div>
          <div class="w-3/12 mr-1">
            <select v-model="form.currency" class="noFocus form-element e-select w-full">
              <option :value="null">--Currency--</option>
              <option value="UGX">UGX</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
              <option value="KSH">KSH</option>
              <option value="TSH">TSH</option>
              <option value="FRW">FRW</option>
            </select>
          </div>
          <div class="w-3/12">
            <input placeholder="Amount"
                   type="number"
                   v-model="form.amount"
                   class="noFocus form-element e-input w-full"/>
          </div>
        </div>
      </div>
    </div>

    <div class="flex py-2">
      <div class="w-7/12 border-r border-gray-200" style="min-height: 80vh">
        <FormBuilder @updated="refresh" class="pr-1" :form="formData"/>
      </div>
      <div class="w-5/12">
        <div class="flex bg-gray-10 border border-gray-200 rounded mx-1 px-2 py-3 min-h-screen">
          <div class="w-full">
            <div class="flex">
              <div class="w-full mx-auto">
                <FormViewer name="Form Title Preview" :url="form.submitEndpoint" :form="formData"/>
                <div class="flex w-full my-2" v-if="formData">
                  <pre class="text-green-800 bg-gray-100 p-1 rounded mt-2 text-xs w-full">{{formData}}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/forms.css";
</style>