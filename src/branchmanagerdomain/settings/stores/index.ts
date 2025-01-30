
import {ref, type Ref} from "vue";
import {defineStore} from "pinia";
import api from "@/config/api";
import type {ServiceResponseInterface} from "@/branchmanagerdomain/services/types";
import type {AccessibilityTier, Category} from "@/branchmanagerdomain/settings/types";

export const useSettingsStore = defineStore("settings", () => {
  const categories: Ref<Category[] | undefined> = ref()
  const serviceCategories: Ref<Category[] | undefined> = ref()
  const accessibilityTiers: Ref<AccessibilityTier[] | undefined> = ref([
    {
      text: "Anonymous User",
      value:"ANONYMOUS"
    },
    {
      text: "Registered User",
      value:"REGISTERED_USER"
    },
    {
      text: "External Identity User",
      value:"EXTERNAL_IDENTITY_SERVICE"
    }
  ])

  const createCategoryResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const tagServiceResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const updateCategoryResponse: Ref<ServiceResponseInterface | undefined> = ref()

  const createCategory = async (payload:any) => {
    return api.post<ServiceResponseInterface>("/registry/v1/categories", payload)
        .then((response:any) => {
          createCategoryResponse.value = response.data
    })
  }

  const tagService = async (serviceId:string, payload:any) => {
    return api.put<ServiceResponseInterface>("/registry/v1/"+serviceId+"/categories", payload)
        .then((response:any) => {
          tagServiceResponse.value = response.data
        })
  }

  const updateCategory = async (payload:any) => {
    return api.put<ServiceResponseInterface>("/registry/v1/categories", payload)
        .then((response:any) => {
          updateCategoryResponse.value = response.data
        })
  }

  const deleteCategory = async (id:string) => {
    return api.delete<ServiceResponseInterface>("/registry/v1/categories/"+id)
        .then((response:any) => {
          updateCategoryResponse.value = response.data
        })
  }

  const fetchCategories = async () => {
    return api.get("/registry/v1/categories").then((response:any) => {
      categories.value = response.data.data
    })
  }

  const fetchServiceCategories = async (id:string) => {
    return api.get("/registry/v1/categories/"+id+"/service").then((response:any) => {
      serviceCategories.value = response.data.data
    })
  }

  return {
    accessibilityTiers,
    categories,
    serviceCategories,
    fetchCategories,
    fetchServiceCategories,
    tagServiceResponse,
    tagService,
    createCategoryResponse,
    createCategory,
    updateCategoryResponse,
    updateCategory,
    deleteCategory,
  };
})
