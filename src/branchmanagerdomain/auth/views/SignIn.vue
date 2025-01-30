<script setup lang="ts">
import { reactive, ref, watch, type Ref, type ComputedRef, computed, onMounted } from "vue"
import Logo from "@/assets/images/banner.png"
import type { SignInPayloadInterface } from "@/branchmanagerdomain/auth/types"
import { useAccountStore } from "@/branchmanagerdomain/auth/stores"
import { useRouter } from "vue-router"
import { useAuth } from "@/branchmanagerdomain/auth/composables"
import { useCommonsStore } from "@/stores/commons"

const router = useRouter()
const store = useAccountStore()
const commons = useCommonsStore()
const form: SignInPayloadInterface = reactive({
  username: "",
  password: ""
})
const loading: Ref<boolean> = ref(false)
const email: Ref<string> = ref("")
const signIn = async () => {
  loading.value = true
  store
    .signIn(form)
    .then(() => (loading.value = false))
    .catch((error: any) => {
      loading.value = false
      commons.formatError(error)
    })
}
onMounted(() => {
  // c.value = null
})
watch(
  () => email.value,
  (data) => {
    form.username = data.replace(" ", "").toLowerCase()
  }
)
const validForm: ComputedRef<boolean> = computed(() => {
  return form.username.length > 0 && form.password.length >= 8
})
const { credentials } = useAuth()
watch(
  () => credentials.value,
  (data) => {
    if (data !== undefined) {
      router.push({ name: "providers" })
    }
  },
  { deep: true }
)
</script>

<template>
  <div class="grid grid-cols-1 gap-4 bg-white m-auto w-full py-5 max-w-lg">
    <div class="flex">
      <div class="w-9/12 mx-auto rounded-lg border border-primary-200 py-5">
        <div class="flex flex-col space-y-0 pb-2 text-center">
           <span class="my-auto mx-2 text-white rounded font-bold text-2xl py-2">
            <b class="rounded-l bg-black-800 p-1">ug</b>
            <b class="bg-yellow-500 p-1">On</b>
            <b class="rounded-r bg-primary-700 p-1">line</b>
          </span>
          <!-- <span class="text-xl font-bold text-primary tracking-tight">{{ appName }}</span> -->
          <span class="font-bold text-primary-700">Sign in to continue</span>
        </div>
        <form @submit.prevent="signIn()">
          <div class="w-full px-3 pt-3">
            <div class="flex flex-col py-1">
              <label class="font-bold text-sm">Username/Email</label>
              <input required class="e-input form-element !px-5 lowercase" v-model.trim="email" type="email" />
            </div>
            <div class="flex flex-col py-1">
              <label class="font-bold text-sm">Password</label>
              <input required class="e-input form-element !px-5" v-model.trim="form.password" type="password" />
            </div>

            <div class="flex flex-col py-1">
              <label class="cursor-pointer text-sm italic hover:underline hover:text-primary-800">Forgot Password?</label>
            </div>

            <button :disabled="!validForm" type="submit" class="mt-2 button">
              Sign In
              <span class="lds-ring mx-1" v-if="loading">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </span>
            </button>
            <!-- <span class="w-full text-center text-xs">
          Don't have an account?
          <span @click="router.push({ name: 'app-account-sign-up' })" class="cursor-pointer font-semibold text-primary-900 hover:underline">
            Sign Up Now
          </span>
        </span> -->
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/forms.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";
</style>
@/branchmanager/auth/types@/branchmanager/auth/stores@/branchmanager/auth/composables