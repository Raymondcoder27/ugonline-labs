<script setup lang="ts">
import Logo from "@/assets/images/banner.png";
import ProfileSection from "@/components/ProfileSection.vue";
import { useStorage } from "@vueuse/core";
import { computed, unref, ref } from "vue";
import type { ComputedRef } from "vue";
import { useWindowSize } from "@vueuse/core";
const { width } = useWindowSize();
const isMobile: ComputedRef<boolean> = computed(() => unref(width) <= 768);
const sideMenuOpen = ref(useStorage("sms", true));

const menuOpen = ref(useStorage("sms", true));
</script>


<template>
  <nav
    class="top-0 relative z-50 w-full md:flex-row md:flex-nowrap md:justify-between flex flex-wrap items-center px-2 py-3 navbar-expand-lg border-b border-primary-200 bg-white"
  >
    <div
      class="w-full mx-auto flex justify-between items-center px-4"
    >
      <!-- Left Side: Logo and Toggle -->
      <div class="flex items-center">
        <span
          @click="sideMenuOpen = !sideMenuOpen"
          class="text-primary text-xl block cursor-pointer"
        >
          <i
            :class="
              sideMenuOpen
                ? 'transition ease-in-out rotate-0 duration-200'
                : 'transition ease-in-out -rotate-180 duration-200'
            "
            class="fa-solid fa-angles-left"
          ></i>
        </span>
        <div class="ml-4">
          <span class="my-auto mx-2 text-white rounded font-bold text-xl shadow">
            <b class="rounded-l bg-black-800 p-1">ug</b>
            <b class="bg-yellow-500 p-1">On</b>
            <b class="rounded-r bg-primary-700 p-1">line</b>
          </span>
        </div>
      </div>
      <!-- Right Side: Profile Information -->
      <div class="flex items-center justify-end ml-auto">
        <ProfileSection />
      </div>
    </div>

  </nav>
</template>

<!-- 
<template>
  <nav
    class="top-0 relative z-50 w-full md:flex-row md:flex-nowrap md:justify-start flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg border-b border-primary-200 bg-white"
  >
    <div
      class="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap px-4"
    >
      <div class="flex">
        <div class="w-full">
          <div class="flex flex-grow">
            <span
              @click="sideMenuOpen = !sideMenuOpen"
              class="text-primary text-xl block cursor-pointer"
            >
              <i
                :class="
                  sideMenuOpen
                    ? 'transition ease-in-out rotate-0 duration-200'
                    : 'transition ease-in-out -rotate-180 duration-200'
                "
                class="fa-solid fa-angles-left"
              ></i>
            </span>
            <div class="flex">
              <div class="w-full">
                <span
                  class="my-auto mx-2 text-white rounded font-bold text-xl shadow"
                >
                  <b class="rounded-l bg-black-800 p-1">ug</b>
                  <b class="bg-yellow-500 p-1">On</b>
                  <b class="rounded-r bg-primary-700 p-1">line</b>
                </span>
              </div>
              
              <div
                :class="{
                  'w-full': menuOpen,
                  'group w-auto hover:w-full': !menuOpen,
                }"
                class="relative bg-white flex items-center justify-between z-10 pt-2"
              >
                <div class="block">
                  <p class="font-semibold text-gray-500 text-xs">
                    MWEBE RAYMOND
                  </p>
                  <p class="font-light text-gray-500 text-xs">
                    mwebraymond13@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template> -->

<style scoped></style>





