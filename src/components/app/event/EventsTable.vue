<script setup>
import { mdiEye, mdiPencil, } from "@mdi/js";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useEvent } from "@/graph-medium/event.js";
import { useRoute } from "vue-router";

const route = useRoute()

const { fetchBuildingEvents } = useEvent()
const events = ref([])
fetchBuildingEvents(route.params.id).then((response)=>{
  events.value = response.data.data.event
})

const eventHeaders = [
    { label:'Id' },
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
        <td data-label="Id">
          {{ event.id }}
        </td>
        <td data-label="Name">
          {{ event.name }}
        </td>
        <!-- <td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            :title="building.created_at"
            >{{ building.created_at }}</small
          >
        </td> -->
        <!-- <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              @click="$router.push(`/buildings/show/${building.id}`)"
            />
            <BaseButton
              color="warning"
              :icon="mdiPencil"
              small
              @click="$router.push(`/buildings/form/${building.id}`)"
            />
          </BaseButtons>
        </td> -->
      </tr>
    </tbody>
  </table>
</template>
