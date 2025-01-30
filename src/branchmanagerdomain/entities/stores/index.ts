
import {ref, type Ref} from "vue";
import {defineStore} from "pinia";
import type {ProviderResponseInterface, ServiceProvider} from "@/branchmanagerdomain/entities/types";
import api from "@/config/api";

export const useProviderStore = defineStore("providers", () => {
  const providers: Ref<ServiceProvider[] | undefined> = ref()
  const provider: Ref<ServiceProvider | undefined> = ref()
  const createProviderResponse: Ref<ProviderResponseInterface | undefined> = ref()
  const editProviderResponse: Ref<ProviderResponseInterface | undefined> = ref()

  const createProvider = async (payload:any) => {
    return api.post<ProviderResponseInterface>("/providers/v1/register", payload)
        .then((response:any) => {
          createProviderResponse.value = response.data
    })
  }

  const editProvider = async (id:string, payload:any) => {
    return api.put<ProviderResponseInterface>("/providers/v1/update/"+id, payload)
        .then((response:any) => {
          editProviderResponse.value = response.data
        })
  }

  const fetchProviders = async (page:number, limit:number) => {
    return api.get<ProviderResponseInterface>("/providers/v1?page="+page+"&limit="+limit).then((response:any) => {
      providers.value = response.data.data
    })
  }

  const findProvider = async (id:any) => {
    return api.get<ProviderResponseInterface>("/providers/v1/find/"+id).then((response:any) => {
      provider.value = response.data.data
    })
  }

  return {
    provider,
    providers,
    createProviderResponse,
    editProviderResponse,
    createProvider,
    editProvider,
    findProvider,
    fetchProviders
  };
})
