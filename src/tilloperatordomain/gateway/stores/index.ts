
import {ref, type Ref} from "vue";
import {defineStore} from "pinia";
import api from "@/config/api";
import type {
  ApplicationRequest,
  DeadLetter,
  Feature,
  GatewayResponseInterface,
  ProviderConfig, Webhook
} from "@/tilloperatordomain/gateway/types";

export const useGatewayStore = defineStore("gateway", () => {
  const features: Ref<Feature[] | undefined> = ref()
  const callbacks: Ref<Webhook[] | undefined> = ref()
  const dlq: Ref<DeadLetter[] | undefined> = ref()
  const requests: Ref<ApplicationRequest[] | undefined> = ref()
  const feature: Ref<Feature | undefined> = ref()
  const configuration: Ref<ProviderConfig | undefined> = ref()
  const configurationResponse: Ref<GatewayResponseInterface | undefined> = ref()

  const fetchProviderConfiguration = async (id:string) => {
    return api.get<GatewayResponseInterface>("/gateway/providers/"+id+"/config")
        .then((response:any) => {
          configuration.value = response.data.data
        })
  }
  const submitProviderConfiguration = async (payload:any) => {
    return api.post<GatewayResponseInterface>("/gateway/providers", payload)
        .then((response:any) => {
          configurationResponse.value = response.data
    })
  }

  const updatePolicyConfiguration = async (id:string, payload:any) => {
    return api.put<GatewayResponseInterface>("/gateway/providers/"+id+"/policy", payload)
        .then((response:any) => {
          configurationResponse.value = response.data
        })
  }

  const fetchFeaturesByProvider = async (page:number, limit:number, id:string) => {
    return api.get<GatewayResponseInterface>("/gateway/providers/"+id+"/features?page="+page+"&limit="+limit).then((response:any) => {
      features.value = response.data.data
    })
  }

  const fetchDlqByProvider = async (page:number, limit:number, id:string) => {
    return api.get<GatewayResponseInterface>("/gateway/providers/"+id+"/dlq?page="+page+"&limit="+limit).then((response:any) => {
      dlq.value = response.data.data
    })
  }

  const fetchCallbacksByProvider = async (page:number, limit:number, id:string) => {
    return api.get<GatewayResponseInterface>("/gateway/providers/"+id+"/callbacks?page="+page+"&limit="+limit).then((response:any) => {
      callbacks.value = response.data.data
    })
  }

  const fetchRequestsByProvider = async (page:number, limit:number, id:string) => {
    return api.get<GatewayResponseInterface>("/gateway/providers/"+id+"/outgoing?page="+page+"&limit="+limit+"&sort_created_at=desc").then((response:any) => {
      requests.value = response.data.data
    })
  }

  const fetchDlqByFeature = async (page:number, limit:number, id:string) => {
    return api.get<GatewayResponseInterface>("/gateway/features/"+id+"/dlq?page="+page+"&limit="+limit).then((response:any) => {
      dlq.value = response.data.data
    })
  }

  const fetchRequestsByFeature = async (page:number, limit:number, id:string) => {
    return api.get<GatewayResponseInterface>("/gateway/features/"+id+"/outgoing?page="+page+"&limit="+limit).then((response:any) => {
      requests.value = response.data.data
    })
  }

  const fetchWebhooksByFeature = async (page:number, limit:number, id:string) => {
    return api.get<GatewayResponseInterface>("/gateway/features/"+id+"/webhooks?page="+page+"&limit="+limit).then((response:any) => {
      callbacks.value = response.data.data
    })
  }

  return {
    feature,
    features,
    callbacks,
    dlq,
    requests,
    configuration,
    configurationResponse,
    submitProviderConfiguration,
    updatePolicyConfiguration,
    fetchFeaturesByProvider,
    fetchDlqByProvider,
    fetchDlqByFeature,
    fetchRequestsByProvider,
    fetchRequestsByFeature,
    fetchWebhooksByFeature,
    fetchCallbacksByProvider,
    fetchProviderConfiguration
  };
})
