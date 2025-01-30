
import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import api from "@/config/api";
import type { Service, ServiceResponseInterface, ServiceSpecification } from "@/agentadmindomain/services/types";
import niraThumbnail from '@/assets/images/nira.png';
import epostaThumbnail from '@/assets/images/eposta.png';
import naroThumbnail from '@/assets/images/naro.png';
import ursbThumbnail from '@/assets/images/ursb.png';
import ministryThumbnail from '@/assets/images/ministry.png';

import { useServicesStore } from "@/tilloperatordomain/services/stores";

export const useServicesStore = defineStore("services", () => {

  const agentStore = useServicesStore()

  const createService = async (payload: any) => {
    return api.post<ServiceResponseInterface>("/registry/v1/create", payload)
      .then((response: any) => {
        createServiceResponse.value = response.data
      })
  }

  const createServiceSpec = async (payload: any) => {
    return api.post<ServiceResponseInterface>("/registry/v1/specs/create", payload)
      .then((response: any) => {
        createSpecificationResponse.value = response.data
      })
  }

  const updateServiceSpec = async (payload: any) => {
    return api.put<ServiceResponseInterface>("/registry/v1/specs/update", payload)
      .then((response: any) => {
        createSpecificationResponse.value = response.data
      })
  }

  const editService = async (id: string, payload: any) => {
    return api.put<ServiceResponseInterface>("/registry/v1/update/" + id, payload)
      .then((response: any) => {
        updateServiceResponse.value = response.data
      })
  }

  // const fetchServices = async (page:number, limit:number) => {
  //   return api.get("/registry/v1?page="+page+"&limit="+limit).then((response:any) => {
  //     services.value = response.data.data
  //   })
  // }

  const fetchServicesByProvider = async (id: string, page: number) => {
    return api.get("/registry/v1/provider/" + id + "?limit=15&page=" + page).then((response: any) => {
      services.value = response.data.data
    })
  }

  const findServiceSpecById = async (id: any) => {
    return api.get("/registry/v1/specs/" + id + "/list").then((response: any) => {
      serviceSpecifications.value = response.data.data
    })
  }

  const findService = async (id: any) => {
    return api.get("/registry/v1/" + id).then((response: any) => {
      service.value = response.data.data
    })
  }




  const dummyServices: Service[] = [
    // {id: "1", name: "Post Office Account", description: "Open a Post Office Account", accessibilityTier: "Public", featureId: "1", requirements: ["National ID", "Passport"], providerId: "1", providerName: "Posta Uganda", createdAt: {Time: "2021-09-01", Valid: true}, status: "Active", currentVersionId: "1"},
    // {id: "2", name: "Agricultural Research", description: "Request for Agricultural Research", accessibilityTier: "Public", featureId: "2", requirements: ["National ID", "Passport"], providerId: "2", providerName: "National Agricultural Research Organization", createdAt: {Time: "2021-09-02", Valid: true}, status: "Active", currentVersionId: "2"},
    // {id: "3", name: "National ID Registration", description: "Apply for a National ID", accessibilityTier: "Public", featureId: "3", requirements: ["National ID", "Passport"], providerId: "3", providerName: "National Identification & Registration Authority", createdAt: {Time: "2021-09-03", Valid: true}, status: "Active", currentVersionId: "3"},

    { id: "1d", thumbnail: ministryThumbnail, name: "Work Permit Application", description: "Application for a Work Permit", accessibilityTier: "Public", featureId: "7", requirements: ["National ID", "Passport"], providerId: "7", providerName: "Ministry of Internal Affairs", createdAt: { Time: "2021-09-03", Valid: true }, status: "listed", currentVersionId: "7" },
    // {id: "6c", thumbnail: niraThumbnail, name: "Birth Certificate Application", description: "Application for Birth Certificate", accessibilityTier: "Public", featureId: "6", requirements: ["National ID", "Passport"], providerId: "6", providerName: "National Identification & Registration Authority", createdAt: {Time: "2021-09-02", Valid: true}, status: "subscribed", currentVersionId: "6"},
    { id: "4b", thumbnail: niraThumbnail, name: "Change of Particulars", description: "Apply for a Driver's Permit", accessibilityTier: "Public", featureId: "7", requirements: ["National ID", "Passport"], providerId: "4", providerName: "Ministry of Works and Transport", createdAt: { Time: "2021-09-07", Valid: true }, status: "listed", currentVersionId: "4" },
    { id: "5y", thumbnail: epostaThumbnail, name: "Renew Postal Address", description: "Application to renew postal address", accessibilityTier: "Public", featureId: "5", requirements: ["National ID", "Passport"], providerId: "2", providerName: "Posta Uganda", createdAt: { Time: "2021-09-05", Valid: true }, status: "listed", currentVersionId: "2" },
    { id: "7d", thumbnail: niraThumbnail, name: "Death Certificate Application", description: "Application for Death Certificate", accessibilityTier: "Public", featureId: "7", requirements: ["National ID", "Passport"], providerId: "7", providerName: "National Identification & Registration Authority", createdAt: { Time: "2021-09-03", Valid: true }, status: "subscribed", currentVersionId: "7" },
    { id: "5b", thumbnail: epostaThumbnail, name: "E-Address Application", description: "Application for E-Address", accessibilityTier: "Public", featureId: "5", requirements: ["National ID", "Passport"], providerId: "5", providerName: "Posta Uganda", createdAt: { Time: "2021-09-01", Valid: true }, status: "listed", currentVersionId: "5" },
    { id: "9d", thumbnail: ursbThumbnail, name: "Patent Application", description: "Application for a Patent", accessibilityTier: "Public", featureId: "7", requirements: ["National ID", "Passport"], providerId: "7", providerName: "URSB", createdAt: { Time: "2021-09-03", Valid: true }, status: "listed", currentVersionId: "7" },
    { id: "7f", thumbnail: ministryThumbnail, name: "Visa Application", description: "Application for a Visa", accessibilityTier: "Public", featureId: "7", requirements: ["National ID", "Passport"], providerId: "7", providerName: "Ministry of Internal Affairs", createdAt: { Time: "2021-09-03", Valid: true }, status: "listed", currentVersionId: "7" },
    { id: "4a", thumbnail: niraThumbnail, name: "Driver's Permit Application", description: "Apply for a Driver's Permit", accessibilityTier: "Public", featureId: "7", requirements: ["National ID", "Passport"], providerId: "4", providerName: "Ministry of Works and Transport", createdAt: { Time: "2021-09-07", Valid: true }, status: "listed", currentVersionId: "4" },
    { id: "8d", thumbnail: epostaThumbnail, name: "Postal Address Change", description: "Change Postal Address", accessibilityTier: "Public", featureId: "5", requirements: ["National ID", "Passport"], providerId: "5", providerName: "Posta Uganda", createdAt: { Time: "2021-09-03", Valid: true }, status: "listed", currentVersionId: "5" },
    // ministry of internal affairs work permit application
  ];

  // const dummySubscribedServices: Ref<Service[]> = ref([]);

  const dummySubscribedServices: Service[] = [
    { id: "5b", thumbnail: epostaThumbnail, name: "Post Office Account Creation", description: "Open a Post Office Account", accessibilityTier: "Public", featureId: "5", requirements: ["National ID", "Passport"], providerId: "5", providerName: "Posta Uganda", createdAt: { Time: "2021-09-01", Valid: true }, status: "subscribed", currentVersionId: "5" },
    { id: "7d", thumbnail: ursbThumbnail, name: "Company Dissolution", description: "Dissolve a Company", accessibilityTier: "Public", featureId: "7", requirements: ["National ID", "Passport"], providerId: "7", providerName: "URSB", createdAt: { Time: "2021-09-03", Valid: true }, status: "subscribed", currentVersionId: "7" },
    { id: "8d", thumbnail: ursbThumbnail, name: "National ID Registration", description: "Apply for a National ID", accessibilityTier: "Public", featureId: "7", requirements: ["National ID", "Passport"], providerId: "7", providerName: "National Identification & Registration Authority", createdAt: { Time: "2021-09-03", Valid: true }, status: "subscribed", currentVersionId: "7" },
    { id: "1x", thumbnail: ministryThumbnail, name: "Land Title Registration", description: "Apply for a Land Title", accessibilityTier: "Public", featureId: "4", requirements: ["National ID", "Passport"], providerId: "1", providerName: "Ministry of Lands and Urban Development", createdAt: { Time: "2021-09-04", Valid: true }, status: "listed", currentVersionId: "1" },
    { id: "2y", thumbnail: ursbThumbnail, name: "Company Name Reservation", description: "Reserve a Business Name", accessibilityTier: "Public", featureId: "5", requirements: ["National ID", "Passport"], providerId: "2", providerName: "URSB", createdAt: { Time: "2021-09-05", Valid: true }, status: "listed", currentVersionId: "2" },
    { id: "3z", thumbnail: niraThumbnail, name: "Passport Application", description: "Apply for a Passport", accessibilityTier: "Public", featureId: "6", requirements: ["National ID", "Passport"], providerId: "3", providerName: "Ministry of Internal Affairs", createdAt: { Time: "2021-09-06", Valid: true }, status: "listed", currentVersionId: "3" },

    { id: "6c", thumbnail: naroThumbnail, name: "Agricultural Research", description: "Request for Agricultural Research", accessibilityTier: "Public", featureId: "6", requirements: ["National ID", "Passport"], providerId: "6", providerName: "National Agricultural Research Organization", createdAt: { Time: "2021-09-02", Valid: true }, status: "subscribed", currentVersionId: "6" },
    { id: "3y", thumbnail: ursbThumbnail, name: "File Company Returns", description: "Register a Business", accessibilityTier: "Public", featureId: "5", requirements: ["National ID", "Passport"], providerId: "2", providerName: "URSB", createdAt: { Time: "2021-09-05", Valid: true }, status: "subscribed", currentVersionId: "2" },
  ];


  // const services: Ref<Service[] | undefined> = ref()
  const services: Ref<Service[] | undefined> = ref(dummyServices)
  const subscribedServices: Ref<Service[] | undefined> = ref(dummySubscribedServices)

  const service: Ref<Service | undefined> = ref()
  const serviceSpecification: Ref<ServiceSpecification | undefined> = ref()
  const serviceSpecifications: Ref<ServiceSpecification[] | undefined> = ref()
  const createServiceResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const updateServiceResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const statusUpdateResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const createSpecificationResponse: Ref<ServiceResponseInterface | undefined> = ref()




  const findServiceSpec = async (id: string) => {
    return api.get("/registry/v1/specs/" + id).then((response: any) => {
      serviceSpecification.value = response.data.data
    })
  }

  const updateServiceSpecificationStatus = async (payload: any) => {
    return api.put<ServiceResponseInterface>("/registry/v1/specs/update/status", payload)
      .then((response: any) => {
        statusUpdateResponse.value = response.data
      })
  }

  // async function fetchFloatRequests(filter: any) {
  //   // Simulate API call
  //   // You can adjust this based on the filtering criteria or paging
  //   floatRequests.value = dummyFloatRequests;
  // }

  async function fetchServices(filter: any) {
    // Simulate API call
    // const response = await fetch(`/api/services?limit=${limit}&page=${page}`);
    // const data = await response.json();
    // Use dummy data for now
    services.value = dummyServices;
  }

  async function fetchSubscribedServices(filter: any) {
    // Simulate API call
    // const response = await fetch(`/api/services?limit=${limit}&page=${page}`);
    // const data = await response.json();
    // Use dummy data for now
    subscribedServices.value = dummySubscribedServices;
  }

  // function subscribe(serviceId: string) {
  //   try {
  //     store.subscribeToService(serviceId);
  //     notify.success("Service subscribed successfully!");
  //   } catch (error) {
  //     notify.error("Failed to subscribe to service: " + error.message);
  //   }
  // }

  // make subscribeToService function
  // function subscribeToService(serviceId: string) {
  //   // Simulate API call
  //   // const response = await fetch(`/api/services/subscribe/${serviceId}`);
  //   // const data = await response.json();
  //   //set the status of the service to active
  //   // services.value?.find((service) => service.id === serviceId)?.status === "subscribed";
  //   services.value?.find((service) => service.id === serviceId)!.status === "subscribed";
  //   // Use dummy data for now
  //   subscribedServices.value?.push(dummyServices.find((service) => service.id === serviceId));
  //   // filter it out of the services
  //   services.value = services.value?.filter((service) => service.id !== serviceId);
  // }

  // unsubscribeFromService function
  // function unsubscribeFromService(serviceId: string) {
  //   // Simulate API call
  //   // const response = await fetch(`/api/services/unsubscribe/${serviceId}`);
  //   // const data = await response.json();
  //   //set the status of the service to inactive
  //   // subscribedServices.value?.find((service) => service.id === serviceId)?.status === "listed";
  //   subscribedServices.value?.find((service) => service.id === serviceId)!.status === "listed";
  //   // Use dummy data for now
  //   services.value?.push(dummySubscribedServices.find((service) => service.id === serviceId));
  //   // filter it out of the subscribed services
  //   subscribedServices.value = subscribedServices.value?.filter((service) => service.id !== serviceId);
  // }


  // function subscribeToService(serviceId: string) {
  //   const service = dummyServices.find((s) => s.id === serviceId);
  //   if (service) {
  //     service.status = "subscribed"; // Update status
  //     subscribedServices.value?.push(service);
  //     services.value = services.value?.filter((s) => s.id !== serviceId);
  //   } else {
  //     console.error(`Service with ID ${serviceId} not found for subscription.`);
  //   }
  // }

  function subscribeToService(serviceId: string) {
    const service = services.value?.find((s) => s.id === serviceId);
    if (service) {
      service.status = "subscribed";
      subscribedServices.value?.push(service);
      services.value = services.value?.filter((s) => s.id !== serviceId);
      // Remove from services (reactive way)

      //push the exact service after using its id to find it, push all the details
      // agentStore.services.push({
      //   // id: services.value.length + 1,
      //   name: service.name,
      //   description: service.description,
      //   thumbnail: service.thumbnail,
      //   // name: 'Ministry of Internal Affairs',
      //   // thumbnail: '/assets/coa-19c4edfc.png',
      //   // email: '
      // })
      // Update local storage with the new subscribed service
      localStorageSubscribedServices.value.push(service);
      saveSubscribedServicesToLocalStorage();

    } else {
      console.error(`Service with ID ${serviceId} not found for subscription.`);
    }
  }

  const localStorageSubscribedServices = ref<Service[]>([]);

  // Save manager to local storage
  const saveSubscribedServicesToLocalStorage = () => {
    localStorage.setItem('localStorageSubscribedServices', JSON.stringify(localStorageSubscribedServices.value))
  }

  // function unsubscribeFromService(serviceId: string) {
  //   const service = dummySubscribedServices.find((s) => s.id === serviceId);
  //   if (service) {
  //     service.status = "listed"; // Update status
  //     services.value?.push(service);
  //     subscribedServices.value = subscribedServices.value?.filter((s) => s.id !== serviceId);
  //   } else {
  //     console.error(`Service with ID ${serviceId} not found for unsubscription.`);
  //   }
  // }

  function unsubscribeFromService(serviceId: string) {
    const service = subscribedServices.value?.find((s) => s.id === serviceId);
    if (service) {
      service.status = "listed";
      services.value?.push(service);
      subscribedServices.value = subscribedServices.value?.filter((s) => s.id !== serviceId);
    } else {
      console.error(`Service with ID ${serviceId} not found for unsubscription.`);
    }
  }

  return {
    services,
    subscribedServices,
    service,
    createServiceResponse,
    updateServiceResponse,
    createSpecificationResponse,
    serviceSpecification,
    serviceSpecifications,
    createService,
    fetchSubscribedServices,
    subscribeToService,
    unsubscribeFromService,
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
