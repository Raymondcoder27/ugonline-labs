<script setup lang="ts">

import {onMounted, reactive, ref, type Ref, watch} from "vue";
import {useGatewayStore} from "@/agentadmindomain/gateway/stores";
import type {CertConfig, Policy, ProviderConfig, RequestHeader} from "@/agentadmindomain/gateway/types";

const loading: Ref<boolean> = ref(false)
const notFound: Ref<boolean> = ref(false)

const props = defineProps({
  providerId: String
})

let policyForm: Ref<Policy> = ref(
    {
      pingTimeoutSec: 0,
      protocol: "HTTP",
      requestHeaders: [],
      requestMethod: "POST",
      requestMime: "application/json",
      requestPayloadLocation: "BODY",
      requestRetryIntervalSec: 0,
      requestRetryThreshold: 0,
      requestTimeoutSec: 0,
      specificationId: null
    }
)

let certForm: Ref<CertConfig> = ref(
    {
      description: "",
      key: "",
      private: "",
      public: "",
      type: ""
    }
)

type VpnConfigData = {
  backupIps: string[]
  encryptionAlgo?: string
  encryptionScheme?: string
  keepalive?: boolean
  keepaliveSec?: number
  lifetime?: string
  mode?: string
  peerIp?: string
  preSharedKey?: string
}

let vpnForm: VpnConfigData = reactive(
    {
      mode: "",
      peerIp: "",
      preSharedKey: "",
      backupIps: [],
      encryptionAlgo: "",
      encryptionScheme: "",
      keepalive: false,
      keepaliveSec: 0,
      lifetime: "",
    }
)

const store = useGatewayStore()
onMounted(() => {
  store.fetchProviderConfiguration(props.providerId ?? "")
      .then(() => (loading.value = false))
      .catch((data: any) => {
        if (data.response.data.status == 404) {
          notFound.value = true
          submitEmptyConfig()
        }

        loading.value = false
      })
})

function submitEmptyConfig() {
  let payload: ProviderConfig = reactive({
    providerId: props.providerId ?? "",
    policy: {},
    certConfig: {},
    vpnConfig: {}
  })
  store.submitProviderConfiguration(payload)
      .then(() => (loading.value = false))
      .catch((data: any) => {
        alert(JSON.stringify(data.response.data))
        loading.value = false
      })
}

function submitPolicy() {
  loading.value = true
  store.updatePolicyConfiguration(props.providerId ?? "", policyForm.value)
      .then(() => (loading.value = false))
      .catch((data: any) => {
        alert(JSON.stringify(data.response.data))
        loading.value = false
      })
}

function submitCertConfig() {
  loading.value = true
}

function submitVpnConfig() {
  loading.value = true
}

function addRequestHeader(){
  let header:RequestHeader = reactive(
      {
        name:"",
        value:""
      }
  )
  policyForm.value.requestHeaders?.push(header)
}

function addBackupIP(){
  // vpnForm.backupIps?.push("")
}

function removeRequestHeader(idx:number){
  policyForm.value.requestHeaders?.splice(idx, 1)
}

function removeBackupIP(idx:number){
  vpnForm.backupIps?.splice(idx, 1)
}

watch(
    () => store.configuration,
    (data:any) => {
      policyForm.value = data.policy
      certForm.value = data.certConfig
      vpnForm = data.vpnConfig
    },
    { deep: true }
);

</script>

<template>
  <div class="flex bg-white py-5">
    <div class="w-full">
      <div class="flex">
        <div class="w-full">
        </div>
      </div>
      <div class="flex">
        <div class="w-6/12 px-1">
          <div class="flex">
            <div class="w-full">
              <p class="font-bold">Policy</p>
            </div>
          </div>
          <div class="flex">
            <div class="w-full">
              <form @submit.prevent="submitPolicy">
                <div class="flex">
                  <div class="cell-full">
                    <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Protocol</label>
                    <select v-model="policyForm.protocol" class="noFocus form-element e-select w-full">
                      <option :value="null">--Select Protocol--</option>
                      <option value="HTTP">http</option>
                      <option value="FTP">ftp</option>
                    </select>
                  </div>
                </div>
                <div class="flex">
                  <div class="cell-full">
                    <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Request Method</label>
                    <select v-model="policyForm.requestMethod" class="noFocus form-element e-select w-full">
                      <option :value="null">--Select Request Type--</option>
                      <option value="POST">Post (Create/New)</option>
                      <option value="PUT">Put (Update/Replace)</option>
                      <option value="GET">Get (Find/Search)</option>
                    </select>
                  </div>
                </div>
                <div class="flex">
                  <div class="cell-full">
                    <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Request Mime</label>
                    <select v-model="policyForm.requestMime" class="noFocus form-element e-select w-full">
                      <option :value="null">--Select Request Mime--</option>
                      <option value="application/json">application/json</option>
                      <option value="application/xml">application/xml</option>
                    </select>
                  </div>
                </div>
                <div class="flex">
                  <div class="cell">
                    <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Ping Time Out (Secs)</label>
                    <input type="number" v-model="policyForm.pingTimeoutSec" class="noFocus form-element e-input w-full"
                           required/>
                  </div>
                  <div class="cell">
                    <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Request Time Out (Secs)</label>
                    <input type="number" v-model="policyForm.requestTimeoutSec" class="noFocus form-element e-input w-full"
                           required/>
                  </div>
                </div>
                <div class="flex">
                  <div class="cell">
                    <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Request Retry Interval
                      (Secs)</label>
                    <input type="number" v-model="policyForm.requestRetryIntervalSec" class="noFocus form-element e-input w-full"
                           required/>
                  </div>
                  <div class="cell">
                    <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Request Retry Threshold</label>
                    <input type="number" v-model="policyForm.requestRetryThreshold"
                           class="noFocus form-element e-input w-full" required/>
                  </div>
                </div>
                <div class="flex">
                  <div class="cell-full">
                    <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Payload Location</label>
                    <select v-model="policyForm.requestPayloadLocation" class="noFocus form-element e-select w-full">
                      <option :value="null">--Select Location--</option>
                      <option value="BODY">Body</option>
                      <option value="HEADER">Header</option>
                    </select>
                  </div>
                </div>

                <div class="flex pb-5">
                  <div class="w-full">
                    <div class="flex mt-5">
                      <div class="w-9/12">
                        <p class="text-sm font-bold mx-1">Request Headers</p>
                      </div>
                      <div class="w-3/12">
                        <button class="button-sm" type="button" @click="addRequestHeader"><i class="fa-solid fa-plus mx-1"></i>Header</button>
                      </div>
                    </div>
                    <div class="flex py-1" v-for="(header, idx) in policyForm.requestHeaders" :key="idx">
                      <div class="w-5/12 pr-1">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Name</label>
                        <input type="text" v-model="header.name"
                               class="noFocus form-element e-input w-full" required/>
                      </div>
                      <div class="w-6/12">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Value</label>
                        <input type="text" v-model="header.value"
                               class="noFocus form-element e-input w-full" required/>
                      </div>
                      <div class="w-1/12 my-auto">
                        <i class="cursor-pointer fa-solid fa-times text-red-600 p-2 hover:text-red-800" @click="removeRequestHeader(idx)"></i>
                      </div>
                    </div>
                    <div class="flex py-1" v-if="policyForm.requestHeaders?.length == 0">
                      <div class="w-full border border-gray-100 rounded bg-gray-10 py-3 px-2 text-gray-400 text-sm">
                        <span>Add a Request Header (if needed)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div class="cell-full">
                    <button type="submit" class="button text-center">
                      <i class="fa-solid fa-save"></i> Save

                      <span class="lds-ring mx-1" v-if="loading">
                        <div></div><div></div><div></div><div></div>
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="w-6/12 px-1">
          <div class="flex">
            <div class="w-full p-1">
              <div class="flex">
                <div class="w-full">
                  <p class="font-bold text-black-200">Certificate Configuration</p>
                </div>
              </div>
              <div class="flex">
                <div class="w-full bg-gray-50 p-2 rounded">
                  <form @submit.prevent="submitCertConfig">
                    <div class="flex">
                      <div class="cell-full">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Certificate Key</label>
                        <textarea v-model="certForm.key" class="noFocus form-element e-input w-full" cols="5" required disabled/>
                      </div>
                    </div>
                    <div class="flex">
                      <div class="cell-full">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Certificate Type</label>
                        <select v-model="certForm.type" class="noFocus form-element e-select w-full" disabled>
                          <option :value="null">--Select Type--</option>
                          <option value="pck12">PCK12</option>
                        </select>
                      </div>
                    </div>
                    <div class="flex">
                      <div class="cell-full">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Private Key</label>
                        <textarea v-model="certForm.private" class="noFocus form-element e-input w-full" cols="4" required disabled/>
                      </div>
                    </div>
                    <div class="flex">
                      <div class="cell-full">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Public Key</label>
                        <textarea v-model="certForm.public" class="noFocus form-element e-input w-full" cols="4" required disabled/>
                      </div>
                    </div>
                    <div class="flex">
                      <div class="cell-full">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Description</label>
                        <textarea v-model="certForm.description" class="noFocus form-element e-input w-full" cols="4" required disabled/>
                      </div>
                    </div>
                    <div class="flex">
                      <div class="cell-full">
                        <button type="submit" class="button-inert text-center">
                          <i class="fa-solid fa-save"></i> Save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="flex">
            <div class="w-full p-1">
              <div class="flex">
                <div class="w-full">
                  <p class="font-bold text-black-200">VPN Configuration</p>
                </div>
              </div>
              <div class="flex">
                <div class="w-full bg-gray-50 p-2 rounded">
                  <form @submit.prevent="submitVpnConfig">
                    <div class="flex">
                      <div class="cell-full">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Peer IP</label>
                        <input v-model="vpnForm.peerIp" class="noFocus form-element e-input w-full" required disabled/>
                      </div>
                    </div>
                    <div class="flex">
                      <div class="cell-full">
                        <div class="flex mt-1">
                          <div class="w-9/12">
                            <p class="text-sm font-bold mx-1">Backup IPs</p>
                          </div>
                          <div class="w-3/12">
                            <button class="button-inert" type="button" @click="addBackupIP"><i class="fa-solid fa-plus mx-1"></i>Backup IP</button>
                          </div>
                        </div>
                        <div class="flex py-1" v-for="(ip, idx) in vpnForm.backupIps" :key="idx">
                          <div class="w-11/12">
                            <input :id="ip" v-model="vpnForm.backupIps[idx]" class="noFocus form-element e-input w-full" required disabled/>
                          </div>
                          <div class="w-1/12 my-auto">
                            <i class="cursor-pointer fa-solid fa-times text-red-600 p-2 hover:text-red-800" @click="removeBackupIP(idx)"></i>
                          </div>
                        </div>
                        <div class="flex py-1" v-if="vpnForm.backupIps?.length == 0">
                          <div class="w-full border border-gray-100 rounded bg-gray-10 py-3 px-2 text-gray-400 text-sm">
                            <span>Add a Backup IP (if you have)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="flex">
                      <div class="cell-full">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Pre Shared Key</label>
                        <textarea v-model="vpnForm.preSharedKey" class="noFocus form-element e-input w-full" cols="4" required disabled/>
                      </div>
                    </div>
                    <div class="flex">
                      <div class="cell-full">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Mode</label>
                        <select v-model="vpnForm.mode" class="noFocus form-element e-select w-full" disabled>
                          <option :value="null">--Select Mode--</option>
                          <option value="on">on</option>
                        </select>
                      </div>
                    </div>

                    <div class="flex">
                      <div class="cell">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Encryption Algorithm</label>
                        <select v-model="vpnForm.encryptionAlgo" class="noFocus form-element e-select w-full" disabled>
                          <option :value="null">--Select Mode--</option>
                          <option value="on">Algo 1</option>
                        </select>
                      </div>
                      <div class="cell">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Encryption Scheme</label>
                        <select v-model="vpnForm.encryptionScheme" class="noFocus form-element e-select w-full" disabled>
                          <option :value="null">--Select Mode--</option>
                          <option value="on">Scheme 1</option>
                        </select>
                      </div>
                    </div>

                    <div class="flex">
                      <div class="cell">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Keep Alive</label>
                        <select v-model="vpnForm.keepalive" class="noFocus form-element e-select w-full" disabled>
                          <option :value="false">No</option>
                          <option :value="true">Yes</option>
                        </select>
                      </div>
                      <div class="cell">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Keep Alive (Secs)</label>
                        <input type="number" v-model="vpnForm.keepaliveSec" class="noFocus form-element e-input w-full"
                               required/>
                      </div>
                    </div>

                    <div class="flex">
                      <div class="cell-full">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Life time</label>
                        <input type="text" v-model="vpnForm.lifetime" class="noFocus form-element e-input w-full" required
                               disabled/>
                      </div>
                    </div>
                    <div class="flex">
                      <div class="cell-full">
                        <button type="submit" class="button-inert text-center">
                          <i class="fa-solid fa-save"></i> Save
                        </button>
                      </div>
                    </div>
                  </form>
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
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";

.cell {
  @apply w-6/12 px-1 my-2;
}

.cell-full {
  @apply w-full px-1 my-2;
}
</style>