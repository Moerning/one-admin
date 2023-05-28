<script setup>
import { onErrorCaptured, onMounted, reactive, ref, watch } from "vue";
import CardBox from "@/components/CardBox.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import { useNode } from "../../../graph-medium/node";
import { useRule } from "../../../graph-medium/rule";
import { useRoute } from "vue-router";
import { useBuilding } from "@/graph-medium/building";
import Treeselect from 'vue3-treeselect';
import 'vue3-treeselect/dist/vue3-treeselect.css';
import Toggle from '@vueform/toggle';

const props = defineProps({
  editableRuleId: {
    type: [String, Number],
    default: null,
  },
})

const { fetchRule, createRule, updateRule, getAllRules } = useRule()

const { fetchNodeChannels } = useNode()
const showSelect = ref(false)
const loading = ref(false)

const { buildingsTree, getAllControllers } = useBuilding()
const selectTreeOptions = ref([])
watch(() => buildingsTree.value, (o, n) => {
  if (o != n) {
    showSelect.value = false
    selectTreeOptions.value = []
    let controllerOptions = []
    for (let index = 0; index < n.length; index++) {
      const element = n[index];
      let controllers = element?.controllers
      if (controllers && controllers.length) {
        for (let i = 0; i < controllers.length; i++) {
          let nodeOptions = []
          const controller = controllers[i];
          let nodes = controller?.nodes
          let optionController = { id: controller.id, label: controller.id }
          if (nodes && nodes.length) {
            for (let j = 0; j < nodes.length; j++) {
              showSelect.value = false
              let channelOptions = []
              const node = nodes[j];
              loading.value = true
              let optionNode = { id: node.id, label: node.id }
              fetchNodeChannels(node.id).then((res) => {
                // showSelect.value = false
                let channels = res?.data?.data?.channel
                if (channels?.length) {
                  channels.forEach((ch) => {
                    let optionChannel = { id: ch.type, label: ch.type }
                    channelOptions.push(optionChannel)
                  })
                  optionNode['children'] = [...channelOptions]
                }
                nodeOptions.push(optionNode)
                optionController['children'] = [...nodeOptions]
              }).finally(() => {
                setTimeout(() => {
                  loading.value = false
                }, 300)
              })
            }
          }
          controllerOptions.push(optionController)
        }
      }
    }
    selectTreeOptions.value = [...controllerOptions]
    showSelect.value = true
  }
})

const editableRule = ref()

const getEditableRule = () => {
  // loading.value = true
  fetchRule(props.editableRuleId).then((res) => {
    let rule = res?.data?.data?.rule
    editableRule.value = rule[0]
    formRule.source = editableRule.value['source_channel_id']
    formRule.sourceVal = editableRule.value['desired_source_channel_value']
    formRule.targetVal = editableRule.value['desired_target_channel_value']
    formRule.target = editableRule.value['target_channel_id']
    formRule.status = editableRule.value['status']
    formRule.condition = editableRule.value['condition']
  }).finally(()=>{
    // loading.value = false
  })
}

const route = useRoute()

const prepareParams = () => {
  let params = {}
  params['source_channel'] = formRule.source
  params['source_channel_value'] = formRule.sourceVal
  params['target_channel'] = formRule.target
  params['target_channel_value'] = formRule.targetVal
  params['status'] = formRule.status
  params['id'] = Math.floor(Math.random() * (100000 - 2 + 1) + 2)
  params['condition'] = formRule.condition
  return params
}

const add = () => {
  let params = prepareParams()

  createRule({ ...params }).then(() => {
    location.reload();
  }).catch((e) => {
    alert('Operation Failed!')
    console.log(e)
  })
}

const edit = () => {
  let params = prepareParams()

  updateRule(props.editableRuleId, { ...params }).then(() => {
    location.reload();
  }).catch((e) => {
    alert('Operation Failed!')
    console.log(e)
  })
}

const update = () => {

}

const submit = () => {
  if(!props.editableRuleId)
    add()
  else
    edit()
};

onErrorCaptured((e) => {
  console.log({ e })
})

const formRule = reactive({
  source: null,
  target: null,
  condition: null,
  sourceVal: null,
  targetVal: null,
  status: true
})

const conditionOptions = ref([
  { label: ">", id: "gt" },
  { label: "=", id: "eq" },
  { label: "<", id: "lt" },
])


onMounted(()=>{
  if(props.editableRuleId){
    getEditableRule()
  }
})

const changeRuleStatus = () => {
  if(editableRule.value){
    formRule.status = !formRule.status
  }
}
</script>

<template>
    <div class="flex items-center pr-4 lg:pr-8 py-4 pl-2 text-[12px] rounded-[2rem] w-full rtl" :class="{
      'bg-blue-50':props.editableRuleId, 'bg-zinc-100':!props.editableRuleId
    }">
      <div class="flex items-center justify-between gap-5 rtl">
        <span class="h-8 flex items-center">اگر مقدار</span>
        <div class="w-[10rem] h-8 flex items-center" >
          <template v-if="showSelect && !loading">
            <treeselect placeholder="کانال مبدا" v-model="formRule.source" :multiple="false" :options="selectTreeOptions" />
          </template>
        </div>
        <!-- <span class="h-8 flex items-center">IS</span> -->
        <div class="w-[10rem] h-8 flex items-center">
          <template v-if="!loading">
            <treeselect placeholder="شرط" v-model="formRule.condition" :multiple="false" :options="conditionOptions" />
          </template>
        </div>
        <FormControl inputHeight="h-8" v-model="formRule.sourceVal" placeholder="Trigger" type="text" />
        <span class="h-8 flex items-center">بود، آنگاه مقدار</span>
        <div class="w-[10rem] h-8 flex items-center">
          <template v-if="showSelect && !loading">
            <treeselect placeholder="کانال مقصد" v-model="formRule.target" :multiple="false" :options="selectTreeOptions" />
          </template>
        </div>
        <span class="h-8 flex items-center">=</span>
        <FormControl inputHeight="h-8" v-model="formRule.targetVal" placeholder="Trigger" type="text" />
        <span class="h-8 flex items-center">باشد.</span>
      </div>
      <div class="flex justify-end flex-grow gap-2">
        <Toggle :value="formRule.status" @change="(v)=>changeRuleStatus()">
          <!-- <template v-slot:label="{ checked, classList }">
            <span :class="classList.label" class="text-[15px]">{{ checked ? 'روشن' : 'خاموش' }}</span>
          </template> -->
        </Toggle>
        <BaseButtons>
          <BaseButton type="submit" class="py-1 text-[14px] px-3" color="info" label="ذخیره" @click="submit" roundedFull/>
        </BaseButtons>
      </div>
    </div>
</template>
<style>

:root{
  --toggle-width: 4rem;
  --toggle-height: 2rem;
  --toggle-border: .25rem;
  --toggle-ring-width: 0px;
}

.rtl {
  direction: rtl;
}

.ltr {
  direction: ltr;
}

.vue-treeselect{
  text-align: right;
}

.vue-treeselect__control{
  direction: rtl;
}

/* .vue-treeselect__placeholder{
  @apply !leading-6 !text-[1rem];
} */

.vue-treeselect__input:focus {
  @apply outline-transparent border-transparent ring-0;
}
</style>
