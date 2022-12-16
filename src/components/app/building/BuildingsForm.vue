<script setup>
import { onUpdated, reactive, ref } from "vue";
import { mdiAccount, mdiMail } from "@mdi/js";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import { useBuilding } from "../../../graph-medium/building";
import { useRoute } from "vue-router";

const route = useRoute()
const editable = ref()

if(route.params.id){
  const { fetchBuilding } = useBuilding()
  fetchBuilding(route.params.id).then((response)=>{
    editable.value = response.data.data.building[0]
    form.name = editable.value.name
    form.id = editable.value.id
    form.address = editable.value.address
    form.lat = editable.value.lat
    form.long = editable.value.long
  })
}

const add = () => {
  const { createBuilding } = useBuilding()

  createBuilding( form.id, form.name, form.address ).then(()=>{
    alert('Successful Operation')
  }).catch(()=>{
    alert('Operation Failed!')
  })
}

const update = () => {
  const { updateBuilding } = useBuilding()

  updateBuilding( form.id, form.name, form.address, form.lat, form.long ).then(()=>{
    alert('Successful Operation')
  }).catch(()=>{
    alert('Operation Failed!')
  })
}


const form = reactive({
  id: "",
  name: "",
  type: "",
  address: "",
  lat: "",
  long: "",
  status: "",
  created_at: ""
});

const submit = () => {
  if(!route.params.id)
    add()
  else
    update()
  //
};

</script>

<template>
      <CardBox form @submit.prevent="submit">
        <FormField label="Enter Building Info">
          <FormControl v-model="form.name" placeholder="Name" type="text" :icon="mdiAccount" />
          <FormControl v-model="form.id" placeholder="Id" type="text" />
          <FormControl v-model="form.address" placeholder="Address" type="text" />
          <FormControl v-model="form.lat" placeholder="Latitude" type="text" />
          <FormControl v-model="form.long" placeholder="Longitude" type="text" />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Submit"  @click="submit"/>
            <BaseButton type="reset" color="info" outline label="Reset" />
          </BaseButtons>
        </template>
      </CardBox>
</template>
