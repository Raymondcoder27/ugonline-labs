<script setup lang="ts">

import {useSettingsStore} from "@/tilloperatordomain/settings/stores";

const store = useSettingsStore()
</script>

<template>
  <div class="bg-white py-5">
    <div class="flex">
      <div class="w-full text-xs">
        <table class="table">
          <thead>
          <tr class="header-tr">
            <th class="t-header">#</th>
            <th class="t-header">Name</th>
            <th class="t-header">Enumeration</th>
          </tr>
          </thead>
          <tbody v-if="store.accessibilityTiers">
          <tr class="body-tr"
              v-for="(tier, idx) in store.accessibilityTiers"
              :key="idx">
            <td class="text-xs">
              {{idx + 1}}
            </td>
            <td class="text-xs uppercase">
              <span>{{tier.text}}</span>
            </td>
            <td class="text-xs">
              <span class="uppercase font-bold">{{tier.value}}</span>
            </td>
          </tr>
          </tbody>
          <tbody v-else>
          <tr class="body-tr px-5">
            <td class="text-xs text-center bg-gray-100" colspan="12">No features found</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/forms.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";
</style>