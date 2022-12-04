<script setup>
import { reactive, ref } from "vue";
import { mdiAccount, mdiMail } from "@mdi/js";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import { useBuilding } from "../../../graph-medium/building";

const add = () => {
  const { createBuilding } = useBuilding()

  createBuilding( form.id, form.name, form.address ).then(()=>{
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
  add()
  //
};

</script>

<template>
      <CardBox form @submit.prevent="submit">
        <FormField label="Enter Building Info">
          <FormControl v-model="form.name" placeholder="Name" type="text" :icon="mdiAccount" />
          <FormControl v-model="form.id" placeholder="Id" type="text" />
          <FormControl v-model="form.address" placeholder="Address" type="text" />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Submit" />
            <BaseButton type="reset" color="info" outline label="Reset" />
          </BaseButtons>
        </template>
      </CardBox>
</template>
