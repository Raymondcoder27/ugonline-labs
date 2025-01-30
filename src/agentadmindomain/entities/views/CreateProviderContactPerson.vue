<script setup lang="ts">

import {reactive} from "vue";
// import {useProviderStore} from "@/agentadmindomain/entities/stores";
//
// const stores = useProviderStore()

let form = reactive({
  contactPersons: []
})
const emit = defineEmits(['cancel'])
function submit(){

}

// function addContactPerson(){
//   let person: Ref<ContactPerson> = ref({
//     name:"",
//     email:"",
//     phone:""
//   })
//   form.contactPersons.push(person.value)
// }

// function removeContactPerson(idx:number){
//   form.contactPersons.splice(idx, 1)
// }
</script>

<template>
  <div class="bg-white py-5">
    <p class="text-xl font-bold">Provider Contact Person</p>
    <p class="text-sm text-gray-500">MDAs and/or Companies providing a services consumed by the general public of Uganda.</p>
    <form @submit="submit" class="pt-5">
      <div class="flex">
        <div class="w-9/12" v-if="form.contactPersons.length > 0">
          <div class="flex" v-for="(person, idx) in form.contactPersons" :key="idx">
            <div class="w-full">
              <div class="flex">
                <div class="w-11/12"></div>
                <div class="w-1/12">
                  {{person}}
                </div>
              </div>
<!--              <div class="flex">-->
<!--                <div class="cell">-->
<!--                  <input type="email" v-model="person.name" placeholder="Full Name" class="noFocus form-element e-input w-full"-->
<!--                         required />-->
<!--                </div>-->
<!--                <div class="cell">-->
<!--                  <input type="email" v-model="person.email" placeholder="Email Address" class="noFocus form-element e-input w-full"-->
<!--                         required />-->
<!--                </div>-->
<!--                <div class="cell">-->
<!--                  <input type="tel" v-model="person.phone" placeholder="Phone Number" class="noFocus form-element e-input w-full"-->
<!--                         required />-->
<!--                </div>-->
<!--                <i class="fa-solid fa-times text-red-600 pr-2" @click="removeContactPerson(idx)"></i>-->
<!--              </div>-->
            </div>
          </div>
        </div>
        <div class="w-3/12">
<!--          <button class="button" type="button" @click="addContactPerson">-->
<!--            <i class="fa-solid fa-plus"></i> Add Person-->
<!--          </button>-->
        </div>
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