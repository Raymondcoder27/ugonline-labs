<script setup lang="ts">
import type {
  FormElement,
  FormSection,
  SectionEntry,
} from "@/tilloperatordomain/composer/types/formtypes";
import { onMounted, type Ref, ref, watch } from "vue";
import api from "@/config/api";
import axios from "axios";

let formSections: Ref<Array<FormSection>> = ref([]);

const props = defineProps({
  form: Array<FormSection>,
  name: String,
});

let formData: any = {};

onMounted(() => {
  formSections.value = props.form || [];
  formData = {};
});

function submit() {
  alert(JSON.stringify(formData));
}

// submit to an endpoint (https://sandbox.apiclient.eposta.ug/api/box/apply)
// function submit() {
//   let payload = {
//     form: formData
//   }
//   // api.post('/box/apply', payload)
//   axios.post('https://endpoint.test', payload)
//       .then(() => {
//         alert('Form submitted')
//       })
//       .catch((error:any) => {
//         // alert(JSON.stringify(error.response.data))
//         alert(JSON.stringify(error))
//       })
// }
// alert(JSON.stringify('Form submitted'))

function onChange(variable: string, value: string) {
  Reflect.set(formData, variable, value);
}

function onChangeMultiple(
  group_name: string,
  idx: number,
  variable: string,
  value: string
) {
  let counter = 0;
  formData[group_name].forEach((entry: any) => {
    if (idx == counter) {
      Reflect.set(entry, variable, value);
    }
    counter++;
  });
}

function addEntry(sectionIdx: number, fields: FormElement[]) {
  let entry: SectionEntry = {
    fields: fields,
  };
  formSections.value[sectionIdx].entries.push(entry);
  localStorage.setItem("form-data", JSON.stringify(formSections));

  let formEntry = {};
  fields.forEach((element) => {
    if (element.name != undefined || element.name != null) {
      Reflect.set(formEntry, element.name.trim(), null);
    }
  });

  let name = formSections.value[sectionIdx].name;
  let field = getSectionVariableName(name);
  formData[field].push(formEntry);
}

function removeEntry(sectionIdx: number, entryIdx: number) {
  formSections.value[sectionIdx].entries.splice(entryIdx, 1);
  localStorage.setItem("form-data", JSON.stringify(formSections));

  let name = formSections.value[sectionIdx].name;
  let field = getSectionVariableName(name);
  formData[field].splice(entryIdx, 1);
}

function getSectionVariableName(name: string) {
  return camelCase(name.replace(" ", "").toLowerCase());
}

function camelCase(str: string) {
  // Using replace method with regEx
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
}
watch(
  () => props.form || [],
  (data: Array<FormSection>) => {
    formSections.value = props.form || [];
    if (data.length > 0) {
      data.forEach((section) => {
        if (section.cardinality == "MULTIPLE") {
          let field = getSectionVariableName(section.name);
          if (formData[field] == undefined || formData[field] == null) {
            Reflect.set(formData, field, []);
          }
        } else {
          section.fields.forEach((element) => {
            if (element.name != undefined || element.name != null) {
              Reflect.set(formData, element.name.trim(), null);
            }
          });
        }
      });
    }
  },
  { deep: true }
);
</script>

<template>
  <div class="w-full shadow-lg bg-white rounded p-5">
    <p class="text-lg font-bold">{{ name }}</p>
    <form @submit.prevent="submit">
      <div
        class="flex section"
        v-for="(section, idx) in formSections"
        :key="idx"
      >
        <div class="w-full">
          <div class="flex my-auto">
            <div class="w-10/12 section-title pr-4">
              <span>{{ section.name }}</span>
              <hr />
            </div>
            <div class="w-2/12 my-auto">
              <button
                v-if="section.cardinality == 'MULTIPLE'"
                class="action-button-sm"
                type="button"
                @click="addEntry(idx, section.fields)"
              >
                <i class="px-1 fa-solid fa-plus"></i> Add Entry
              </button>
            </div>
          </div>
          <div class="flex" v-if="section.cardinality == 'SINGLE'">
            <div
              :class="section.fields.length == 1 ? 'w-full' : 'w-6/12 mr-2'"
              v-for="(element, edx) in section.fields"
              :key="edx"
            >
              <div class="flex">
                <div
                  class="cell"
                  v-if="element.type == 'text' || element.type == 'number'"
                >
                  <label
                    class="block uppercase text-neutral-600 text-xs font-bold mb-1"
                    >{{ element.label }}</label
                  >
                  <input
                    :type="element.type"
                    :name="element.name"
                    v-model="formData[element.name]"
                    v-on:change="onChange(element.name, formData[element.name])"
                    class="noFocus form-element e-input w-full"
                    :required="element.required"
                  />
                </div>
                <div class="cell" v-if="element.type == 'textarea'">
                  <label
                    class="block uppercase text-neutral-600 text-xs font-bold mb-1"
                    >{{ element.label }}</label
                  >
                  <textarea
                    rows="4"
                    :name="element.name"
                    v-model="formData[element.name]"
                    v-on:change="onChange(element.name, formData[element.name])"
                    class="noFocus form-element e-input w-full"
                    :required="element.required"
                  />
                </div>
                <div class="cell" v-if="element.type == 'select'">
                  <label
                    class="block uppercase text-neutral-600 text-xs font-bold mb-1"
                    >{{ element.label }}</label
                  >
                  <select
                    :name="element.name"
                    v-model="formData[element.name]"
                    v-on:change="onChange(element.name, formData[element.name])"
                    class="noFocus form-element e-input w-full"
                  >
                    <option
                      :value="option.value"
                      v-for="(option, optIdx) in element.options"
                      :key="optIdx"
                    >
                      {{ option.text }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div class="flex" v-if="section.cardinality == 'MULTIPLE'">
            <div class="w-full">
              <div
                class="flex bg-gray-10 rounded p-2 my-2 shadow"
                v-for="(entry, edx) in section.entries"
                :key="edx"
              >
                <div class="w-full">
                  <div class="flex">
                    <div class="w-11/12">
                      <div
                        class="flex"
                        v-for="(element, fdx) in entry.fields"
                        :key="fdx"
                      >
                        <div
                          class="cell"
                          v-if="
                            element.type == 'text' || element.type == 'number'
                          "
                        >
                          <label
                            class="block uppercase text-neutral-600 text-xs font-bold mb-1"
                            >{{ element.label }}</label
                          >
                          <input
                            :type="element.type"
                            :name="element.name"
                            v-model="
                              formData[getSectionVariableName(section.name)][
                                edx
                              ][element.name]
                            "
                            v-on:change="
                              onChangeMultiple(
                                getSectionVariableName(section.name),
                                fdx,
                                element.name,
                                formData[getSectionVariableName(section.name)][
                                  edx
                                ][element.name]
                              )
                            "
                            class="noFocus form-element e-input w-full"
                            :required="element.required"
                          />
                        </div>
                        <div class="cell" v-if="element.type == 'textarea'">
                          <label
                            class="block uppercase text-neutral-600 text-xs font-bold mb-1"
                            >{{ element.label }}</label
                          >
                          <textarea
                            rows="4"
                            :name="element.name"
                            v-model="
                              formData[getSectionVariableName(section.name)][
                                edx
                              ][element.name]
                            "
                            v-on:change="
                              onChangeMultiple(
                                getSectionVariableName(section.name),
                                fdx,
                                element.name,
                                formData[getSectionVariableName(section.name)][
                                  edx
                                ][element.name]
                              )
                            "
                            class="noFocus form-element e-input w-full"
                            :required="element.required"
                          />
                        </div>
                        <div class="cell" v-if="element.type == 'select'">
                          <label
                            class="block uppercase text-neutral-600 text-xs font-bold mb-1"
                            >{{ element.label }}</label
                          >
                          <select
                            :name="element.name"
                            v-model="
                              formData[getSectionVariableName(section.name)][
                                edx
                              ][element.name]
                            "
                            v-on:change="
                              onChangeMultiple(
                                getSectionVariableName(section.name),
                                fdx,
                                element.name,
                                formData[getSectionVariableName(section.name)][
                                  edx
                                ][element.name]
                              )
                            "
                            class="noFocus form-element e-input w-full"
                          >
                            <option
                              :value="option.value"
                              v-for="(option, optIdx) in element.options"
                              :key="optIdx"
                            >
                              {{ option.text }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div class="w-1/12 my-auto text-center">
                      <i
                        class="cursor-pointer fa-solid fa-times-circle text-red-600 mx-2 hover:text-red-800"
                        @click="removeEntry(idx, edx)"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  </div>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";

.cell {
  @apply w-full my-2;
}
</style>