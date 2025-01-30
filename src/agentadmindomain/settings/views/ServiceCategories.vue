<script setup lang="ts">
import { useSettingsStore } from "@/agentadmindomain/settings/stores";
import { reactive, ref, type Ref } from "vue";
import AppModal from "@/components/AppModal.vue";
import { onMounted } from "vue";
import CreateServiceCategory from "@/agentadmindomain/settings/components/CreateServiceCategory.vue";
import EditServiceCategory from "@/agentadmindomain/settings/components/EditServiceCategory.vue";
import type { Category } from "@/agentadmindomain/settings/types";
import { useNotificationsStore } from "@/stores/notifications";
import type { ApiError } from "@/types";
import TableLoader from "@/components/TableLoader.vue";

const loading: Ref<boolean> = ref(false);
// const page: Ref<number> = ref(1);
const modalOpen: Ref<boolean> = ref(false);
const editModalOpen: Ref<boolean> = ref(false);
let selectedCategory: Category = reactive({
  id: "",
  name: "",
  icon_url: "",
});
const notify = useNotificationsStore();
const store = useSettingsStore();

onMounted(() => {
  fetch();
});

function fetch() {
  loading.value = true;
  store
    .fetchCategories()
    .then(() => (loading.value = false))
    .catch((error: ApiError) => {
      loading.value = false;
      notify.error(error.response.data.message);
    });
}

function close() {
  modalOpen.value = false;
}

function editCategory(category: Category) {
  localStorage.setItem("category", JSON.stringify(category));
  selectedCategory = category;
  editModalOpen.value = true;
}

function deleteCategory(id: string) {
  loading.value = true;
  store
    .deleteCategory(id)
    .then(() => {
      loading.value = false;
      fetch();
    })
    .catch((error: ApiError) => {
      loading.value = false;
      notify.error(error.response.data.message);
    });
}
</script>

<template>
  <div class="bg-white">
    <div class="flex">
      <div class="w-11/12"></div>
      <div class="w-1/12">
        <button
          @click="modalOpen = true"
          class="button btn-sm my-auto"
          type="button"
        >
          <i class="px-1 fa-solid fa-plus"></i> Add Category
        </button>
      </div>
    </div>
    <div class="flex">
      <div class="w-full text-xs">
        <table class="table">
          <thead>
            <tr class="header-tr">
              <th class="t-header" width="40px">#</th>
              <th class="text-center" width="100px">Icon</th>
              <th class="t-header">Name</th>
              <th class="text-center" width="100px"></th>
            </tr>
          </thead>
          <thead v-if="loading">
            <tr>
              <th colspan="12" style="padding: 0">
                <div
                  class="w-full bg-primary-600 h-1 p-0 m-0 animate-pulse"
                ></div>
              </th>
            </tr>
          </thead>
          <tbody v-if="store.categories">
            <tr
              class="body-tr"
              v-for="(category, idx) in store.categories"
              :key="idx"
            >
              <td class="text-xs">
                {{ idx + 1 }}
              </td>
              <td class="text-xs text-center">
                <i
                  v-if="category.icon_url.includes('form.icon')"
                  class="fa-solid fa-image dummy-icon"
                ></i>
                <img
                  v-else-if="category.icon_url.length > 0"
                  :src="category.icon_url"
                  class="w-8 mx-auto bg-primary-700 p-1 text-center rounded"
                />
                <i v-else class="fa-solid fa-image dummy-icon"></i>
              </td>
              <td class="text-xs">
                <span class="font-bold uppercase">{{ category.name }}</span>
              </td>
              <td class="text-xs text-center">
                <div class="flex float-right">
                  <i
                    class="mx-3 fa-solid p-1 bg-green-100 border border-green-200 text-md fa-pencil text-green-600 hover:bg-green-200 hover:text-green-800"
                    @click="editCategory(category)"
                  ></i>
                  <i
                    class="mx-3 fa-solid p-1 text-md bg-red-100 fa-trash border border-r-red-200 text-red-600 hover:bg-red-200 hover:text-red-800"
                    @click="deleteCategory(category.id)"
                  ></i>
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr class="body-tr px-5">
              <td class="text-xs text-center bg-gray-100" colspan="12">
                No categories found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <AppModal v-model="modalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <CreateServiceCategory @cancel="close" />
    <!-- That's also okay -->
  </AppModal>

  <AppModal v-model="editModalOpen" xl2>
    <!-- Put here whatever makes you smile -->
    <!-- Chances are high that you're starting with a form -->
    <EditServiceCategory
      :id="selectedCategory.id"
      :name="selectedCategory.name"
      @cancel="close"
    />
    <!-- That's also okay -->
  </AppModal>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/forms.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";

.dummy-icon {
  @apply p-1 text-primary-700 mx-auto;
  font-size: 30px;
}
</style>