<script setup>
import { onUpdated, reactive, ref } from "vue";
import { mdiAccount, mdiMail,mdiPhone,mdiCalendar,mdiFormTextboxPassword, mdiAccountBadge } from "@mdi/js";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import { useAccount } from "@/graph-medium/account.js"
const add = () => {
  const { createAccount } = useAccount()

  let params = { ...form }
  createAccount(params).then(()=>{
    alert('Successful Operation')
  }).catch((error)=>{
    alert('Operation Failed!')
    console.log({error})
  })
}

const form = reactive({
    role: "",
    mobile_number: "",
    name: "",
    password: "",
    email: "",
    age: "",
    username: ""
});

const submit = () => {
    add()
};

</script>

<template>
      <CardBox form @submit.prevent="submit" :style="{ 'direction':'rtl'}">
        <FormField label="اطلاعات کاربری خود را وارد نمائید">
          <FormControl class="mt-5" v-model="form.name" placeholder="نام" type="text" :icon="mdiAccount"/>
          <FormControl v-model="form.age" placeholder="سن" type="text" :icon="mdiCalendar"/>
          <FormControl v-model="form.username" placeholder="نام کاربری" type="text" :icon="mdiAccountBadge"/>
          <FormControl v-model="form.password" placeholder="گذرواژه" type="text" :icon="mdiFormTextboxPassword" />
          <FormControl v-model="form.mobile_number" placeholder="شماره تلفن همراه" type="text" :icon="mdiPhone" />
          <FormControl v-model="form.email" placeholder="ایمیل" type="text" :icon="mdiMail" />
        </FormField>

        <template #footer>
          <BaseButtons>
            <BaseButton :style="{ 'margin-left':'1rem' }" type="submit" color="info" label="ثبت"  @click="submit"/>
            <BaseButton @click="$router.push( { name: 'LoginForm' } )" type="reset" color="info" outline label="انصراف" />
          </BaseButtons>
        </template>
      </CardBox>
</template>
