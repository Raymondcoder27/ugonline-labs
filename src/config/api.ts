import { useCommonsStore } from "@/stores/commons"
import axios from "axios"
import { useAuth } from "@/agentadmindomain/auth/composables"
import { useStorage, type RemovableRef } from "@vueuse/core"

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL
})

api.interceptors.request.use((config) => {
  const { credentials } = useAuth()

  if (credentials.value !== undefined) {
    config.headers.Authorization = `${credentials.value.token_type} ${credentials.value.access_token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const c: RemovableRef<string | null> = useStorage("credentials", null, sessionStorage)
    const commons = useCommonsStore()
    commons.loading = false

    // if (error.response !== undefined && error.response.status === 401) {
    //   c.value = null
    // }

    return Promise.reject(error)
  }
)

export default api
