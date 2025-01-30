<script setup lang="ts">

const emit = defineEmits(['cancel'])
const props = defineProps({
  request:Object
})
</script>

<template>
  <div class="flex">
    <div class="w-full" v-if="props.request">
      <div class="flex py-3">
        <div class="w-11/12 mx-auto">
          <span class="font-bold">Payload Details</span>
        </div>
      </div>
      <div class="flex">
        <div class="w-11/12 mx-auto bg-gray-50 p-2 rounded">
          <pre class="text-left text-xs text-green-600 font-bold">{{JSON.parse(props.request?.payload)}}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/table.css";
</style>