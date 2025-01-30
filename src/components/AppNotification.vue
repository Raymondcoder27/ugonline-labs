<script setup lang="ts">
import { useNotificationsStore } from "@/stores/notifications";
import { cva } from "class-variance-authority";
import { computed, ref, watch, type PropType, type Ref } from "vue";

const notifications = useNotificationsStore();
// alert positions
const Positions: readonly [
  "top-center",
  "top-left",
  "top-right",
  "bottom-center",
  "bottom-right",
  "bottom-left",
] = [
  "top-center",
  "top-left",
  "top-right",
  "bottom-center",
  "bottom-right",
  "bottom-left",
] as const;
type TPosition = (typeof Positions)[number];

// color theme
const props = defineProps({
  position: {
    type: String as PropType<TPosition>,
    default: "top-right",
  },
});
const notificationClass = computed(() => {
  return cva(
    `fixed bg-white border-2 shadow-2xl drop-shadow-2xl rounded-md p-3 pl-1.5 px-4 w-80 flex flex-row justify-center z-50`,
    {
      variants: {
        intent: {
          "top-center": "place-self-center top-16",
          "top-left": "mr-auto top-20 left-3",
          "top-right": "ml-auto top-20 right-3",
          "bottom-center": "place-self-center bottom-2",
          "bottom-left": "mr-auto bottom-20 left-4",
          "bottom-right": "ml-auto bottom-20 right-4",
        },
      },
    },
  )({
    intent: props.position,
  });
});
const timeOut: Ref<ReturnType<typeof setTimeout> | undefined> = ref();
const timeOutAlert = () => {
  if (notifications.duration === null) return;
  timeOut.value = setTimeout(() => {
    notifications.hide();
  }, notifications.duration * 1000);
};
watch(
  () => notifications.message,
  (data) => {
    if (data.trim().length > 0) {
      timeOutAlert();
    }
  },
  { deep: true },
);
const stick = () => {
  if (timeOut.value !== undefined) {
    clearTimeout(timeOut.value);
  }
  notifications.stick();
};
</script>

<template>
  <template v-if="notifications.visible" class="">
    <!-- Success -->
    <div v-if="notifications.theme === 'success'" :class="notificationClass" class="border-success-700">
      <div class="absolute flex space-x-2 top-1 right-1.5">
        <i @click="stick()" :class="`text-success-800`"
          class="cursor-pointer mt-auto text-sm fa-solid fa-thumbtack"></i>
        <i @click="notifications.hide()" :class="`text-success-800`" class="cursor-pointer fa-solid fa-xmark"></i>
      </div>
      <div class="flex space-x-1.5 w-full h-full">
        <div :class="`bg-success-200`" class="my-auto flex rounded-full p-1.5">
          <i :class="`text-success-700`" class="m-auto fa-2x fa-solid fa-circle-check"></i>
        </div>
        <div class="text-xs flex-wrap my-auto pr-1.5">
          {{ notifications.message }}
        </div>
      </div>
    </div>
    <!-- /Success -->

    <!-- Primary -->
    <div v-if="notifications.theme === 'primary'" :class="notificationClass" class="border-primary-700">
      <div class="absolute flex space-x-2 top-1 right-1.5">
        <i @click="stick()" :class="`text-primary-800`"
          class="cursor-pointer mt-auto text-sm fa-solid fa-thumbtack"></i>
        <i @click="notifications.hide()" :class="`text-primary-800`" class="cursor-pointer fa-solid fa-xmark"></i>
      </div>
      <div class="flex space-x-1.5 w-full h-full">
        <div :class="`bg-primary-200`" class="my-auto flex rounded-full p-1.5">
          <i :class="`text-primary-700`" class="m-auto fa-2x fa-solid fa-circle-info"></i>
        </div>
        <div class="text-xs flex-wrap my-auto pr-1.5">
          {{ notifications.message }}
        </div>
      </div>
    </div>
    <!-- /Primary -->

    <!-- Warning -->
    <div v-if="notifications.theme === 'warning'" :class="notificationClass" class="border-warning-700">
      <div class="absolute flex space-x-2 top-1 right-1.5">
        <i @click="stick()" :class="`text-warning-800`"
          class="cursor-pointer mt-auto text-sm fa-solid fa-thumbtack"></i>
        <i @click="notifications.hide()" :class="`text-warning-800`" class="cursor-pointer fa-solid fa-xmark"></i>
      </div>
      <div class="flex space-x-1.5 w-full h-full">
        <div :class="`bg-warning-200`" class="my-auto flex rounded-full p-1.5">
          <i :class="`text-warning-700`" class="m-auto fa-2x fa-solid fa-circle-exclamation"></i>
        </div>
        <div class="text-xs flex-wrap my-auto pr-1.5">
          {{ notifications.message }}
        </div>
      </div>
    </div>
    <!-- /Warning -->

    <!-- Danger -->
    <div v-if="notifications.theme === 'danger'" :class="notificationClass" class="border-danger-700">
      <div class="absolute flex space-x-2 top-1 right-1.5">
        <i @click="stick()" :class="`text-danger-800`" class="cursor-pointer mt-auto text-sm fa-solid fa-thumbtack"></i>
        <i @click="notifications.hide()" :class="`text-danger-800`" class="cursor-pointer fa-solid fa-xmark"></i>
      </div>
      <div class="flex space-x-1.5 w-full h-full">
        <div :class="`bg-danger-200`" class="my-auto flex rounded-full p-1.5">
          <i :class="`text-danger-700`" class="m-auto fa-2x fa-solid fa-circle-xmark"></i>
        </div>
        <div class="text-xs flex-wrap my-auto pr-1.5">
          {{ notifications.message }}
        </div>
      </div>
    </div>
    <!-- /Danger -->

    <!-- Info -->
    <div v-if="notifications.theme === 'info'" :class="notificationClass" class="border-info-700">
      <div class="absolute flex space-x-2 top-1 right-1.5">
        <i @click="stick()" :class="`text-info-800`" class="cursor-pointer mt-auto text-sm fa-solid fa-thumbtack"></i>
        <i @click="notifications.hide()" :class="`text-info-800`" class="cursor-pointer fa-solid fa-xmark"></i>
      </div>
      <div class="flex space-x-1.5 w-full h-full">
        <div :class="`bg-info-200`" class="my-auto flex rounded-full p-1.5">
          <i :class="`text-info-700`" class="m-auto fa-2x fa-solid fa-circle-info"></i>
        </div>
        <div class="text-xs flex-wrap my-auto pr-1.5">
          {{ notifications.message }}
        </div>
      </div>
    </div>
    <!-- /Info -->
  </template>
</template>

<style scoped></style>
