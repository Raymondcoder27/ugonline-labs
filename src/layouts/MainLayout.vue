<script setup lang="ts">
import Header from "../components/Header.vue";
import SideMenu from "../components/SideMenu.vue";
import AppNotification from "../components/AppNotification.vue";
import { useAuth } from "../agentadmindomain/auth/composables"
import { useAccountStore } from "../agentadmindomain/auth/stores"
import { onMounted, reactive, watch } from "vue"
import type { TokenRefreshPayloadInterface } from "../agentadmindomain/auth/types"
import { useRouter } from "vue-router"

const { accessToken, credentials } = useAuth()
const router = useRouter()
const store = useAccountStore()
watch(
  credentials,
  (data) => {
    if (data === undefined) {
      router.push({ name: "app-account-sign-in" })
    }
  },
  { deep: true }
)
const form: TokenRefreshPayloadInterface = reactive({
  refresh_token: ""
})
onMounted(() => {
  // temporary fix for refresh logic
  setInterval(
    () => {
      if (credentials.value !== undefined && accessToken.value !== undefined) {
        form.refresh_token = credentials.value.refresh_token
        store.refresh(form)
      }
    },
    30 * 60 * 1000
  )
})
</script>

<template>
  <div class="flex flex-col w-screen h-screen bg-neutral-100">
    <div class="flex flex-col h-full w-full">
      <Header />
      <main class="h-full flex flex-col">
        <div class="flex flex-row h-full">
          <SideMenu />
          <div class="flex flex-col flex-grow">
            <!-- Main Content Goes Here -->
            <div class="relative w-full flex-grow bg-gray-50 p-2">
              <RouterView />
            </div>
            <!-- /Main Content Goes Here -->

            <!-- Footer Goes Here -->
            <!-- /Footer Goes Here -->
          </div>
        </div>
      </main>
    </div>
    <AppNotification />
  </div>
</template>

<style scoped></style>
