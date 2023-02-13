<script setup>
import { onUpdated, reactive, ref } from "vue";
import { mdiAccount, mdiMail,mdiPhone,mdiCalendar,mdiFormTextboxPassword, mdiAccountBadge } from "@mdi/js";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import { useAccount } from "@/graph-medium/account.js"

const loginResult = ref()
const disable = ref(false)
const login = async () => {
  const { attemptLogin } = useAccount()
  disable.value = true
  let params = { ...form }

  try {
    loginResult.value = await attemptLogin(params)
  } catch (error) {
    loginResult.value = error  
  } finally {
    disable.value = false
  }
}

const form = reactive({
    password: "",
    username: ""
});

const submit = () => {
    login()
};

</script>

<template>
      <CardBox form @submit.prevent="submit" :style="{ 'direction':'rtl'}">
        <FormField label="اطلاعات کاربری خود را وارد نمائید">
          <FormControl class="mt-5" v-model="form.username" placeholder="نام کاربری" type="text" :icon="mdiAccount"/>
          <FormControl class="mt-5" v-model="form.password" placeholder="گذرواژه" type="text" :icon="mdiCalendar"/>
        </FormField>

        <template #footer>
          <BaseButtons>
            <div class="w-full flex justify-between items-center">
                <div>
                    <BaseButton :disabled="disable" :style="{ 'margin-left':'1rem' }" type="submit" color="info" label="ورود"  @click="submit"/>
                    <BaseButton @click="$router.push('/')" type="reset" color="info" outline label="انصراف" />
                </div>
                <div>
                    <BaseButton color="info" @click="$router.push({ name:'AccountForm' })" outline label="ثبت نام" />
                </div>
            </div>
          </BaseButtons>
        </template>
        {{ loginResult }}
      </CardBox>
</template>
