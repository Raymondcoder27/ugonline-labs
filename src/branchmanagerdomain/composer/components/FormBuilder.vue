<script setup lang="ts">
import type {Form, FormElement, FormOption, FormSection} from "@/branchmanagerdomain/composer/types/formtypes";
import {onMounted, ref, type Ref, watch} from "vue";
import AppModal from "@/components/AppModal.vue";
import PlatformConstants from "@/branchmanagerdomain/composer/components/PlatformConstants.vue";

const emit = defineEmits(['updated', 'save'])

const modalOpen: Ref<boolean> = ref(false);
const props = defineProps({
  form: Array<FormSection>
})
let inputTypeOptions: Ref<Array<FormOption>> = ref(
  [
    {
      text: "Text Field",
      value: "text",
    },
    {
      text: "Text Area",
      value: "textarea",
    },
    {
      text: "Numeric Field",
      value: "number",
    },
    {
      text: "Boolean",
      value: "radio",
    },
    {
      text: "Dropdown/Select",
      value: "select",
    }
  ]
)

let form: Ref<Form> = ref({
  sections: []
})

function addSection(){
  let idx = form.value.sections.length > 0 ? form.value.sections.length + 1 : 1
  let newSectionName = "Section "+idx
  let section: Ref<FormSection> = ref({
    fields: [],
    cardinality:"SINGLE",
    entries: [],
    name: newSectionName
  })
  form.value.sections.push(section.value)
  localStorage.setItem("form-data", JSON.stringify(form.value))
  emit('updated')

}
function addElement(sectionIdx:number) {
  let element: Ref<FormElement> = ref(
    {
      label: "",
      name: "",
      type: "",
      options: [],
      required: false,
    })
  form.value.sections[sectionIdx].fields.push(element.value)
  localStorage.setItem("form-data", JSON.stringify(form.value))
  emit('updated')
}
function addOption(sectionIdx:number, idx: number) {
  let option: Ref<FormOption> = ref(
    {
      text: "",
      value: "",
    }
  )
  form.value.sections[sectionIdx].fields[idx].options.push(option.value)
}

function removeSection(sectionIdx:number) {
  form.value.sections.splice(sectionIdx, 1)
  localStorage.setItem("form-data", JSON.stringify(form.value))
  emit('updated')
}

function removeElement(sectionIdx:number, idx: number) {
  form.value.sections[sectionIdx].fields.splice(idx, 1)
  localStorage.setItem("form-data", JSON.stringify(form.value))
  emit('updated')
}

function openConstants() {
  modalOpen.value = true;
}

function addConstant(constant:any){
  console.log(constant)
}

function save(){
  localStorage.setItem("form-data", JSON.stringify(form.value))
  emit('updated')
}

watch(
    () => props.form || [],
    (data: Array<FormSection>) => {
      form.value.sections = data
    },
    {deep: true}
)

onMounted(() => {
  addSection()
})

</script>

<template>
  <div class="w-full bg-white">
    <div class="flex px-1 mb-1">
      <div class="w-11/12">
        <div class="flex">
          <button class="action-button" @click="addSection">
            <i class="fa-solid fa-plus"></i>
          </button>
          <button class="action-button" @click="openConstants">
            <i class="fa-solid fa-list"></i>
          </button>
        </div>
      </div>
      <div class="w-1/12 float-right">
        <button class="action-button float-right" @click="save">
          <i class="fa-solid fa-refresh"></i>
        </button>
      </div>
    </div>
    <div class="flex bg-gray-100 border border-gray-200 rounded p-2">
      <div class="w-full">
        <div class="flex bg-white shadow p-2 mb-2 rounded" v-for="(section, idx) in form.sections" :key="idx">
          <div class="w-full">
            <div class="flex">
              <div class="w-6/12">
                <input type="text" v-model="section.name" class="noFocus form-element e-input w-full" required />
              </div>
              <div class="w-1/12"></div>
              <div class="w-4/12">
                <div class="flex">
                  <span class="my-auto px-2 text-xs">Cardinality</span>
                  <select v-model="section.cardinality" class="noFocus form-element e-input w-full">
                    <option value="SINGLE">Single</option>
                    <option value="MULTIPLE">Multiple</option>
                  </select>
                </div>
              </div>
              <div class="w-1/12 pl-2">
                <button
                    class="button btn-sm"
                    type="button" @click="addElement(idx)">
                  <i class="px-1 fa-solid fa-plus"></i>
                </button>
              </div>
              <div class="w-1/12 pl-2">
                <button
                    class="button-danger btn-sm"
                    type="button" @click="removeSection(idx)">
                  <i class="px-1 fa-solid fa-times"></i>
                </button>
              </div>
            </div>
            <div class="flex px-3 py-5 border border-gray-200 rounded my-2" v-for="(field, edx) in section.fields" :key="edx">
              <div class="w-11/12">
                <div class="flex">
                  <div class="cell">
                    <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Label</label>
                    <input placeholder="Label" type="text" v-model="field.label" class="noFocus form-element e-input w-full"
                           required />
                  </div>
                  <div class="cell">
                    <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Name of field returned</label>
                    <input placeholder="Name" type="text" v-model="field.name" class="noFocus form-element e-input w-full"
                           required />
                  </div>
                  <div class="cell">
                    <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Input Type</label>
                    <select v-model="field.type" class="noFocus form-element e-input w-full">
                      <option :value="option.value" v-for="(option, optIdx) in inputTypeOptions" :key="optIdx">{{ option.text }}
                      </option>
                    </select>
                  </div>
                  <div class="cell">
                    <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Input Restriction</label>
                    <select v-model="field.required" class="noFocus form-element e-input w-full">
                      <option :value="true">Required</option>
                      <option :value="false">Optional</option>
                    </select>
                  </div>
                </div>
                <div class="flex" v-if="field.type == 'select'">
                  <div class="w-3/12 px-1 py-2">
                    <button class="button" type="button" @click="addOption(idx, edx)">
                      <i class="fa-solid fa-plus"></i> Add Option
                    </button>
                  </div>
                  <div class="w-9/12 px-1 my-2">
                    <div class="flex" v-for="(option, fOptIdx) in field.options" :key="fOptIdx">
                      <div class="w-full border-b-2 border-primary py-2">
                        <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Option</label>
                        <div class="flex">
                          <input placeholder="Text" type="text" v-model="option.text"
                                 class="noFocus form-element e-input w-6/12 mr-1" required />
                          <input placeholder="Value" type="text" v-model="option.value"
                                 class="noFocus form-element e-input 6/12 ml-1" required />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-1/12">
                <i class="pt-5 px-2 fa-solid fa-times m-auto text-red-600 hover:text-red-800" @click="removeElement(idx, edx)"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppModal v-model="modalOpen" xl2>
        <PlatformConstants @selected-constant="addConstant"/>
      </AppModal>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";

.cell {
  @apply w-6/12 px-1 my-2;
}
</style>
@/branchmanager/composer/types/formtypes