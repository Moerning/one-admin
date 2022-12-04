<script setup>
import { computed, ref } from "vue";
import { useMainStore } from "@/stores/main";
import { mdiEye, mdiTrashCan } from "@mdi/js";
import CardBoxModal from "@/components/CardBoxModal.vue";
import TableCheckboxCell from "@/components/TableCheckboxCell.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useBuilding } from "@/graph-medium/building.js"

const { buildingsTree } = useBuilding()

const buildingHeaders = [
    { label:'Id' },
    { label: 'Name' },
    { label: 'Address' },
    { label: 'Type' },
    { label: 'Latitude' },
    { label: 'Longitude' },
    { label: 'Status' },
    { label: 'Created_At' },
]
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="header in buildingHeaders">
            {{ header.label }}
        </th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="building in buildingsTree" :key="building.id">
        <td data-label="Id">
          {{ building.id }}
        </td>
        <td data-label="Name">
          {{ building.name }}
        </td>
        <td data-label="Address" class="lg:w-32">
            <p
                class="flex w-2/5 self-center lg:w-full max-w-[100px]"
            >
                {{ building.address }}
            </p>
        </td>
        <td data-label="Type">
          {{ building.type }}
        </td>
        <td data-label="Latitude">
          {{ building.lat }}
        </td>
        <td data-label="Longitude">
          {{ building.long }}
        </td>
        <td data-label="Status">
          {{ building.status }}
        </td>
        <td data-label="Created" class="lg:w-1 whitespace-nowrap">
          <small
            class="text-gray-500 dark:text-slate-400"
            :title="building.created_at"
            >{{ building.created_at }}</small
          >
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              @click="isModalActive = true"
            />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="isModalDangerActive = true"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
</template>
