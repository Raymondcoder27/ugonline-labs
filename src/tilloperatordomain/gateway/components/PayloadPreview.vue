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
          <span class="font-bold">Request Details</span>
        </div>
      </div>
      <div class="flex py-1">
        <div class="w-11/12 mx-auto">
          <table>
            <tbody>
              <tr>
                <td><span class="font-bold">Method</span></td>
                <td><span class="bg-primary-700 p-1 text-white rounded-sm">{{props.request?.method}}</span></td>
              </tr>
              <tr>
                <td><span class="font-bold">Endpoint</span></td>
                <td><span class="font-mono text-green-600">{{props.request?.endpoint}}</span></td>
              </tr>
              <tr>
                <td><span class="font-bold">Response Code</span></td>
                <td class="font-mono"><span v-if="props.request?.responseCode" :class="(props.request?.succeededAt.Valid) ? 'text-green-600' : 'text-red-600'">{{props.request?.responseCode.Int32}}</span></td>
              </tr>
              <tr>
                <td><span class="font-bold">Success</span></td>
                <td class="font-mono"><span :class="(props.request?.succeededAt.Valid) ? 'text-green-600' : 'text-red-600'">{{props.request?.succeededAt.Valid}}</span></td>
              </tr>
              <tr>
                <td><span class="font-bold">Error</span></td>
                <td class="font-mono">
                  <span :class="(props.request?.error.Valid) ? 'text-green-600' : 'text-red-600'">{{props.request?.error.Valid}}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="flex py-3">
        <div class="w-11/12 mx-auto">
          <span class="font-bold">Request Headers</span>
        </div>
      </div>

      <div class="flex">
        <div class="w-11/12 mx-auto bg-gray-50 p-2 rounded">
          <pre class="text-left text-xs text-primary-800">{{props.request?.headers}}</pre>
        </div>
      </div>

      <div class="flex py-3">
        <div class="w-11/12 mx-auto">
          <span class="font-bold">Request Payload</span>
        </div>
      </div>

      <div class="flex">
        <div class="w-11/12 mx-auto bg-gray-50 p-2 rounded">
          <pre class="text-left text-xs text-green-600 font-bold">{{JSON.parse(props.request?.payload)}}</pre>
        </div>
      </div>

      <div class="flex py-3">
        <div class="w-11/12 mx-auto">
          <span class="font-bold">Response Headers</span>
        </div>
      </div>

      <div class="flex">
        <div class="w-11/12 mx-auto bg-gray-50 p-2 rounded">
          <pre class="text-left text-xs text-orange-600" v-if="props.request?.responseHeaders">{{props.request?.responseHeaders}}</pre>
        </div>
      </div>

      <div class="flex py-3">
        <div class="w-11/12 mx-auto">
          <span class="font-bold">Response Body</span>
        </div>
      </div>

      <div class="flex">
        <div class="w-11/12 mx-auto bg-gray-50 p-2 rounded">
          <pre class="text-left text-xs text-orange-600" v-if="props.request?.responseBody">{{props.request?.responseBody}}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/table.css";
</style>