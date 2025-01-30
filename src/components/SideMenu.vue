<script setup lang="ts">
import {
  watch,
  computed,
  ref,
  unref,
  type ComputedRef,
  type Ref,
  onMounted,
} from "vue";
import { useStorage, useWindowSize } from "@vueuse/core";
import { type SideMenuLink } from "@/types";
import { useRoute, useRouter } from "vue-router";
import { useAccountStore } from "@/agentadmindomain/auth/stores";

const { width } = useWindowSize();
const isMobile: ComputedRef<boolean> = computed(() => unref(width) <= 768);
const menuOpen = ref(useStorage("sms", true));
const loading: Ref<boolean> = ref(false);
const route = useRoute();
const router = useRouter();
const accountStore = useAccountStore();
const sideMenu: SideMenuLink[] = [
  {
    name: "app-dashboard",
    label: "Dashboard",
    iconClass: "fa-solid fa-gauge",
  },
  // {
  //   name: "app-entities",
  //   label: "Entities",
  //   iconClass: "fa-solid fa-landmark",
  // },
  {
    name: "app-branches",
    label: "Branches",
    // iconClass: "fa-solid fa-code-branch",
    iconClass: "fa-solid fa-building"
  },
  // {
  //   name: "app-agents",
  //   label: "Agents",
  //   iconClass: "fa-solid fa-people-group",
  // },
  {
    name: "app-services",
    label: "Service Subscriptions",
    iconClass: "fa-solid fa-list",
  },
  {
    name: "app-billing",
    label: "Finances",
    // iconClass: "fa-solid fa-money-bill",
    iconClass: "fa-solid fa-coins"
  },
  {
    name: "app-reports",
    label: "Reports",
    iconClass: "fa-solid fa-chart-line",
  },
  // {
  //   name: "app-services-details",
  //   label: "Services Details",
  //   iconClass: "fa-solid fa-list"
  // },
  {
    name: "app-accounts",
    label: "Accounts",
    iconClass: "fa-solid fa-users",
  },
  // {
  //   name: "app-configurations",
  //   label: "Configurations",
  //   iconClass: "fa-solid fa-sliders",
  // },
  // {
  //   name: "app-gateway",
  //   label: "Gateway",
  //   iconClass: "fa-solid fa-server",
  // },
];
const navigate: (link: SideMenuLink) => void = (link: SideMenuLink) => {
  //hide sidemenu if viewed on a mobile device
  isMobile.value ? (menuOpen.value = false) : "";

  //navigate away if not on the same page
  if (route.name !== link.name) {
    router.push({ name: link.name });
    if (link.children !== undefined) {
      currentParent.value = link;
    } else {
      currentParent.value = null;
    }
  } else {
    currentParent.value = currentParent.value === null ? link : null;
  }
};
const currentParent: Ref<SideMenuLink | null> = ref(null);
const isRouteActive: (link: SideMenuLink) => Boolean = (link: SideMenuLink) => {
  return route.name === link.name;
};

watch(
  () => route.name,
  (data) => {
    if (typeof data === "string") {
      const link = sideMenu.find((menuLink) => data.includes(menuLink.name));
      currentParent.value = link === undefined ? null : link;
    }
  }
);
onMounted(() => {
  if (typeof route.name === "string") {
    const link = sideMenu.find(
      (menuLink) =>
        typeof route.name === "string" && route.name.includes(menuLink.name)
    );
    currentParent.value = link === undefined ? null : link;
  }

  accountStore
    .fetchProfile()
    .then(() => (loading.value = false))
    .catch((error: any) => {
      loading.value = false;
      console.log(error);
    });
});

function logout() {
  accountStore
    .logout()
    .then(() => {
      loading.value = false;
      sessionStorage.clear();
      localStorage.clear();
      window.location.reload();
    })
    .catch((error: any) => {
      loading.value = false;
      sessionStorage.clear();
      localStorage.clear();
      console.log(error);
    });
}
</script>

<template>
  <div v-if="!isMobile" class="">
    <Transition
      enter-from-class="-translate-x-0"
      enter-active-class="transition-all duration-300 ease-in-out"
      leave-to-class="translate-x-0"
      leave-active-class="transition-all duration-150 ease-in-out"
    >
      <div
        :class="{ 'w-64': menuOpen, 'group w-16 hover:w-64': !menuOpen }"
        class="relative h-full bg-white shadow-xl flex flex-col items-stretch justify-between z-10 pt-2"
      >
        <div class="flex flex-col min-h-full px-0 w-full mx-auto">
          <!-- <div class="flex px-2 pb-5" v-if="menuOpen">
            <div class="w-full text-center shadow py-2 rounded-lg">
              <div class="flex py-1 px-2">
                <div class="w-full text-center" v-if="accountStore.profile">
                  <i
                    class="fa-solid fa-user mx-auto bg-gray-50 shadow p-3 my-2"
                    style="font-size: 30px"
                  ></i>
                  <p class="text-xs font-bold">
                    {{ accountStore.profile.firstName }}
                    {{ accountStore.profile.lastName }}
                  </p>
                  <p class="text-xs">{{ accountStore.profile.username }}</p>
                  <p class="text-xs">{{ accountStore.profile.phone }}</p>
                </div>
              </div>
              <button
                class="px-2 border border-primary-500 text-primary-700 rounded text-xs hover:bg-primary hover:text-white"
                @click="logout"
              >
                Logout
                <span class="lds-ring mx-1" v-if="loading">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </span>
              </button>
            </div>
          </div> -->

          <!-- Link Section-->
          <div class="flex flex-col flex-grow overflow-y-auto mt-1">
            <div
              v-for="(link, idx) in sideMenu"
              @click="navigate(link)"
              :key="idx"
              class="relative items-center flex flex-row space-x-2"
              :class="{
                'cursor-default text-primary border-l-4 border-primary pl-5 bg-blue-50':
                  isRouteActive(link),
                'cursor-pointer text-neutral-500 hover:bg-neutral-100 pl-6':
                  !isRouteActive(link),
                'py-2': menuOpen,
                'py-3': !menuOpen,
              }"
            >
              <i class="my-auto text-sm fa-fw" :class="link.iconClass"></i
              ><span
                class="my-auto text-sm align-middle"
                :class="{
                  'font-bold': isRouteActive(link),
                  'inline-block': menuOpen,
                  'hidden group-hover:inline-block': !menuOpen,
                }"
                >{{ link.label }}</span
              >
            </div>
          </div>
          <!-- /Link Section-->
        </div>
      </div>
    </Transition>
  </div>
  <div v-else class="">
    <Transition
      enter-from-class="-translate-x-0"
      enter-active-class="transition-all duration-300 ease-in-out"
      leave-to-class="translate-x-0"
      leave-active-class="transition-all duration-150 ease-in-out"
    >
      <div
        v-if="menuOpen"
        class="relative h-full bg-white shadow-xl flex flex-col items-stretch justify-between w-64 z-10 py-4 md:pb-6"
      >
        <div class="flex flex-col min-h-full px-0 w-full mx-auto">
          <!-- Link Section-->
          <div class="flex flex-col flex-grow overflow-y-auto mt-1">
            <div
              v-for="(link, idx) in sideMenu"
              @click="navigate(link)"
              :key="idx"
              class="cursor-pointer items-center flex flex-row space-x-2 py-2"
              :class="
                isRouteActive(link)
                  ? 'text-primary-700 border-l-4 border-primary-700 pl-5 bg-blue-50'
                  : 'text-neutral-500 hover:bg-neutral-100 pl-6'
              "
            >
              <i class="my-auto text-sm fa-fw" :class="link.iconClass"></i
              ><span
                class="my-auto text-sm align-middle"
                :class="isRouteActive(link) ? 'font-bold' : ''"
                >{{ link.label }}</span
              >
            </div>
          </div>
          <!-- /Link Section-->
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/forms.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";
</style>
