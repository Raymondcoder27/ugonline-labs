import {defineStore} from "pinia";
import {ref, type Ref} from "vue";
import {type GatewayResponseInterface} from "@/branchmanagerdomain/gateway/types";
import api from "@/config/api";
import type {ProviderRegistrationStatistic, Statistic} from "@/branchmanagerdomain/analytics/types/chart";

export const useGatewayReportsStore = defineStore("gateway-reports", () => {
    const providersByRegistration: Ref<ProviderRegistrationStatistic[] | undefined> = ref()
    const requestComparison: Ref<Statistic[] | undefined> = ref()

    const fetchProviderByRegistrations = async () => {
        return api.get<GatewayResponseInterface>("/gateway/reports/providers/registrations")
            .then((response:any) => {
                providersByRegistration.value = response.data.data
            })
    }
    const fetchRequestComparison = async (x:string, y:string) => {
        return api.get<GatewayResponseInterface>("/gateway/reports/requests/compare/"+x+"/"+y)
            .then((response:any) => {
                requestComparison.value = response.data
            })
    }

    return {
        providersByRegistration,
        requestComparison,
        fetchRequestComparison,
        fetchProviderByRegistrations
    };
})