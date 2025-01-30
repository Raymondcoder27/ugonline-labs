
import {defineStore} from "pinia";
import {ref, type Ref} from "vue";
import api from "@/config/api";
import type {ApplicationStatistics, ClientApplication} from "@/agentadmindomain/applications/types";

export const useApplications = defineStore("applications", () => {
  const applications: Ref<ClientApplication[] | undefined> = ref()
  const applicationStatistics: Ref<ApplicationStatistics | undefined> = ref()

  const fetchApplications = async (trackingNo:string, serviceId:string, providerId:string, status:string, page:number, limit:number) => {
    let path = "/registry/v1/applications?page="+page+"&limit="+limit
    if(trackingNo){
      path += "&tracking_no="+trackingNo
    }
    if(serviceId){
      path += "&service_id="+serviceId
    }
    if(providerId){
      path += "&provider_id="+providerId
    }
    if(status){
      path += "&status="+status
    }
    return api.get(path).then((response:any) => {
      applications.value = response.data.data
      console.log(response.data.data)
    })
  }

  const fetchApplicationStats = async (status:boolean) => {
    return api.get("/registry/v1/applications/stats?status="+status).then((response:any) => {
      applicationStatistics.value = response.data.data
      console.log(response.data.data)
    })
  }
  return {
    applications,
    applicationStatistics,
    fetchApplications,
    fetchApplicationStats
  };
})
