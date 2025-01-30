<script setup lang="ts">
import Logo from "@/assets/images/banner.png";
import AgentTopMenu from "@/components/AgentTopMenu.vue";
import ProfileSection from "@/components/ProfileSection.vue";
import { useStorage } from "@vueuse/core";
import { computed, unref, ref } from "vue";
import type { ComputedRef } from "vue";
import { useWindowSize } from "@vueuse/core";
const { width } = useWindowSize();
const isMobile: ComputedRef<boolean> = computed(() => unref(width) <= 768);
const topMenuOpen = ref(useStorage("sms", true));
</script>

<template>
  <nav
    class="top-0 relative z-50 w-full md:flex-row md:flex-nowrap md:justify-start flex items-center justify-between px-2 py-1 navbar-expand-lg border-b border-primary-200 bg-white"
  >
    <div class="flex items-center justify-between w-full">
      <!-- Left side: Logo and sidebar toggle button -->
      <div class="flex items-center">
        <div class="flex items-center">
          <!-- <span @click="sideMenuOpen = !sideMenuOpen" class="text-primary text-xl block cursor-pointer">
                <i :class="sideMenuOpen ? 'transition ease-in-out rotate-0 duration-200' : 'transition ease-in-out -rotate-180 duration-200'"
                   class="fa-solid fa-angles-left"></i>
             </span> -->
          <span
            class="my-auto mx-2 text-white rounded font-bold text-xl shadow"
          >
            <b class="rounded-l bg-black-800 p-1">ug</b>
            <b class="bg-yellow-500 p-1">On</b>
            <b class="rounded-r bg-primary-700 p-1">line</b>
          </span>
        </div>
        <!-- <TopMenu /> -->

      </div>
      <div>
        <AgentTopMenu />

      </div>

      <!-- Right side: Center TopMenu -->
      <div class="flex items-center justify-end ml-auto">
        <ProfileSection />
      </div>
    </div>
  </nav>
</template>

<style scoped></style>
