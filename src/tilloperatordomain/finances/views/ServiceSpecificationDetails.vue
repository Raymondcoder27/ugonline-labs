<script setup lang="ts">

import {onMounted, type Ref, ref} from "vue";
import moment from "moment/moment";
import {useServicesStore} from "@/tilloperatordomain/services/stores";
import router from "@/router";

const store = useServicesStore()
const loading: Ref<boolean> = ref(false)
const responseStatus: Ref<number> = ref(200)

const props = defineProps({
  id:String
})

onMounted(() => {
  loading.value = true
  store.findServiceSpecById(props.id)
      .then(() => {
        loading.value = false
        if(store.serviceSpecifications == null){
          responseStatus.value = 404
        }
      })
      .catch((error:any) => {
        loading.value = false
        responseStatus.value = error.response.data.status
      })
})

function updateStatus(id:string, status:string){
  let payload = {
    id:id,
    status:status
  }
  store.updateServiceSpecificationStatus(payload)
      .then(() => {
        loading.value = false
        window.location.reload()
      })
      .catch((error:any) => {
        loading.value = false
        alert(JSON.stringify(error.response.data))
      })
}

function compose(id:string, providerId:string){
  localStorage.setItem("providerId", providerId)
  router.push({name:"form-builder", params:{id:id}})
}
function preview(id:string){
  router.push({name:"form-previewer", params:{id:id}})
}

function createSpec(){
  router.push({name:"form-builder", params:{id:'new'}})
}

// function convertDateTime(date:string){
//   return moment(date).format("DD-MM-YYYY HH:mm:ss")
// }

function convertDate(date:string){
  return moment(date).format("DD-MM-YYYY")
}

</script>

<template>
  <div class="bg-white py-5">
    <div class="flex">
      <div class="w-10/12 mx-auto text-center">
        <span class="lds-ring mx-1" v-if="loading">
          <div></div><div></div><div></div><div></div>
        </span>
      </div>
    </div>

    <div class="flex" v-if="responseStatus == 200">
      <div class="w-full text-xs">
        <table class="table" v-if="store.serviceSpecifications">
          <thead>
          <tr class="header-tr">
            <th class="t-header">#</th>
            <th class="t-header">Feature</th>
            <th class="text-center">Request Type</th>
            <th class="text-center">Activity</th>
            <th class="text-center">Status</th>
            <th class="text-center">Version</th>
            <th class="text-center">Date</th>
            <th class="text-center">Action</th>
            <th class="t-header"></th>
          </tr>
          </thead>
          <tbody>
          <tr class="body-tr"
              v-for="(spec, idx) in store.serviceSpecifications"
              :key="idx">
            <td width="10px text-xs">{{ idx + 1 }}.</td>
            <td class="text-xs">
              <label v-if="spec.feature.Valid" class="underline">{{ spec.feature.String}} <i class="fa-solid fa-link"></i></label>
              <label v-else>waiting...</label>
            </td>
            <td class="text-xs text-center">
              <label>{{ spec.requestType.String}}</label>
            </td>
            <td class="text-xs text-center">
              <label>{{ spec.activityStatus}}</label>
            </td>
            <td class="text-xs text-center">
              <label v-if="spec.status == 'PUBLISHED'" class="bg-green-500 text-white rounded p-1">{{ spec.status}} <i class="mx-1 fa-solid fa-check"></i></label>
              <label v-else-if="spec.status == 'UNPUBLISHED'" class="bg-orange-400 text-white rounded p-1">{{ spec.status}} <i class="mx-1 fa-solid fa-exclamation"></i></label>
              <label v-else-if="spec.status == 'DEPRECATED'" class="bg-red-700 text-white rounded p-1">{{ spec.status}} <i class="mx-1 fa-solid fa-ban"></i></label>
              <label v-else class="border border-gray-100 rounded p-1">{{ spec.status}}</label>
            </td>
            <td class="text-xs text-center font-mono">
              <label v-if="spec.version">{{ spec.version}}</label>
              <label v-else>N/A</label>
            </td>

            <td class="text-center text-xs">{{ convertDate(spec.createdAt) }}</td>

            <td class="text-right text-xs">
              <div class="flex">
                <i @click="preview(spec.id)" class="fa-solid fa-eye text-blue-700 p-1 bg-blue-50 border border-blue-200 hover:text-primary-700"></i>
                <i v-if="spec.status == 'DEPRECATED'" class="fa-solid fa-pen text-gray-200 mx-1 p-1 bg-gray-50 border border-gray-200 hover:text-primary-700"></i>
                <i v-else @click="compose(spec.id, spec.providerId)" class="fa-solid fa-pen mx-1 p-1 bg-green-50 border border-green-200 text-green-700 hover:text-primary-700"></i>
              </div>
            </td>
            <td class="text-right text-xs">
              <div class="flex text-center">
                <button v-if="spec.status == 'DRAFT'" @click="updateStatus(spec.id, 'COMPLETED')" class="w-6/12 action-button-sm"> <i class="fa-solid fa-check-circle px-1"></i>Complete</button>
                <button v-if="spec.status == 'COMPLETED'" @click="updateStatus(spec.id, 'PUBLISHED')" class="w-6/12 action-button-sm"> <i class="fa-solid fa-cloud-upload px-1"></i>Publish</button>
              </div>
            </td>
          </tr>
          </tbody>
          <tbody v-if="store.serviceSpecifications.length == 0">
          <tr class="body-tr px-5">
            <td class="text-xs">No specifications found</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex" v-if="responseStatus == 404">
      <div class="w-full">
        <div class="flex">
          <div class="w-full border border-blue-200 bg-blue-50 p-3 text-sm rounded text-blue-600">
            <p class="my-auto"> <i class="fa-solid fa-info-circle"></i> <label class="font-bold">No specifications added to this service</label> <br/>
              You can go ahead and define a specification that will include but not limited to the form structure using the <b>FormBuilder</b>
              together with the post and callback <i>urls</i></p>
          </div>
        </div>
        <div class="flex">
          <div class="w-2/12 pt-4">
            <button class="button-info" @click="createSpec">
              <i class="fa-solid fa-plus"></i>
              Add Specification</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
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