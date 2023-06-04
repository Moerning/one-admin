<script setup>
import { ref, watch } from "vue";
import CardBox from "@/components/CardBox.vue";
import { useRule } from "../../../graph-medium/rule";
import RuleForm from "./RuleForm.vue";
import BaseButton from "@/components/BaseButton.vue";
import { mdiPlus } from '@mdi/js'
const { getAllRules, rules } = useRule()

getAllRules()

const adding = ref(false)
const loading = ref(false)
const addNew = () => {
  adding.value = true
}

watch(rules , (v)=>{
  adding.value = false
  loading.value = true
  setTimeout(()=>{
    loading.value = false
  }, 200)
})
</script>

<template>
  <CardBox>
    <div class="flex flex-col items-start gap-y-4">
        <div class="flex justify-between items-start w-full p-5 gap-10">
          <BaseButton :icon="mdiPlus" small roundedFull color="success" label="افزودن" @click="addNew" />
          <h2 class="text-[16px] font-[600]">دستور ها</h2>
        </div>
        <template v-if="!loading">
          <template v-for="(rule,i) in rules" :key="i">
              <RuleForm :editable-rule-id="rule.id" />
          </template>
        </template>
        <div v-show="adding && !loading" class="w-full">
          <RuleForm key="add-new"/>
        </div>
    </div>
  </CardBox>
</template>
<style>
.rtl {
  direction: rtl;
}

.ltr {
  direction: ltr;
}

/* .vue-treeselect__control{
  @apply h-12 flex items-center pt-0 pb-0;
}

.vue-treeselect__placeholder{
  @apply !leading-6 !text-[1rem];
} */

.vue-treeselect__input:focus {
  @apply outline-transparent border-transparent ring-0;
}
</style>
