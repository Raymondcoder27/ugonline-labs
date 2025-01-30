<script setup lang="ts">
import {useSettingsStore} from "@/tilloperatordomain/settings/stores";
import {ref, type Ref} from "vue";
import AppModal from "@/components/AppModal.vue";
import {onMounted} from "vue";
import CreateServiceCategory from "@/tilloperatordomain/settings/components/CreateServiceCategory.vue";
import type {ApiError} from "@/types";
import {useNotificationsStore} from "@/stores/notifications";

const loading: Ref<boolean> = ref(false)
const page: Ref<number> = ref(1);
const modalOpen: Ref<boolean> = ref(false);
const store = useSettingsStore()
let addCategoryId:Ref<string> = ref("")
let removeCategoryId:Ref<string> = ref("")
const notify = useNotificationsStore()

const props = defineProps({
  serviceId:String,
  categories:Array<String>
})

onMounted(() => {
  fetch()
})

function fetch(){
  loading.value = true
  store.fetchCategories()
      .then(() => (loading.value = false))
      .catch((error:any) => {
        loading.value = false
        alert(JSON.stringify(error))
      })

  store.fetchServiceCategories(props.serviceId?.toString() || "")
      .then(() => (loading.value = false))
      .catch(() => {
        loading.value = false
      })
}

function close() {
  modalOpen.value = false;
}

function check(id:string){
  if(addCategoryId.value == id){
    addCategoryId.value = ""
    if(removeCategoryId.value != id){
      removeCategoryId.value = id
    }
  }else{
    addCategoryId.value = id
  }
  submit()
}

function submit(){
  let payload = {
    add:  addCategoryId.value == "" ? null : addCategoryId.value,
    remove: removeCategoryId.value == "" ? null : removeCategoryId.value
  }
  loading.value = true
  store.tagService(props.serviceId || "", payload)
      .then(() => {
        loading.value = false
        notify.success("Service Tagged")
      })
      .catch((error:ApiError) => {
        loading.value = false
        notify.error(error.response.data.message)
      })
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
    <div class="flex">
      <div class="w-full text-xs">
        <table class="table">
          <thead>
          <tr class="header-tr">
            <th class="t-header">#</th>
            <th class="t-header">Name</th>
            <th class="text-center">Select</th>
          </tr>
          </thead>
          <tbody v-if="store.categories">
            <tr class="body-tr"
                v-for="(category, idx) in store.categories"
                :key="idx">
              <td class="text-xs">
                {{idx + 1}}
              </td>
              <td class="text-xs">
                <span class="font-bold capitalize">
                  {{category.name}}

                  {{store.serviceCategories}}
                </span>
              </td>
              <td class="text-xs text-center">
                <input type="checkbox" @change="check(category.id)"/>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr class="body-tr px-5">
              <td class="text-xs text-center bg-gray-100" colspan="12">No categories found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
<!--    <div class="flex space-x-2 my-1">-->
<!--      <div class="flex-grow">-->
<!--      </div>-->
<!--      <div class="flex">-->
<!--        <button @click="submit" class="button btn-sm my-auto" type="button">-->
<!--          <i class="px-1 fa-solid fa-tag"></i> Tag Service-->
<!--          <span class="lds-ring mx-1" v-if="loading">-->
<!--            <div></div><div></div><div></div><div></div>-->
<!--          </span>-->
<!--        </button>-->
<!--      </div>-->
<!--    </div>-->
  </div>

  <AppModal v-model="modalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <CreateServiceCategory @cancel="close"/>
    <!-- That's also okay -->
  </AppModal>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/forms.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";
</style>