<script setup lang="ts">
import OptionalHeader from "@/components/OptionalHeader.vue";
import AppNotification from "@/components/AppNotification.vue";
import AgentHeader from "@/components/AgentHeader.vue";
</script>

<template>
  <div class="flex flex-col bg-neutral-100 overlow-y-auto min-h-[50vh]">
    <div class="flex flex-col h-full w-full">
      <!-- <OptionalHeader /> -->
      <AgentHeader />
      <main class="h-full flex flex-col">
        <div class="flex flex-row h-full">
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
