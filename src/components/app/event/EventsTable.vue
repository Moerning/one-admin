<script setup>
import { mdiEye, mdiPencil, } from "@mdi/js";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useEvent } from "@/graph-medium/event.js";
import { useRoute } from "vue-router";
import { ref } from "vue";
const route = useRoute()

const { fetchBuildingEvents } = useEvent()
const events = ref([])
fetchBuildingEvents(route.params.id).then((response) => {
  events.value = response.data.data.event
})

const eventHeaders = [
  { label: 'Id' },
  { label: 'MAC_ADDRESS' },
]
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="header in eventHeaders">
          {{ header.label }}
        </th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="event in events" :key="event.id">
        <td data-id="Id">
          {{ event.id }}
        </td>
        <td data-label="Name">
          {{ event.name }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
