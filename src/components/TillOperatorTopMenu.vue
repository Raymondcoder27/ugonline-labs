<script setup lang="ts">
import {
  watch,
  computed,
  ref,
  unref,
  type ComputedRef,
  type Ref,
  onMounted,
  reactive,
} from "vue";
import { useStorage, useWindowSize } from "@vueuse/core";
import { type TopMenuLink } from "@/types";
import { useRoute, useRouter } from "vue-router";
import { useAccountStore } from "@/tilloperatordomain/auth/stores";

const { width } = useWindowSize();
const isMobile: ComputedRef<boolean> = computed(() => unref(width) <= 768);
const menuOpen = ref(useStorage("sms", true));
const loading: Ref<boolean> = ref(false);
const route = useRoute();
const router = useRouter();
const accountStore = useAccountStore();
const topMenu: TopMenuLink[] = [
  {
    name: "agent-app-services",
    label: "Services",
    iconClass: "fa-solid fa-home",
  },
  // {
  //   name: "api-services",
  //   label: "Services",
  //   iconClass: "fa-solid fa-list",
  // },
  // {
  //   name: "app-services-details",
  //   label: "SERVICES DETAILS",
  //   iconClass: "fa-solid fa-list",
  // },
  //add activity log
  {
    name: "agent-app-submissions",
    label: "Submissions",
    // iconClass: "fa-solid fa-upload",
    // iconClass: "fa fa-paper-plane",
    iconClass: "fa fa-check-circle",
  },
  // {
  //   name: "agent-api-app-submissions",
  //   label: "Submissions",
  //   // iconClass: "fa-solid fa-upload",
  //   // iconClass: "fa fa-paper-plane",
  //   iconClass: "fa fa-check-circle",
  // },
  {
    name: "agent-app-ledger",
    label: "Ledger",
    iconClass: "fa-solid fa-money-check",
  },
  //  {
  //   name: "api-services",
  //   label: "Services",
  //   iconClass: "fa-solid fa-list",
  // }
];

const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page: 0,
  sort: [
    {
      field: "firstname",
      order: "ASC",
    },
  ],
  filter: [
    {
      field: "firstname",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "username",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "phone",
      operand: "",
      operator: "CONTAINS",
    },
  ],
});

const navigate: (link: TopMenuLink) => void = (link: TopMenuLink) => {
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
const currentParent: Ref<TopMenuLink | null> = ref(null);
const isRouteActive: (link: TopMenuLink) => Boolean = (link: TopMenuLink) => {
  return route.name === link.name;
};

watch(
  () => route.name,
  (data) => {
    if (typeof data === "string") {
      const link = topMenu.find((menuLink) => data.includes(menuLink.name));
      currentParent.value = link === undefined ? null : link;
    }
  }
);
onMounted(() => {
  if (typeof route.name === "string") {
    const link = topMenu.find(
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

// // watch for changes in the filter object
// watch(
//   () => filter,
//   () => updateFilter(),
//   { deep: true }
// )
</script>

<!-- -->


<template>
  <!-- Desktop Menu: Centered Horizontally -->
  <div v-if="!isMobile" class="flex justify-center text-center w-full">
    <!-- Center the entire container for desktop -->
    <Transition
      enter-from-class="-translate-x-0"
      enter-active-class="transition-all duration-300 ease-in-out"
      leave-to-class="translate-x-0"
      leave-active-class="transition-all duration-150 ease-in-out"
    >
      <div
        :class="{ 'w-full': menuOpen, 'group w-auto hover:w-full': !menuOpen }"
        class="relative bg-white flex items-center justify-between z-10 pt-2"
      >
        <div
          class="flex flex-row items-center w-full space-x-6 px-4 py-2 text-sm"
        >
          <!-- User Profile and Logout Section -->

          <!-- Link Section-->
          <div class="flex space-x-10">
            <!-- <p>SEARCH SERVICE</p> -->
            <!-- <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[0].operand"
            class="filter-element e-input" type="text" placeholder="SEARCH SERVICE" /> -->
            <div
              v-for="(link, idx) in topMenu"
              @click="navigate(link)"
              :key="idx"
              class="cursor-pointer items-center flex space-x-2 py-2"
              :class="
                isRouteActive(link)
                  ? 'text-primary-700 border-b-2 border-primary-700'
                  : 'text-neutral-500 hover:text-red-700 hover:border-b-2 hover:border-red-700'
              "
            >
              <i class="my-auto text-sm fa-fw" :class="link.iconClass"></i>
              <span class="my-auto text-sm font-semibold">{{
                link.label
              }}</span>
            </div>
          </div>

          <!-- <div class="flex items-center space-x-4">
            <i class="fa-solid fa-user text-xl"></i>
            <p class="text-sm font-bold">
              {{ accountStore.profile?.firstName }}
            </p>
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
          </div> -->
        </div>
      </div>
    </Transition>
  </div>

  <!-- Mobile Menu: Toggled State -->
  <div v-else class="block">
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
              v-for="(link, idx) in topMenu"
              @click="navigate(link)"
              :key="idx"
              class="cursor-pointer items-center flex flex-row space-x-2 py-2"
              :class="
                isRouteActive(link)
                  ? 'text-primary-700 border-l-4 border-primary-700 pl-5 bg-blue-50'
                  : 'text-neutral-500 hover:bg-red-200 border-primary-300  pl-6'
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
