<script setup>
import { mdiEye, mdiPencil, mdiAlarmCheck } from "@mdi/js";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useNode } from "../../../graph-medium/node";

// GET NODES
const { nodes } = useNode()

const nodeHeaders = [
    { label:'Id' },
    { label: 'Model' },
    { label: 'Description' },
    { label: 'Controller' },
    { label: 'Status' },
]

</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="header in nodeHeaders">
            {{ header.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="node in nodes" :key="node.id">
        <td data-label="Id">
          {{ node.id }}
        </td>
        <td data-label="Model">
          {{ node.model }}
        </td>
        <td data-label="Description" class="lg:w-32">
            <p
                class="flex w-2/5 self-center lg:w-full max-w-[100px]"
            >
                {{ node.description }}
            </p>
        </td>
        <td data-label="Controller">
            <router-link as="a" :to="`/controllers/show/${node.controller_id}`">
                {{ node.controller_id }}
            </router-link>
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton
              color="info"
              :icon="mdiEye"
              small
              @click="$router.push(`/nodes/show/${node.id}`)"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
  <div>
    <BaseButton label="افزودن نود" @click="$router.push({ name:'AddSimpleNodeForm' })"/>
  </div>
</template>
<style scoped>
#mapContainer {
    width: 600px;
    height: 300px;
}
</style>