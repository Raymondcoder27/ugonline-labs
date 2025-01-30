<script setup lang="ts">
import router from "@/router";
import Logo from "@/assets/images/banner.png";

function goHome(){
  router.push({name:"providers"})
}
</script>

<template>
  <nav
      class="top-0 relative z-50 w-full md:flex-row md:flex-nowrap md:justify-start flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg border-b-2 border-primary bg-white">
    <div
        class="w-full mx-auto items-center flex justify-between md:flex-nowrap flex-wrap px-4">
      <!-- Logo -->
      <div class="flex">
        <div class="w-full">
          <div class="flex flex-grow">
            <span
                @click="goHome"
                class="text-primary block cursor-pointer">
              <i class="cursor-pointer fa-solid fa-arrow-circle-left" style="font-size: 25px"></i>
            </span>
            <div class="flex">
              <div class="w-full">
                <img :src="Logo" class="w-24"/>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </nav>

</template>

<style scoped></style>
