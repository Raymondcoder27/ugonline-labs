<script setup lang="ts">

import Logo from "@/assets/images/banner_gs.png";
</script>

<template>
  <div class="flex">
    <div class="w-full flex flex-col bg-primary-700 text-white px-4 py-5">
      <div class="flex space-x-2 container mx-auto">
        <div class="w-full px-2 flex-grow flex flex-col space-y-2 py-1 text-sm">
          <p class="cursor-pointer text-primary-200 hover:text-primary-200">Feedback</p>
          <p class="cursor-pointer text-primary-200 hover:text-primary-200">FAQs</p>
        </div>
        <div class="w-full px-2 flex-grow flex flex-col space-y-2 py-1 text-sm">
          <p class="cursor-pointer text-primary-200 hover:text-primary-200">News</p>
          <p class="cursor-pointer text-primary-200 hover:text-primary-200">Help Topics</p>
        </div>

        <div class="w-full px-2 flex-grow flex flex-col space-y-2 py-1 text-sm">
          <p class="cursor-pointer text-primary-200 hover:text-primary-200">Contact Us</p>
          <p class="cursor-pointer text-primary-200 hover:text-primary-200">About Us</p>
        </div>

        <div class="w-full px-2 flex-grow text-sm text-gray-100">
          <p class="pb-3"><span class="font-bold text-gray-200">Hotline</span> <br />0414 774 430</p>
          <p class="pb-3">
            <span class="font-bold text-gray-200">Operating hours</span> <br />
            8am - 10pm (Mondays to Fridays)<br />
            8am - 2pm (Saturdays)
          </p>
        </div>
        <div class="w-full px-2 flex-grow text-sm text-gray-100">
          <p class="pb-3">
            <span class="font-bold text-gray-200">Email</span>
            <br />inquiries@moict.go.ug
          </p>
        </div>
      </div>
      <div class="flex container mx-auto mt-3 text-sm text-primary-200 py-2" style="border-top: solid 0.5px #fff">
        <div class="w-4/12">
          <span class="px-2 cursor-pointer hover:text-primary-200">Privacy Statement</span>
          <span class="px-2 cursor-pointer hover:text-primary-200">Terms of Use</span>
        </div>

        <div class="w-4/12"></div>
        <div class="w-4/12">
          <div class="flex">
            <div class="w-full">
              <p class="float-right cursor-pointer hover:text-white">&copy; 2024 Government of the Republic of Uganda</p>
            </div>
          </div>
          <div class="flex">
            <div class="w-full">
              <div class="flex float-right mt-2">
                <div class="w-4/12 bg-black-800 border-b border-gray-100" style="height: 5px; width: 50px"></div>
                <div class="w-4/12 bg-yellow-500" style="height: 5px; width: 50px"></div>
                <div class="w-4/12 bg-red-600" style="height: 5px; width: 50px"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>