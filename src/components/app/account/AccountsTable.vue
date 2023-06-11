<script setup>
import { mdiClose,mdiPlus } from "@mdi/js";
import { useAccount } from "@/graph-medium/account.js";
import { useRoute } from "vue-router";
import { ref,reactive } from "vue";
import PillTag from "@/components/PillTag.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";

const route = useRoute()

const { getAllAccounts, getBuildingAccounts } = useAccount()
const accounts = ref([])
const relations = ref([])
const addRelationModal = ref(false)
const targetAccount = ref()

const form = reactive({
    building:"",
    account:""
})

const openModal = (account) => {
    targetAccount.value = account
    addRelationModal.value = true
}

const getRelations = async () => {
    try {
        const { data } = await getBuildingAccounts() 
        relations.value = data.data.building_account
        showAccounts()
    } catch (error) {
        
    }
}

const showAccounts = async () => {
    try {
        const { data } = await getAllAccounts()
        accounts.value = data.data.account
        setUsersBuildings()
    } catch (error) {
        
    }
}

const setUsersBuildings = () => {
    accounts.value.forEach((account,index)=>{
        accounts.value[index].buildings = []
        relations.value.forEach((relation)=>{
            if(relation.account_id == account.id){
                accounts.value[index].buildings.push(relation.building_id)
            }
        })
    })
}

getRelations()

const accountHeaders = [
  { label: 'Id' },
  { label: 'Name' },
  { label: 'Username' },
  { label: 'Buildings' },
]

const deleteBuilding = (building) => {
    alert(building)
}
</script>

<template>
  <table v-if="accounts.length">
    <thead>
      <tr>
        <th v-for="header in accountHeaders">
          {{ header.label }}
        </th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="account in accounts" :key="account.id">
        <td data-label="Id">
          {{ account.id }}
        </td>
        <td data-label="Name">
          {{ account.name }}
        </td>
        <td data-username="Username">
          {{ account.name }}
        </td>
        <td data-buildings="Buildings">
            <span v-for="building in account.buildings" @click="() => deleteBuilding(building)" class="cursor-pointer">
                <PillTag :icon="mdiClose" :label="building" color="success" :key="building" class="mx-1" />
            </span>
            <span @click="() => openModal(account)" class="cursor-pointer">
                <PillTag :icon="mdiPlus" label="افزودن دسترسی" color="info"/>
            </span>
        </td>
      </tr>
    </tbody>
  </table>
  <CardBoxModal
      v-model="addRelationModal"
      :title="`افزودن دسترسی به کاربر ${targetAccount ? targetAccount.name : ''}`"
      button-label="تایید"
      has-cancel
    >
        <FormField label="آیدی ساختمان مورد نظر را وارد کنید">
          <FormControl v-model="form.building" placeholder="Building_id" type="text"  />
        </FormField>
    </CardBoxModal>
</template>
