<script setup>
import { computed } from "vue";
import {
  mdiCashMinus,
  mdiCashPlus,
  mdiReceipt,
  mdiCreditCardOutline,
} from "@mdi/js";
import CardBox from "@/components/CardBox.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import PillTag from "@/components/PillTag.vue";
import BaseIcon from "@/components/BaseIcon.vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  number:{
    type: String,
    required: true,
  },
  to:{
    required:true
  },
  icon:{
    required:true
  }
});

</script>

<template>
  <CardBox class="mb-6 last:mb-0 rtl" is-hoverable>
    <BaseLevel>
      <BaseLevel type="justify-start text-slate-500">
        <BaseIcon :path="icon" size="45"/>
        <div class="text-center space-y-1 md:text-left md:mr-6 text-gray-900">
          <h4 class="text-xl">{{ name }}</h4>
          <!-- <p class="text-gray-500 dark:text-slate-400">
            {{ number }}
          </p> -->
        </div>
      </BaseLevel>
      <div class="text-center space-y-2">
        <p class="text-sm text-gray-500">
          {{ `تعداد ${name} :` }}
        </p>
        <div>
          <PillTag color="info" :label="`${number}  ${name.split(' ها')[0]}`" small />
        </div>
      </div>
    </BaseLevel>
  </CardBox>
</template>
<style>
.rtl{
    direction: rtl;
}
</style>
