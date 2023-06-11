<script setup>
import { mdiClose,mdiPlus } from "@mdi/js";
import { useRoute } from "vue-router";
import { ref,reactive } from "vue";
import PillTag from "@/components/PillTag.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import { useBuilding } from "../../../graph-medium/building";

const route = useRoute()

const { fetchBuildingAccounts } = useBuilding()
const relations = ref([])


const getRelations = async () => {
    try {
        const { data } = await fetchBuildingAccounts() 
        relations.value = data.data.building
        debugger
    } catch (error) {
        
    }
}

const accountBuildingHeaders = [
  { label: 'Building Id' },
  { label: 'Building Name' },
  { label: 'Building Account' },
]

getRelations()

</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="header in accountBuildingHeaders">
          {{ header.label }}
        </th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="relation in relations" :key="relation.id">
        <td data-label="Building Id" class="text-blue-400">
            <router-link :to="{ name:`BuildingShowId`, params:{ id:relation.id } }"> 
                {{ relation.id }}
            </router-link>
        </td>
        <td data-label="Building Name">
          {{ relation.name }}
        </td>
        <td data-username="Building Account">
          {{ relation.account_id }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
