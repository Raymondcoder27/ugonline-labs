<script setup lang="ts">
import { computed } from "vue";
import { cva } from "class-variance-authority";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  static: Boolean,
  xs: Boolean,
  sm: Boolean,
  md: Boolean,
  lg: Boolean,
  xl: Boolean,
  xl2: Boolean,
  xl4: Boolean,
  xl6: Boolean,
});
const emit = defineEmits(["update:modelValue"]);
const modalClass = computed(() => {
  return cva(
    "w-full transform relative rounded-md z-[65] bg-white text-left align-middle shadow-xl transition-all",
    {
      variants: {
        xs: { true: "max-w-xs" },
        sm: { true: "max-w-sm" },
        md: { true: "max-w-md" },
        lg: { true: "max-w-lg" },
        xl: { true: "max-w-xl" },
        xl2: { true: "max-w-2xl" },
        xl4: { true: "max-w-4xl" },
        xl6: { true: "max-w-6xl" },
      },
    },
  )({
    xs: props.xs,
    sm: props.sm,
    md: props.md,
    lg: props.lg,
    xl: props.xl,
    xl2: props.xl2,
    xl4: props.xl4,
    xl6: props.xl6,
  });
});
const closeModal: () => void = () => {
  emit("update:modelValue", props.static);
};
</script>

<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog as="div" @close="closeModal" class="relative">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black-900 bg-opacity-25 z-[60]" />
      </TransitionChild>

      <div class="fixed inset-0 bg-black-900/25 z-[60]" aria-hidden="true" />

      <div class="fixed inset-0 overflow-y-auto z-[61]">
        <div class="flex min-h-full items-center justify-center text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel :class="modalClass">
              <div
                @click="emit('update:modelValue', false)"
                class="absolute right-2 top-2 cursor-pointer flex items-center"
              >
                <XMarkIcon
                  class="w-5 h-5 text-neutral-900"
                  aria-hidden="true"
                />
              </div>

              <div class="p-6 pt-3 min-h-[50px] pb-5">
                <slot />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
