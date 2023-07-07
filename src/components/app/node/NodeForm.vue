<script setup>
import { computed, reactive, ref, watchEffect } from "vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import { useNode } from "../../../graph-medium/node";
import { useRoute } from "vue-router";
import {useBuilding} from "@/graph-medium/building";

const { getAllControllers } = useBuilding()

const route = useRoute()
const editable = ref()

const add = () => {
  const { createNode } = useNode()
  createNode({
    description: form.description,
    model: form.model,
    ip_local: form.ip_local,
    controller_id: form.controller.id,
    id: form.id,
    statuses: form.status?.id ? true : false,
  }).then(() => {
    alert('Successful Operation')
  }).catch((e) => {
    alert('Operation Failed!')
    console.log(e)
  })
}

const update = () => {

}

const controllerOptions = computed(()=>{
  let options = []
  getAllControllers.value.forEach((o)=>{
    options.push({
      id:o.id,
      label:o.model ? o.model : o.id
    })
  })
  return options
})

const statuses = [
  { id:1 , label :"ON" },
  { id:0 , label :"OFF" },
]

const form = reactive({
  id:"",
  description: "",
  ip_local: "",
  model: "",
  controller:"",
  lat:"",
  long:"",
  status:0
});

watchEffect(()=>{
  if(route.params.controller_id && controllerOptions.value.length){
    let controller = controllerOptions.value.filter((c)=>{
      return c.id == route.params.controller_id
    })
    if(controller.length){
      form.controller = controller[0]
    }
  }
})

const submit = () => {
  add()
};

</script>

<template>
  <CardBox form @submit.prevent="submit" class="rtl">
    <FormField label="Enter Node Info">
      <FormControl v-model="form.id" placeholder="ID" type="text" />
      <FormControl v-model="form.ip_local" placeholder="IP Local" type="text" />
      <FormControl v-model="form.model" placeholder="Model" type="text" />
      <FormControl v-model="form.description" placeholder="Description" type="text" />
      <FormField label="کنترلر">
        <FormControl class="text-sm ltr" v-model="form.controller" :options="controllerOptions" />
      </FormField>
      <FormField label="وضعیت">
        <FormControl class="text-sm ltr" v-model="form.status" :options="statuses" />
      </FormField>
    </FormField>

    <template #footer>
      <BaseButtons>
        <BaseButton type="submit" class="mx-5" color="info" label="تایید" @click="submit" />
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
