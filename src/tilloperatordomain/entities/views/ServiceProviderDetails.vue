<script setup lang="ts">

import {onMounted, type Ref, ref} from "vue";
import {useProviderStore} from "@/tilloperatordomain/entities/stores";
import moment from "moment/moment";
import Callbacks from "@/tilloperatordomain/gateway/Callbacks.vue";
import DeadLetters from "@/tilloperatordomain/gateway/DeadLetters.vue";
import Features from "@/tilloperatordomain/gateway/Features.vue";
import OutgoingRequests from "@/tilloperatordomain/gateway/OutgoingRequests.vue";
import Footer from "@/components/Footer.vue";
import {useRouter} from "vue-router";
import ProviderConfiguration from "@/tilloperatordomain/gateway/ProviderConfiguration.vue";
import OptionalHeader from "@/components/OptionalHeader.vue";
import AgentHeader from "@/components/AgentHeader.vue";

const store = useProviderStore()
const loading: Ref<boolean> = ref(false)
const activeTab: Ref<string> = ref("features")
let providerId: Ref<string> = ref("")


onMounted(() => {
  let path = useRouter()
  providerId.value = <string>path.currentRoute.value.params.id
  loading.value = true
  store.findProvider(providerId.value)
      .then(() => (loading.value = false))
      .catch((error:any) => {
        loading.value = false
        alert(JSON.stringify(error))
      })
})

function convertDate(date:string){
  return moment(date).format("DD-MM-YYYY")
}

function select(tab:string){
  activeTab.value = tab
}


</script>

<template>
  <div class="flex flex-col w-screen h-screen bg-neutral-100">
    <div class="flex flex-col h-full w-full">
      <OptionalHeader/>
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
              <div class="flex" v-if="store.provider">
                <div class="w-11/12 mx-auto bg-white rounded p-5">
                  <div class="flex">
                    <div class="w-10/12">
                      <p class="font-bold text-xl capitalize">{{store.provider.name}}</p>
                    </div>
                  </div>
                  <div class="flex">
                    <div class="w-full py-3 text-sm">
                      <table>
                        <tbody>
                        <tr>
                          <td class="font-bold">Email</td>
                          <td class="px-5">{{store.provider.inquiryEmail}}</td>
                        </tr>
                        <tr>
                          <td class="font-bold">Phone</td>
                          <td class="px-5">{{store.provider.inquiryPhoneNumber}}</td>
                        </tr>
                        <tr>
                          <td class="font-bold">Onboarded On</td>
                          <td class="px-5">{{convertDate(store.provider.createdAt)}}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div class="flex pt-5">
                    <div :class=" (activeTab == 'features') ? 'w-1/12 tab-active' : 'w-1/12 tab'" @click="select('features')">Features</div>
                    <div :class="(activeTab == 'outgoing-applications') ? 'w-2/12 tab-active' :'w-2/12 tab'" @click="select('outgoing-applications')">Outgoing Requests</div>
                    <div :class="(activeTab == 'callbacks') ? 'w-2/12 tab-active' :'w-2/12 tab'" @click="select('callbacks')">Callbacks</div>
                    <div :class="(activeTab == 'dead-letters') ? 'w-2/12 tab-active' :'w-2/12 tab'" @click="select('dead-letters')">Dead Letter Queue</div>
                    <div :class="(activeTab == 'config') ? 'w-2/12 tab-active' :'w-2/12 tab'" @click="select('config')">Configuration</div>
                  </div>
                  <div class="flex">
                    <div class="w-full">
                      <Features v-if="activeTab == 'features'" :provider-id="providerId"/>
                      <OutgoingRequests v-if="activeTab == 'outgoing-applications'" :provider-id="providerId"/>
                      <Callbacks v-if="activeTab == 'callbacks'" :provider-id="providerId"/>
                      <DeadLetters v-if="activeTab == 'dead-letters'" :provider-id="providerId"/>
                      <ProviderConfiguration v-if="activeTab == 'config'" :provider-id="providerId"/>
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
@import "@/assets/styles/widgets.css";
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