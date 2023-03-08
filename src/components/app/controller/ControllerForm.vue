<script setup>
import { onUpdated, reactive, ref } from "vue";
import { mdiAccount, mdiMail } from "@mdi/js";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import { useController } from "../../../graph-medium/controller";
import { useRoute } from "vue-router";

const route = useRoute()
const editable = ref()

// if(route.params.id){
//   const { fetchBuilding } = useEvent()
//   fetchBuilding(route.params.id).then((response)=>{
//     editable.value = response.data.data.building[0]
//     form.name = editable.value.name
//     form.id = editable.value.id
//     form.address = editable.value.address
//     form.lat = editable.value.lat
//     form.long = editable.value.long
//   })
// }

const add = () => {
  const { createController } = useController()

  createController( {
    mac_address:form.mac_address,
    model:form.model,
    ip_local:form.ip_local,
    building_id:route.params.building_id,
    status:form.status
  } ).then(()=>{
    alert('Successful Operation')
  }).catch((e)=>{
    alert('Operation Failed!')
    console.log(e)
  })
}

const update = () => {
  
}

const statusOptions = [
  { id:0,label:"OFF"},
  { id:1,label:"ON"}
]

const form = reactive({
  mac_address:"",
  ip_local:"",
  model:"",
  building_id:"",
  status:0
});

const submit = () => {
    add()
};

</script>

<template>
      <CardBox form @submit.prevent="submit">
        <FormField label="Enter Node Info">
          <FormControl v-model="form.ip_local" placeholder="IP Local" type="text" />
          <FormControl v-model="form.mac_address" placeholder="MAC Address" type="text" />
          <FormControl v-model="form.model" placeholder="Model" type="text" />
          <FormField label="وضعیت">
            <FormControl class="text-sm ltr" v-model="form.status" :options="statusOptions" />
          </FormField>
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="تایید"  @click="submit"/>
            <BaseButton type="reset" color="info" outline label="بازنشانی" />
          </BaseButtons>
        </template>
      </CardBox>
</template>
<style>
.rtl{
  direction: rtl;
}
.ltr{
  direction: ltr;
}
</style>