<script setup lang="ts">

import {onMounted, type Ref, ref} from "vue";
import moment from "moment/moment";
import {useServicesStore} from "@/tilloperatordomain/services/stores";
import Footer from "@/components/Footer.vue";
import {useRouter} from "vue-router";
import ServiceSpecificationDetails from "@/tilloperatordomain/services/views/ServiceSpecificationDetails.vue";
import OptionalHeader from "@/components/OptionalHeader.vue";
import AgentHeader from "@/components/AgentHeader.vue";

const store = useServicesStore()
const loading: Ref<boolean> = ref(false)
let serviceId: Ref<string> = ref("")
onMounted(() => {
  let path = useRouter()
  serviceId.value = <string>path.currentRoute.value.params.id
  loading.value = true
  store.findService(serviceId.value)
      .then(() => (loading.value = false))
      .catch((error:any) => {
        loading.value = false
        alert(JSON.stringify(error))
      })
})

function convertDate(date:string){
  return moment(date).format("DD-MM-YYYY")
}

</script>

<template>
  <div class="flex flex-col w-screen h-screen bg-neutral-100">
    <div class="flex flex-col h-full w-full">
     <!-- <OptionalHeader /> -->
      <AgentHeader />
      <main class="h-full flex flex-col">
        <div class="flex flex-row h-full">
          <div class="flex flex-col flex-grow">
            <!-- Main Content Goes Here -->
            <div class="relative w-full flex-grow bg-gray-50 p-2">
              <div class="flex">
                <div class="w-10/12 mx-auto text-center">
                  <span class="lds-ring mx-1" v-if="loading">
                    <div></div><div></div><div></div><div></div>
                  </span>
                </div>
              </div>
              <div class="flex">
                <div class="w-10/12 mx-auto bg-white rounded p-5" v-if="store.service">
                  <div class="flex">
                    <div class="w-1/12 text-center">
                      <i class="fa-solid fa-list rounded-full bg-gray-500 p-5 text-white" style="font-size: 40px;"></i>
                    </div>
                    <div class="w-11/12 my-auto">
                      <p class="font-bold text-xl capitalize">{{store.service.name}}</p>
                      <span class="bg-gray-200 rounded px-2 py-1 text-sm">{{store.service.status}}</span>
                      <p class="text-sm">{{store.service.description}}</p>
                    </div>
                  </div>
                  <div class="flex">
                    <div class="w-1/12 text-center"></div>
                    <div class="w-11/12 my-auto">
                      <p class="text-sm font-bold">Service Requirements</p>
                      <p class="text-sm" v-for="(requirement, idx) in store.service.requirements" :key="idx">
                        - {{requirement}}
                      </p>
                      <p class="text-sm italic text-gray-500">Created On: {{convertDate(store.service.createdAt.Time)}}</p>
                    </div>
                  </div>
                  <div class="flex">
                    <div class="w-full">
                      <ServiceSpecificationDetails v-if="serviceId" :id="serviceId"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- /Main Content Goes Here -->
            <!-- Footer Goes Here -->
            <Footer />
            <!-- /Footer Goes Here -->
          </div>
        </div>
      </main>
    </div>
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

.tab{
  @apply cursor-pointer p-2 border-b border-gray-300 text-sm text-center;
}

.tab-active{
  @apply cursor-pointer p-2 border-b-4 border-primary-700 text-sm text-center;
}
</style>