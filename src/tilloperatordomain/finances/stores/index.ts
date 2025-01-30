
import {ref, type Ref} from "vue";
import {defineStore} from "pinia";
import api from "@/config/api";
import type {Service, ServiceResponseInterface, ServiceSpecification} from "@/tilloperatordomain/services/types";

export const useServicesStore = defineStore("services", () => {
  const services: Ref<Service[] | undefined> = ref()
  const service: Ref<Service | undefined> = ref()
  const serviceSpecification: Ref<ServiceSpecification | undefined> = ref()
  const serviceSpecifications: Ref<ServiceSpecification[] | undefined> = ref()
  const createServiceResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const updateServiceResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const statusUpdateResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const createSpecificationResponse: Ref<ServiceResponseInterface | undefined> = ref()

  const createService = async (payload:any) => {
    return api.post<ServiceResponseInterface>("/registry/v1/create", payload)
        .then((response:any) => {
          createServiceResponse.value = response.data
    })
  }

  const createServiceSpec = async (payload:any) => {
    return api.post<ServiceResponseInterface>("/registry/v1/specs/create", payload)
        .then((response:any) => {
          createSpecificationResponse.value = response.data
        })
  }

  const updateServiceSpec = async (payload:any) => {
    return api.put<ServiceResponseInterface>("/registry/v1/specs/update", payload)
        .then((response:any) => {
          createSpecificationResponse.value = response.data
        })
  }

  const editService = async (id:string, payload:any) => {
    return api.put<ServiceResponseInterface>("/registry/v1/update/"+id, payload)
        .then((response:any) => {
          updateServiceResponse.value = response.data
        })
  }

  const fetchServices = async (page:number, limit:number) => {
    return api.get("/registry/v1?page="+page+"&limit="+limit).then((response:any) => {
      services.value = response.data.data
    })
  }

  const fetchServicesByProvider = async (id:string, page:number) => {
    return api.get("/registry/v1/provider/"+id+"?limit=15&page="+page).then((response:any) => {
      services.value = response.data.data
    })
  }

  const findServiceSpecById = async (id:any) => {
    return api.get("/registry/v1/specs/"+id+"/list").then((response:any) => {
      serviceSpecifications.value = response.data.data
    })
  }

  const findService = async (id:any) => {
    return api.get("/registry/v1/"+id).then((response:any) => {
      service.value = response.data.data
    })
  }

  const findServiceSpec = async (id:string) => {
    return api.get("/registry/v1/specs/"+id).then((response:any) => {
      serviceSpecification.value = response.data.data
    })
  }

  const updateServiceSpecificationStatus = async (payload:any) => {
    return api.put<ServiceResponseInterface>("/registry/v1/specs/update/status", payload)
        .then((response:any) => {
          statusUpdateResponse.value = response.data
        })
  }

  return {
    services,
    service,
    createServiceResponse,
    updateServiceResponse,
    createSpecificationResponse,
    serviceSpecification,
    serviceSpecifications,
    createService,
    createServiceSpec,
    updateServiceSpec,
    editService,
    fetchServices,
    findService,
    fetchServicesByProvider,
    findServiceSpec,
    findServiceSpecById,
    updateServiceSpecificationStatus
  };
})
