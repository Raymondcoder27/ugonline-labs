
import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import api from "@/config/api";
import type { Service, ServiceResponseInterface, ServiceSpecification } from "@/tilloperatordomain/services/types";
import niraThumbnail from "@/assets/images/nira.png";
import epostaThumbnail from "@/assets/images/eposta.png";
import naroThumbnail from "@/assets/images/naro.png";
import ursbThumbnail from "@/assets/images/ursb.png";
import ministryThumbnail from "@/assets/images/ministry.png";


export const useServicesStore = defineStore("services", () => {
  // const services: Ref<Service[] | undefined> = ref()
  // const service: Ref<Service | undefined> = ref()
  const serviceSpecification: Ref<ServiceSpecification | undefined> = ref()
  const serviceSpecifications: Ref<ServiceSpecification[] | undefined> = ref()
  const createServiceResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const updateServiceResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const statusUpdateResponse: Ref<ServiceResponseInterface | undefined> = ref()
  const createSpecificationResponse: Ref<ServiceResponseInterface | undefined> = ref()




  // services

  const dummyServices = ref<Service[]>([
    {
      id: 1,
      service: "Post Office Account",
      description: "Open a Post Office Account",
      thumbnail: epostaThumbnail,
      acronym: "POA",
      providerName: "Posta Uganda",
      // name: 'Posta Uganda',
      // thumbnail: '/assets/coa-19c4edfc.png',
      // email: 'info@ugapost.co.ug',
      // phone: '+256784944479',
      // address: 'Plot 35 Kampala Road, Kampala',
    },
    {
      id: 2,
      thumbnail: ursbThumbnail,
      service: "Company Dissolution",
      description: "Dissolve a private or public company",
      acronym: "URSB",
      providerName: "URSB",
      // accessibilityTier: "Public",
      // featureId: "7",
      // requirements: ["National ID", "Passport"],
      // providerId: "4",
      // providerName: "Ministry of Works and Transport",
      // createdAt: { Time: "2021-09-07", Valid: true },
      // status: "listed",
      // currentVersionId: "4",
    },
    // {
    //   id: 2,
    //   service: "Driver's Permit Application",
    //   description: "Apply for a Driver's Permit",
    //   thumbnail: niraThumbnail,
    //   // name: 'National Agricultural Research Organization',
    //   // thumbnail: '/assets/coa-19c4edfc.png',
    //   // email: 'info@naro.go.ug',
    //   // phone: '+256-41-320512',
    //   // address: 'Plot 11-13, Lugard Avenue, Entebbe',
    // },
    {
      id: 3,
      service: "National ID Registration",
      description: "Register for a National ID",
      thumbnail: niraThumbnail,
      acronym: "NIRA",
      providerName: "NIRA",
      // name: 'National Identification & Registration Authority',
      // thumbnail: '/assets/coa-19c4edfc.png',
      // email: 'info@nira.com',
      // phone: '0800211700',
      // address: 'National Independence Grounds, Kololo Airstrip',
    },
    {
      id: 4,
      service: "Land Title Registration",
      description: "Register a land title",
      thumbnail: ministryThumbnail,
      acronym: "MLHUD",
      providerName: "Ministry of Lands and Urban Development",
      // name: 'Ministry of Lands and Urban Development',
      // thumbnail: '/assets/coa-19c4edfc.png',
      // email: 'info@mlhud.go.ug',
      // phone: '0414355355',
      // address: 'Dewinton Road',
    },
    {
      id: 5,
      service: "Name Reservation",
      description: "Reserve a company name",
      thumbnail: ursbThumbnail,
      acronym: "URSB",
      providerName: "URSB",
      // name: 'URSB',
      // thumbnail: '/assets/coa-19c4edfc.png',
      // email: 'ursb@ursb.go.ug',
      // phone: '0312211211',
      // address: 'Plot 1 Baskerville Avenue',
    },
    {
      id: 6,
      service: "Passport Application",
      description: "Apply for a passport",
      thumbnail: niraThumbnail,
      acronym: "MOIA",
      providerName: "Ministry of Internal Affairs",
      // name: 'Ministry of Internal Affairs',
      // thumbnail: '/assets/coa-19c4edfc.png',
      // email: 'info@moia.go.ug',
      // phone: '0312123123',
      // address: '',
    },
    {
      id: 7,
      thumbnail: naroThumbnail,
      service: "Agricultural Research",
      description: "Get agricultural Research Services",
      acronym: "NARO",
      providerName: "NARO",
      // name: 'National Agricultural Research Organization',
      // accessibilityTier: "Public",
      // featureId: "7",
      // requirements: ["National ID", "Passport"],
      // providerId: "4",
      // providerName: "Ministry of Works and Transport",
      // createdAt: { Time: "2021-09-07", Valid: true },
      // status: "listed",
      // currentVersionId: "4",
    },
    {
      id: 8,
      thumbnail: ursbThumbnail,
      service: "File Company Returns",
      description: "Company File Resolution for private and public companies",
      acronym: "URSB",
      providerName: "URSB",
      // accessibilityTier: "Public",
      // featureId: "7",
      // requirements: ["National ID", "Passport"],
      // providerId: "4",
      // providerName: "Ministry of Works and Transport",
      // createdAt: { Time: "2021-09-07", Valid: true },
      // status: "listed",
      // currentVersionId: "4",
    },
    {
      id: 9,
      thumbnail: ministryThumbnail,
      service: "Land Title Search",
      description: "Search for a land title",
      acronym: "MLHUD",
      providerName: "Ministry of Lands and Urban Development",
      // name: 'Ministry of Works and Transport',
      // accessibilityTier: "Public",
      // featureId: "7",
      // requirements: ["National ID", "Passport"],
      // providerId: "4",
      // providerName: "Ministry of Works and Transport",
      // createdAt: { Time: "2021-09-07", Valid: true },
      // status: "listed",
      // currentVersionId: "4",
    },
    {
      id: 10,
      thumbnail: ministryThumbnail,
      service: "Land Title Transfer",
      description: "Transfer a land title",
      acronym: "MLHUD",
      providerName: "Ministry of Lands and Urban Development",
      // accessibilityTier: "Public",
      // featureId: "7",
      // requirements: ["National ID", "Passport"],
      // providerId: "4",
      // providerName: "Ministry of Works and Transport",
      // createdAt: { Time: "2021-09-07", Valid: true },
      // status: "listed",
      // currentVersionId: "4",
    },

    {
      id: 12,
      thumbnail: ministryThumbnail,
      service: "Land Title Withdrawal",
      description: "Withdraw a land title",
      acronym: "MLHUD",
      providerName: "Ministry of Lands and Urban Development",
      // accessibilityTier: "Public",
      // featureId: "7",
      // requirements: ["National ID", "Passport"],
      // providerId: "4",
      // providerName: "Ministry of Works and Transport",
      // createdAt: { Time: "2021-09-07", Valid: true },
      // status: "listed",
      // currentVersionId: "4",
    },

  ]);


  // const subscribedServicesFromLocalStorage = JSON.parse(localStorage.getItem('localStorageSubscribedServices') || '[]');

  // if (subscribedServicesFromLocalStorage) {
  //   subscribedServicesFromLocalStorage.value = subscribedServicesFromLocalStorage;
  // }

  const services: Ref<Service[] | undefined> = ref(dummyServices)

  // const services: Ref<Service[] | undefined> = ref(subscribedServicesFromLocalStorage);


  const service: Ref<Service | undefined> = ref()

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

  const fetchServices = async (page: number, limit: number) => {
    return api.get("/registry/v1?page=" + page + "&limit=" + limit).then((response: any) => {
      services.value = response.data.data
    })
  }

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
