<script setup>
import { ref, watch } from "vue";
import CardBox from "@/components/CardBox.vue";
import { useRule } from "../../../graph-medium/rule";
import RuleForm from "./RuleForm.vue";
import BaseButton from "@/components/BaseButton.vue";
import { mdiPlus } from '@mdi/js';
import { useBuilding } from "../../../graph-medium/building";
import { useNode } from "../../../graph-medium/node";

const { buildingsTree } = useBuilding()
const { fetchNodeChannels } = useNode()

const { getAllRules, rules } = useRule()

getAllRules()

const adding = ref(false)
const loading = ref(false)
const addNew = () => {
  adding.value = true
}

watch(rules, (v) => {
  adding.value = false
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 200)
})

const createOptionTree = async (bTree) => {
  let controllerOptions = []
  loading.value = true
  for (let index = 0; index < bTree.length; index++) {
    const building = bTree[index];
    let controllers = building?.controllers
    for (let i = 0; i < controllers.length; i++) {
      const controller = controllers[i];
      let nodes = controller?.nodes
      let optionController = { id: controller.id, label: controller.id, isDisabled: true }
      if (nodes && nodes.length) {
        let nodeOptions = []
        for (let j = 0; j < nodes.length; j++) {
          let channelOptions = []
          const node = nodes[j];
          let optionNode = { id: node.id, label: node.id, isDisabled: true }
          try {
            const { data } = await fetchNodeChannels(node.id)
            let channels = data?.data?.channel
            if (channels?.length) {
              channels.forEach((ch) => {
                let optionChannel = { id: ch.id, label: ch.type }
                channelOptions.push(optionChannel)
              })
            }
          } catch (error) {

          }
          if(channelOptions.length)
            optionNode['children'] = [...channelOptions]
          nodeOptions.push(optionNode)
        }
        optionController['children'] = [...nodeOptions]
      }
      controllerOptions.push(optionController)
    }
  }
  selectTreeOptions.value = controllerOptions
}

const selectTreeOptions = ref([])

watch(buildingsTree, (newVal,oldVal) => {
  if(newVal !== oldVal){
    createOptionTree(newVal)
    loading.value = false
  }
})

</script>

<template>
  <CardBox>
    <div class="flex flex-col items-start gap-y-4">
      <div class="flex justify-between items-start w-full p-5 gap-10">
        <BaseButton :icon="mdiPlus" small roundedFull color="success" label="افزودن" @click="addNew" />
        <h2 class="text-[16px] font-[600]">دستور ها</h2>
      </div>
      <template v-if="!loading && selectTreeOptions.length">
        <template v-for="(rule, i) in rules" :key="i">
          <RuleForm :channel-tree-options="selectTreeOptions" :editable-rule-id="rule.id" />
        </template>
      </template>
      <div v-show="adding && !loading && selectTreeOptions.length" class="w-full">
        <RuleForm :channel-tree-options="selectTreeOptions" key="add-new" />
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
