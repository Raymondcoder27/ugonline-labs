import { useStorage, type RemovableRef } from "@vueuse/core"
import { computed, type ComputedRef } from "vue"
import type { JwtTokenInterface, SignInResponseInterface } from "@/branchmanagerdomain/auth/types"
import { Buffer } from "buffer"

export function useAuth() {
  const validPhone: (phoneNumber: string) => boolean = (phoneNumber: string) => {
    const regEx = /^\+[1-9]\d{10,14}$/ //E164 phone validation
    return regEx.test(phoneNumber)
  }

  const validPassword: (password: string) => boolean = (password: string) => {
    const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    return regEx.test(password)
  }

  const credentials: ComputedRef<SignInResponseInterface | undefined> = computed(() => {
    const c: RemovableRef<string | null> = useStorage("credentials", null, sessionStorage)
    return c.value === null ? undefined : JSON.parse(c.value)
  })

  const accessToken: ComputedRef<JwtTokenInterface | undefined> = computed(() => {
    if (credentials.value === undefined) return undefined
    return JSON.parse(Buffer.from(credentials.value.access_token.split(".")[1], "base64").toString())
  })

  const refreshToken: ComputedRef<JwtTokenInterface | undefined> = computed(() => {
    if (credentials.value === undefined) return undefined
    return JSON.parse(Buffer.from(credentials.value.refresh_token.split(".")[1], "base64").toString())
  })

  return { validPhone, validPassword, credentials, accessToken, refreshToken }
}
